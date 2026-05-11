# Claude AI Setup for Farmsense

## Overview
The improved AI Chat now supports **Claude 3.5 Sonnet**, which has the best reasoning and explanation capabilities. It automatically falls back to OpenAI GPT-4o, then to rule-based responses if needed.

## Why Claude?
- **Best at reasoning**: Explains why recommendations are made
- **Clearer explanations**: Breaks down complex farming concepts into simple language
- **Better for elderly users**: Uses analogies and step-by-step guidance
- **References your data**: Connects recommendations to your actual sensor readings

## Setup Steps

### 1. Get a Claude API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up for a free account
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy the key (it starts with `sk-ant-`)

### 2. Add to Your Environment
Create a `.env.local` file in your project root:

```
# For Claude (Best AI - Recommended)
VITE_CLAUDE_API_KEY=sk-ant-your-key-here

# Optional: For OpenAI fallback
VITE_OPENAI_API_KEY=sk-your-key-here
```

### 3. Restart Your Dev Server
```bash
npm run dev
```

The app will now use Claude when you ask questions in the AI Chat!

## How It Works

### Priority Order:
1. **Claude** (if VITE_CLAUDE_API_KEY is set) ← Best reasoning
2. **OpenAI** (if VITE_OPENAI_API_KEY is set) ← Good alternative
3. **Fallback** (rule-based) ← No API needed, but less detailed

### What Claude Does:
- Reads your farm context (areas, crops, sensor data)
- Explains sensor readings in simple terms
- Compares your readings to what crops need
- Provides step-by-step reasoning
- Gives actionable recommendations

## Example Questions to Ask

✅ **"How is Area A?"** 
→ Gets detailed status with explanations of each sensor reading

✅ **"Why do you recommend lowering the temperature?"**
→ Shows the reasoning: current temp vs. crop needs, why it matters

✅ **"How can I improve?"**
→ Step-by-step guide to improve your farm

✅ **"When will my tomato be ready?"**
→ Harvest prediction with explanation

## Testing It Works

1. Go to **AI Chat** page
2. Ask: "How is Area A doing?"
3. You should see:
   - Detailed sensor reading breakdown
   - Explanations in simple language
   - Comparisons to ideal ranges

If you see these ↓ instead, an API key might be missing:
- Generic responses
- Less detail
- No sensor comparisons

## Troubleshooting

### Q: It's still giving generic responses
**A:** Check that:
- Your `.env.local` file is in the project root
- The API key is correct (starts with `sk-ant-`)
- You restarted `npm run dev` after adding the key

### Q: Getting API errors
**A:** Check:
- API key is valid at [console.anthropic.com](https://console.anthropic.com)
- You have credits available
- Network connection is working

### Q: Want to use OpenAI instead?
**A:** Just add `VITE_OPENAI_API_KEY` and Claude won't be used (unless you prefer to remove it).

## Cost
- **Claude**: ~$0.003 per question (very cheap)
- **OpenAI**: ~$0.001-0.01 per question
- **Fallback**: Free (but less detailed)

## Next Steps
1. Set up Claude API key
2. Go to AI Chat and ask questions
3. Notice how it explains the reasoning behind everything
4. Use it to understand your farm better

---

**Need help?** The AI Chat now includes examples of all the types of questions you can ask!
