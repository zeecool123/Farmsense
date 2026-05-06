🌿 Farmsense: Precision Autonomous Farming
An AI-driven ecosystem that replicates "perfect" growing conditions using real-time sensor data and automated climate control.

💡 The Problem
Farmers and indoor growers struggle to maintain the "perfect" environment for sensitive crops. Fluctuations in pH, temperature, or humidity can lead to wasted electricity (AC over-usage), water waste, and lower crop yields. Traditional monitoring requires constant manual adjustment.

🚀 The Solution: The "Replicate" Engine
SmartCrop AI doesn't just monitor; it learns and mimics.

Sensor Fusion: Tracks Temperature, pH, Humidity, and Water Usage via IoT sensors.

AI Scoring: Our Machine Learning model compares current tray data against optimal plant profiles in Firebase.

The 95% Rule: If a tray hits a "Perfect Match" score (>95/100), the AI automatically captures those parameters as a "Replicate" and triggers the AC, Watering, and LED systems to maintain that exact state.

✨ Key Features
Tray-Specific Management: Assign specific crops (e.g., Strawberry, Lettuce) to individual trays (Tray A, Tray B) via the app.

Autonomous Automation: Real-time control of LED lights, AC, and irrigation based on AI scoring.

Daily Trend Analytics: Interactive charts showing crop health trends and environmental stability.

Smart Alerts & Sustainability: Push notifications alert users if sensors detect anomalies (e.g., "AC inefficiency detected") to prevent crop damage and energy waste.

⚙️ How It Works (The Logic Flow)
Input: User assigns "Strawberry" to Tray A.

Sensing: Sensors send data (24°C, 6.5 pH) to the Firebase backend.

Analysis: The AI compares this to the "Optimal Strawberry Profile."

Action: If the score is high, the system locks in the parameters. If the temp is too high, the AI sends a command to the AC and notifies the user via the app.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Getting Started
Install dependencies
cd HiveDeliver

npm install
Start the development server
npm run dev -- --host

Build for production
npm run build

Preview production build
npm run preview

Run linting
npm run lint
