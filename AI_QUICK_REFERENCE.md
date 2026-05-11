# Quick Reference - AI Chat Questions

## 🌱 Ask About Specific Areas
```
"How is Area A?"
"What's wrong with Area B?"
"Why is Area C struggling?"
```
→ Get detailed sensor readings with explanations

## 📊 Ask About Farm Health
```
"What do health scores mean?"
"Why is my farm at 65%?"
"How do I get to 80%?"
```
→ Understand what's good and what needs work

## 🎯 Ask for Reasoning
```
"Why do you recommend this?"
"Why is the temperature too high?"
"How will lowering humidity help?"
```
→ Get explanations of the "why" behind recommendations

## 🔧 Ask for Solutions
```
"How can I improve my farm?"
"What should I do about high humidity?"
"How do I fix the pH?"
```
→ Get step-by-step actions to take

## 🌾 Ask About Harvesting
```
"When will Area A be ready?"
"How much will I yield?"
"What do I do after harvest?"
```
→ Get predictions and next steps

## ❌ DON'T Ask Like This
```
❌ "Provide comprehensive analysis"
❌ "Optimize all parameters"
❌ "What's wrong" (be specific - mention area/crop)
```

## ✅ DO Ask Like This
```
✅ "How is Area A?"
✅ "Why is humidity low in Area B?"
✅ "How can I improve the tomato area?"
```

---

## Understanding AI Explanations

### 🌡️ Temperature
- Too cold = "Like a cold room - growth slows"
- Too hot = "Like a sauna - plant stressed"
- Perfect = "✅ PERFECT! Comfortable"

### 💧 Humidity
- Too dry = "Like dry skin - leaves wilt"
- Too wet = "Like steam room - mold risk"
- Perfect = "✅ PERFECT! Just right"

### pH (Acidity)
- Too acidic = "Like soda - nutrients lock up"
- Too basic = "Nutrients stuck, can't absorb"
- Perfect = "✅ PERFECT! Nutrients available"

---

## Quick Tips

1. **Ask simply** - Use plain language
2. **Be specific** - Mention areas and crops
3. **Ask "Why?"** - AI loves explaining
4. **One thing at a time** - Don't ask 5 things
5. **Ask for examples** - "Show me what to do"

---

## Setup (First Time Only)

1. Get API key: [console.anthropic.com](https://console.anthropic.com)
2. Add to `.env.local`:
   ```
   VITE_CLAUDE_API_KEY=sk-ant-your-key
   ```
3. Restart: `npm run dev`
4. Go to AI Chat and start asking!

**Skip setup?** You still get explanations, just less detailed.

---

**Print this out and keep it by your computer!**
