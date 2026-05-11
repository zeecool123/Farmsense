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

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/farmsense.git
cd farmsense
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (Optional - see Firebase Setup below)

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Firebase Setup (Optional)

The app works with localStorage authentication by default. To use Firebase Authentication:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider

3. Get your Firebase config:
   - Go to Project Settings > General > Your apps
   - Click the web app icon (</>) to see your config

4. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

5. Update `.env` with your Firebase config values:
```
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

6. Restart the development server

**Note**: Without Firebase setup, the app will use localStorage for authentication, which works for development and testing.

Deploying the web app

git clone https://github.com/zeecool123/Farmsense.git

cd Farmsense

npm install

Start the development server

npm run dev -- --host

Build for production

npm run build

Preview production build

npm run preview

Run linting

npm run lint
