/**
 * AI Chat Service
 * Handles communication with LLM for farm-related questions
 */

import { CROP_PROFILES } from '../utils/constants';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const USE_OPENAI = !!API_KEY;

/**
 * Generate context about the farm for the LLM
 */
export const generateFarmContext = (trays, sensorData, aiScores) => {
  const context = {
    totalTrays: Object.keys(trays).length,
    trays: Object.entries(trays).map(([id, tray]) => ({
      id,
      crop: tray.crop?.name || 'Unassigned',
      status: tray.status,
      aiScore: aiScores[id] || 0,
      currentSensorData: sensorData[id] || {},
    })),
    averageHealth: Object.values(aiScores || {}).length > 0
      ? Math.round(Object.values(aiScores).reduce((a, b) => a + b, 0) / Object.keys(aiScores).length)
      : 0,
  };
  return context;
};

/**
 * Generate a system prompt with farm context
 */
const buildSystemPrompt = (farmContext) => {
  const trayDetails = farmContext.trays
    .map((t) => `Tray ${t.id}: ${t.crop} (Status: ${t.status}, Health Score: ${t.aiScore}%, Last Reading: ${JSON.stringify(t.currentSensorData)})`)
    .join('\n');

  return `You are an expert agricultural AI assistant for an indoor vertical farm system called Farmsense. 
Your role is to help farmers improve their crop yields and farm operations.

Current Farm Status:
- Total Active Trays: ${farmContext.totalTrays}
- Average Farm Health: ${farmContext.averageHealth}%

Tray Details:
${trayDetails}

You provide:
1. Recommendations based on sensor data and crop requirements
2. Troubleshooting for low sensor readings or tray issues
3. Optimization suggestions for water usage, temperature, humidity, and pH
4. Crop-specific guidance
5. Explanations of AI recommendations
6. Predictions about harvest timing and yield

Always reference specific tray IDs and sensor readings when giving advice.
Provide actionable, practical recommendations that farmers can implement.
When uncertain, ask clarifying questions about specific trays or crops.`;
};

/**
 * Call OpenAI API (if key is available)
 */
const callOpenAI = async (messages, systemPrompt) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API call failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

/**
 * Fallback rule-based responses (no API key needed)
 */
const generateFallbackResponse = (userMessage, farmContext) => {
  const lowerMessage = userMessage.toLowerCase();

  // General farm status
  if (lowerMessage.includes('how') && lowerMessage.includes('farm')) {
    const avgHealth = farmContext.averageHealth;
    if (avgHealth >= 80) {
      return `Your farm is performing excellently! Average health score is ${avgHealth}%. All ${farmContext.totalTrays} trays are operating optimally. Continue monitoring sensor readings and maintain current conditions.`;
    } else if (avgHealth >= 60) {
      return `Your farm health is good at ${avgHealth}%. Most trays are performing well. Consider reviewing trays with lower scores and checking their sensor configurations.`;
    } else {
      return `Your farm health needs attention (${avgHealth}%). Check sensor readings, calibration, and crop assignments. Some trays may need environmental adjustments.`;
    }
  }

  // Tray-specific questions
  if (lowerMessage.includes('tray')) {
    const trayMatches = userMessage.match(/tray\s*([a-f])/i);
    if (trayMatches) {
      const trayId = trayMatches[1].toUpperCase();
      const tray = farmContext.trays.find((t) => t.id === trayId);
      if (tray) {
        return `Tray ${trayId} Status:\n- Crop: ${tray.crop}\n- Status: ${tray.status}\n- Health Score: ${tray.aiScore}%\n- Sensors: Temp ${tray.currentSensorData.temperature}°C, Humidity ${tray.currentSensorData.humidity}%, pH ${tray.currentSensorData.ph}`;
      }
    }
    return `Please specify which tray (A-F) you'd like information about.`;
  }

  // Temperature questions
  if (lowerMessage.includes('temperature')) {
    return `Temperature Management:\n- Monitor each crop's optimal range in your crop profiles\n- Current readings are shown in real-time on the Hardware Sensor Interface\n- Use AC controls if temperature is too high\n- Check insulation if temperature drops unexpectedly`;
  }

  // Humidity questions
  if (lowerMessage.includes('humidity')) {
    return `Humidity Management:\n- Most crops prefer 60-80% humidity\n- Use humidifiers if readings are low\n- Improve ventilation if humidity is too high\n- Check for water leaks or excess condensation`;
  }

  // pH questions
  if (lowerMessage.includes('ph')) {
    return `pH Level Management:\n- Most crops need pH 6.0-7.5\n- Adjust nutrient solution if pH drifts\n- Test pH regularly with your sensors\n- pH changes affect nutrient availability to roots`;
  }

  // Yield/harvest questions
  if (lowerMessage.includes('yield') || lowerMessage.includes('harvest')) {
    return `Yield Optimization:\n- Check ML Insights for harvest predictions\n- Ensure optimal temperature, humidity, and pH throughout growth\n- Monitor water usage and nutrient levels\n- Review historical data to identify patterns`;
  }

  // Recommendations
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    return `I recommend:\n1. Check the ML Insights page for crop-specific predictions\n2. Review each tray's sensor readings on the Dashboard\n3. Compare current conditions to optimal ranges\n4. Use Analytics to track trends over time\n5. Adjust one parameter at a time to isolate improvements`;
  }

  // Default response
  return `I can help with questions about your farm's sensor data, crop recommendations, and optimization. Ask me about:\n- Specific trays (e.g., "How is Tray A?")\n- Sensor readings (temperature, humidity, pH)\n- Crop-specific guidance\n- Harvest predictions\n- Farm optimization tips\n\nWhat would you like to know?`;
};

/**
 * Main chat function
 */
export const chatWithFarmAI = async (userMessage, farmContext, conversationHistory = []) => {
  if (!userMessage.trim()) {
    return 'Please ask a question about your farm or AI recommendations.';
  }

  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  try {
    if (USE_OPENAI) {
      const systemPrompt = buildSystemPrompt(farmContext);
      const response = await callOpenAI(messages, systemPrompt);
      return response;
    } else {
      // Use fallback rule-based system
      return generateFallbackResponse(userMessage, farmContext);
    }
  } catch (error) {
    console.error('AI chat error:', error);
    // Fall back to rule-based if API fails
    return generateFallbackResponse(userMessage, farmContext);
  }
};

/**
 * Get quick AI suggestions based on farm state
 */
export const getQuickAISuggestions = (farmContext) => {
  const suggestions = [];

  // Check low-health trays
  const lowHealthTrays = farmContext.trays.filter((t) => t.aiScore < 60);
  if (lowHealthTrays.length > 0) {
    suggestions.push({
      severity: 'warning',
      message: `${lowHealthTrays.length} tray(s) have health scores below 60%. Click to ask for optimization tips.`,
    });
  }

  // Average health check
  if (farmContext.averageHealth < 70) {
    suggestions.push({
      severity: 'info',
      message: `Farm average health is ${farmContext.averageHealth}%. Ask the AI for farm-wide optimization strategies.`,
    });
  }

  // High-performing farm
  if (farmContext.averageHealth >= 85) {
    suggestions.push({
      severity: 'success',
      message: `Excellent farm performance! Ask about advanced optimization or next harvest planning.`,
    });
  }

  return suggestions;
};
