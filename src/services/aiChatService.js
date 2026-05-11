/**
 * AI Chat Service
 * Handles communication with LLM for farm-related questions
 * Uses Claude (best reasoning) with fallback to OpenAI and rule-based system
 */

import { CROP_PROFILES } from '../utils/constants';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const USE_CLAUDE = !!CLAUDE_API_KEY;
const USE_OPENAI = !!OPENAI_API_KEY;

/**
 * Generate context about the farm for the LLM
 */
export const generateFarmContext = (areas, sensorData, aiScores) => {
  const context = {
    totalAreas: Object.keys(areas).length,
    areas: Object.entries(areas).map(([id, area]) => ({
      id,
      crop: area.crop?.name || 'Unassigned',
      cropKey: area.cropKey || '',
      status: area.status,
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
 * Get optimal ranges for crops from constants
 */
const getCropOptimalRanges = (cropKey) => {
  return CROP_PROFILES[cropKey] || null;
};

/**
 * Generate a detailed system prompt with clear reasoning for explanations
 */
const buildSystemPrompt = (farmContext) => {
  const areaDetails = farmContext.areas
    .map((area) => {
      const cropProfile = getCropOptimalRanges(area.cropKey);
      let details = `
Area ${area.id}: ${area.crop}
  Status: ${area.status}
  Health Score: ${area.aiScore}%
  Current Sensors: Temperature: ${area.currentSensorData.temperature || 'N/A'}°C, Humidity: ${area.currentSensorData.humidity || 'N/A'}%,  pH: ${area.currentSensorData.ph || 'N/A'}`;
      
      if (cropProfile) {
        details += `
  Optimal Ranges: 
    - Temperature: ${cropProfile.optimalTemp.min}°C - ${cropProfile.optimalTemp.max}°C
    - Humidity: ${cropProfile.optimalHumidity.min}% - ${cropProfile.optimalHumidity.max}%
    - pH: ${cropProfile.optimalPH.min} - ${cropProfile.optimalPH.max}`;
      }
      return details;
    })
    .join('\n');

  return `You are a friendly agricultural expert AI assistant for Farmsense, an indoor vertical farm system.
Your role is to help farmers understand their crops and farm operations clearly.

IMPORTANT INSTRUCTIONS:
1. ALWAYS explain your reasoning in simple, clear language (as if speaking to someone who doesn't know much about farming)
2. When giving recommendations, explain WHY the recommendation helps the crop
3. Reference specific sensor readings and what they mean for the crop
4. Break down complex information into easy steps
5. Use analogies that non-technical people understand
6. Be encouraging and supportive

CURRENT FARM STATUS:
- Total Growing Areas: ${farmContext.totalAreas}
- Overall Farm Health Score: ${farmContext.averageHealth}%

AREAS AND THEIR CONDITIONS:
${areaDetails}

WHAT YOU DO WELL:
1. Explain what sensor readings mean in everyday language
2. Compare current conditions to what crops need and explain gaps
3. Give step-by-step actions farmers can take
4. Predict harvest timing and yields with reasoning
5. Troubleshoot problems by asking questions
6. Celebrate successes and provide constructive feedback

RESPONSE STYLE:
- Use short, clear sentences
- Avoid technical jargon or explain it simply
- Give specific numbers and ranges
- Explain cause and effect
- Suggest one action at a time when possible
- Acknowledge if something is good, needs attention, or needs urgent action

EXAMPLE FORMAT:
Instead of: "Optimize nutrient ratios for vegetative growth"
Say: "Your tomato is growing the leaves and stems right now (vegetative stage). The pH of 6.5 is perfect for nutrient uptake. Continue checking daily - you're doing great!"`;
};

/**
 * Call Claude API (via Anthropic) - Best reasoning model
 */
const callClaude = async (messages, systemPrompt) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Best reasoning model for explanations
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API call failed');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
};

/**
 * Call OpenAI API (fallback reasoning model)
 */
const callOpenAI = async (messages, systemPrompt) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Latest advanced reasoning model
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API call failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

/**
 * Generate detailed, reasoning-based fallback responses
 * Explains things in simple language that anyone can understand
 */
const generateFallbackResponse = (userMessage, farmContext) => {
  const lowerMessage = userMessage.toLowerCase();

  // Helper function to explain sensor readings
  const explainReading = (sensorName, value, optimal) => {
    if (!optimal || value === undefined) return '';
    
    const { min, max } = optimal;
    if (value < min) {
      return `${sensorName} is ${value} - this is LOWER than ideal (${min}-${max}). Think of it like your house being too cold.`;
    } else if (value > max) {
      return `${sensorName} is ${value} - this is HIGHER than ideal (${min}-${max}). Think of it like your house being too hot.`;
    }
    return `${sensorName} is ${value} - this is PERFECT (ideal range: ${min}-${max}). Keep it like this!`;
  };

  // AREA STATUS - Give detailed explanation
  if (lowerMessage.includes('area') || lowerMessage.includes('how') && lowerMessage.includes('doing')) {
    const areaMatches = userMessage.match(/area\s*([a-f])/i);
    let response = '';
    
    if (areaMatches) {
      const areaId = areaMatches[1].toUpperCase();
      const area = farmContext.areas.find((t) => t.id === areaId);
      if (area) {
        const cropProfile = getCropOptimalRanges(area.cropKey);
        
        response = `🌱 **Area ${areaId} Status Report**\n\n`;
        response += `**What you're growing:** ${area.crop}\n`;
        response += `**Overall health score:** ${area.aiScore}%\n`;
        response += `**Current status:** ${area.status}\n\n`;
        
        response += `**Sensor Readings (What these mean):**\n`;
        
        if (area.currentSensorData.temperature !== undefined && cropProfile) {
          response += `• Temperature: ${area.currentSensorData.temperature}°C (ideal: ${cropProfile.optimalTemp.min}-${cropProfile.optimalTemp.max}°C)\n`;
          if (area.currentSensorData.temperature < cropProfile.optimalTemp.min) {
            response += `  → It's too COLD. Your ${area.crop} is like a person in a cold room - growth slows down. Consider increasing heat.\n`;
          } else if (area.currentSensorData.temperature > cropProfile.optimalTemp.max) {
            response += `  → It's too HOT. Like a person in a sauna - the plant gets stressed. Try cooling it down.\n`;
          } else {
            response += `  → ✅ PERFECT! Your plant is comfortable.\n`;
          }
        }
        
        if (area.currentSensorData.humidity !== undefined && cropProfile) {
          response += `• Humidity: ${area.currentSensorData.humidity}% (ideal: ${cropProfile.optimalHumidity.min}-${cropProfile.optimalHumidity.max}%)\n`;
          if (area.currentSensorData.humidity < cropProfile.optimalHumidity.min) {
            response += `  → Too DRY. Like dry skin on a person - leaves can wilt. Add moisture.\n`;
          } else if (area.currentSensorData.humidity > cropProfile.optimalHumidity.max) {
            response += `  → Too WET/HUMID. Like being in a steam room all day - can cause mold. Improve airflow.\n`;
          } else {
            response += `  → ✅ PERFECT! The air is just right.\n`;
          }
        }
        
        if (area.currentSensorData.ph !== undefined && cropProfile) {
          response += `• pH Level: ${area.currentSensorData.ph} (ideal: ${cropProfile.optimalPH.min}-${cropProfile.optimalPH.max})\n`;
          if (area.currentSensorData.ph < cropProfile.optimalPH.min) {
            response += `  → Too ACIDIC. Like a soda - nutrients can become locked up and roots struggle. Raise pH gently.\n`;
          } else if (area.currentSensorData.ph > cropProfile.optimalPH.max) {
            response += `  → Too BASIC/ALKALINE. Nutrients get stuck and plants can't absorb them. Lower pH gently.\n`;
          } else {
            response += `  → ✅ PERFECT! Nutrients are available to your plant.\n`;
          }
        }
        
        return response;
      }
    }
    return `Please tell me which area (A, B, C, D, E, or F) you want to know about. I'll give you a detailed breakdown!`;
  }

  // HEALTH SCORE QUESTIONS - Explain what it means
  if (lowerMessage.includes('health') || lowerMessage.includes('score')) {
    const lowAreas = farmContext.areas.filter(a => a.aiScore < 60);
    const goodAreas = farmContext.areas.filter(a => a.aiScore >= 80);
    
    let response = `📊 **Your Farm's Health Scores Explained**\n\n`;
    response += `**Overall Farm Health: ${farmContext.averageHealth}%**\n`;
    
    if (farmContext.averageHealth >= 80) {
      response += `That's EXCELLENT! Think of it like most of your plants are thriving. Keep doing what you're doing!\n\n`;
    } else if (farmContext.averageHealth >= 60) {
      response += `That's good - most things are working. But there's room to improve. Let's fix the problem areas.\n\n`;
    } else {
      response += `That needs attention. It's like your farm needs a check-up. We should identify what's wrong.\n\n`;
    }
    
    if (goodAreas.length > 0) {
      response += `✅ **Doing Well:** ${goodAreas.map(a => `Area ${a.id} (${a.crop})`).join(', ')}\n`;
    }
    
    if (lowAreas.length > 0) {
      response += `⚠️ **Needs Attention:** ${lowAreas.map(a => `Area ${a.id} (${a.crop})`).join(', ')}\n`;
      response += `Ask me about these areas specifically, and I'll tell you exactly what to fix!\n`;
    }
    
    return response;
  }

  // RECOMMENDATION REASONING - Explain why
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('why')) {
    let response = `💡 **How I Make Recommendations**\n\n`;
    response += `I look at three main things:\n\n`;
    response += `1️⃣ **Your Sensor Data** - Temperature, humidity, pH, water\n`;
    response += `   → I check if each reading matches what your crop needs\n\n`;
    response += `2️⃣ **Crop Requirements** - What each plant actually wants\n`;
    response += `   → Like knowing a tomato wants warmer temps than lettuce\n\n`;
    response += `3️⃣ **Your Farm History** - Patterns from what's worked before\n`;
    response += `   → Like learning your farm grows better at 25°C\n\n`;
    response += `**When I recommend something, I explain:**\n`;
    response += `• What sensor reading triggered it\n`;
    response += `• Why that's important for your crop\n`;
    response += `• Exactly what action to take\n`;
    response += `• What result you should expect\n\n`;
    response += `Ask me about a specific area or sensor, and I'll walk through my reasoning!`;
    return response;
  }

  // OPTIMIZE/IMPROVE - Step-by-step guide
  if (lowerMessage.includes('optim') || lowerMessage.includes('improve')) {
    let response = `📈 **How to Improve Your Farm**\n\n`;
    response += `Here's a simple step-by-step process:\n\n`;
    response += `**Step 1: Find Problem Areas**\n`;
    response += `Look at each area's health score. Anything below 70 needs attention.\n\n`;
    response += `**Step 2: Check Sensor Readings**\n`;
    response += `For each problem area, look at temperature, humidity, and pH.\n`;
    response += `Are they in the ideal range for that crop?\n\n`;
    response += `**Step 3: Make ONE Change at a Time**\n`;
    response += `Don't change everything at once! Pick the biggest problem.\n`;
    response += `Example: If temperature is 5°C too high, focus on cooling first.\n\n`;
    response += `**Step 4: Wait and Observe**\n`;
    response += `Give it a few hours/days to see if it helps.\n`;
    response += `Watch if the health score goes up.\n\n`;
    response += `**Step 5: Next Problem**\n`;
    response += `Once that's better, tackle the next issue.\n\n`;
    response += `Which area should we focus on first?`;
    return response;
  }

  // HARVEST/YIELD PREDICTION
  if (lowerMessage.includes('harvest') || lowerMessage.includes('yield') || lowerMessage.includes('ready')) {
    let response = `🌾 **About Your Harvest**\n\n`;
    response += `To predict when you'll harvest, I look at:\n\n`;
    response += `• **What crop you're growing** (some grow faster than others)\n`;
    response += `• **Current growing conditions** (good conditions = faster growth)\n`;
    response += `• **How long it's been growing** (based on your records)\n\n`;
    response += `Check the **ML Insights page** - it shows:\n`;
    response += `• Predicted harvest date\n`;
    response += `• Expected yield amount\n`;
    response += `• Whether conditions are optimal for growth\n\n`;
    response += `The healthier your conditions, the sooner and more abundant your harvest!`;
    return response;
  }

  // DEFAULT - General help
  return `👋 **Hi! I'm here to help you understand your farm.**\n\n` +
    `I can explain:\n` +
    `• **How each area is doing** - Just ask "How is Area A?"\n` +
    `• **Why your health scores matter** - Ask "What do health scores mean?"\n` +
    `• **Why I recommend something** - Ask "Why do you suggest that?"\n` +
    `• **How to improve** - Ask "How can I improve?"\n` +
    `• **When you'll harvest** - Ask "When will Area A be ready?"\n\n` +
    `What would you like to know? Ask in a simple way, and I'll explain it clearly!`;
};

/**
 * Main chat function
 * Uses Claude (best reasoning) → OpenAI → Fallback rule-based
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
    if (USE_CLAUDE) {
      // Claude has the best reasoning and explanation capabilities
      const systemPrompt = buildSystemPrompt(farmContext);
      const response = await callClaude(messages, systemPrompt);
      return response;
    } else if (USE_OPENAI) {
      // Fallback to OpenAI if Claude not available
      const systemPrompt = buildSystemPrompt(farmContext);
      const response = await callOpenAI(messages, systemPrompt);
      return response;
    } else {
      // Use detailed rule-based system
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
 * Provides reasoning-based suggestions
 */
export const getQuickAISuggestions = (farmContext) => {
  const suggestions = [];

  // Check low-health areas - suggest specific investigation
  const lowHealthAreas = farmContext.areas.filter((t) => t.aiScore < 60);
  if (lowHealthAreas.length > 0) {
    suggestions.push({
      severity: 'warning',
      message: `${lowHealthAreas.length} area(s) struggling (scores < 60%): ${lowHealthAreas.map(a => a.id).join(', ')}. Ask: "Why is Area ${lowHealthAreas[0].id} performing poorly?"`,
    });
  }

  // Average health check - provide actionable insight
  if (farmContext.averageHealth < 70) {
    suggestions.push({
      severity: 'info',
      message: `Farm health at ${farmContext.averageHealth}% - not ideal yet. Ask: "How can I improve my farm?" for step-by-step guidance.`,
    });
  } else if (farmContext.averageHealth < 80) {
    suggestions.push({
      severity: 'info',
      message: `Farm health at ${farmContext.averageHealth}% - getting better! Ask: "What should I focus on next?" to optimize further.`,
    });
  }

  // High-performing farm - celebrate and plan next steps
  if (farmContext.averageHealth >= 85) {
    suggestions.push({
      severity: 'success',
      message: `🎉 Excellent performance (${farmContext.averageHealth}%)! Ask: "When will my crops be ready for harvest?" for next steps.`,
    });
  }

  // Check for unassigned areas
  const unassignedAreas = farmContext.areas.filter((t) => t.crop === 'Unassigned');
  if (unassignedAreas.length > 0) {
    suggestions.push({
      severity: 'info',
      message: `Area(s) ${unassignedAreas.map(a => a.id).join(', ')} need crops assigned. Ask: "Which crop should I grow in Area ${unassignedAreas[0].id}?"`,
    });
  }

  return suggestions;
};
