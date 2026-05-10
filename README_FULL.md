# 🌿 Farmsense - AI-Driven Autonomous Farming Platform

**Precision Autonomous Farming** powered by machine learning and real-time sensor data.

Farmsense is a comprehensive web application that replicates perfect growing conditions using AI-driven climate control and automated systems. Monitor, analyze, and optimize your indoor farming operations with real-time dashboards and intelligent alerting.

## ✨ Key Features

🎯 **Real-time Monitoring**
- Live sensor data streaming (temperature, humidity, pH, water usage)
- Instant visualization of crop health and environmental conditions
- Multi-tray management with individual parameter tracking

🤖 **AI Scoring Engine** 
- Compares current sensor readings against optimal crop profiles
- Generates 0-100 health scores for each tray
- "Perfect Match" (≥95) triggers automated control systems

🌱 **Smart Tray Management**
- Assign crops to individual trays
- Access pre-configured optimal parameters for 4+ crop types
- Real-time status monitoring and anomaly detection

⚠️ **Intelligent Alerts**
- Critical alerts for environmental anomalies
- Smart notifications (temperature, humidity, pH deviations)
- Auto-dismiss non-critical alerts after 30 seconds

📊 **Advanced Analytics**
- 24-hour trend visualization with Recharts
- Historical sensor data with configurable time ranges
- Resource consumption analysis and reporting

🎛️ **Automated Control**
- Remote triggers for LED, AC, and irrigation systems
- System-wide control center for multi-tray coordination
- Action logging and status tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- (Optional) Firebase project for backend

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Farmsense

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Try the Demo

The app runs with **embedded sensor simulators** by default - no Firebase setup needed!

1. Navigate to the Dashboard
2. View real-time sensor data for 6 trays
3. Check alerts as they generate
4. Trigger test anomalies to see alerts in action
5. Explore analytics with historical trends

## 📋 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Sidebar.jsx     # Side menu with routing
│   ├── Layout.jsx      # Main layout wrapper
│   ├── TrayCard.jsx    # Tray display with AI score
│   ├── AlertBox.jsx    # Alert/notification display
│   ├── SensorChart.jsx # Real-time trend charts
│   └── SensorReading.jsx # Individual sensor displays
├── pages/              # Full page components
│   ├── Dashboard.jsx   # Main overview
│   ├── TrayManagement.jsx # Crop assignment & controls
│   ├── Analytics.jsx   # Historical data & trends
│   └── Settings.jsx    # User & system configuration
├── services/
│   ├── firebaseService.js # Firebase operations
│   └── sensorSimulator.js # Local sensor simulation
├── hooks/
│   ├── useFirebase.js  # Firebase data hooks
│   └── useTray.js      # Tray management hooks
├── context/
│   └── AppContext.jsx  # Global state management
├── config/
│   └── firebase.js     # Firebase initialization
├── utils/
│   ├── constants.js    # Crop profiles & thresholds
│   └── helpers.js      # AI scoring & formatting
├── App.jsx             # Main app with routing
└── main.jsx            # Entry point
```

## 🎯 Core Pages

### 1. Dashboard (`/`)
- Overview of all 6 trays with AI scores
- Recent alerts with auto-dismiss
- Live sensor readings for selected tray
- Test controls to simulate anomalies

### 2. Tray Management (`/trays`)
- Assign crops to individual trays
- View live sensor data for each tray
- Access crop profiles with optimal parameters
- System-wide control center for all actuators

### 3. Analytics (`/analytics`)
- 24-hour sensor trends (temperature, humidity, pH, water)
- Configurable time range (1h to 7 days)
- Current sensor readings vs optimal parameters
- Crop-specific optimal condition reference

### 4. Settings (`/settings`)
- Account management
- Notification preferences
- System configuration
- Danger zone options

## 🧠 AI Scoring System

The AI Score (0-100) compares current sensor readings against optimal crop profiles:

```
Score Ranges:
- 95-100: Perfect Match ✨ (triggers automation)
- 80-94:  Excellent 🟢
- 60-79:  Good 🟡
- 40-59:  Fair 🟠
- 0-39:   Poor 🔴
```

### Scoring Algorithm
Each parameter (temperature, humidity, pH) is independently scored:
- **100**: Within optimal range
- **80**: Within ±5% tolerance
- **<80**: Penalty based on deviation distance

Final score = Average of all parameter scores

## 🌾 Crop Profiles

Pre-configured optimal parameters for:

| Crop | Temp | Humidity | pH | Water | Light |
|------|------|----------|-----|-------|-------|
| 🍓 Strawberry | 15-25°C | 60-80% | 5.8-6.8 | 100-200ml/day | 12-14h/day |
| 🥬 Lettuce | 15-22°C | 70-85% | 6.0-7.0 | 150-250ml/day | 12-16h/day |
| 🍅 Tomato | 20-28°C | 60-75% | 6.0-6.8 | 200-300ml/day | 14-16h/day |
| 🌿 Basil | 18-25°C | 50-70% | 6.0-7.0 | 80-150ml/day | 12-14h/day |

## 🔌 Sensor Data Flow

### Using the Simulator (Default)
```
Simulator → Context → Components → UI
```
Perfect for local development and testing!

### With Firebase (Production)
```
IoT Devices → Firebase RTDB → Context → Components → UI
                    ↑
              Firestore (Metadata)
```

### Controls Flow
```
User Action → Context → Firebase/Simulator → Device
                              ↑
                            Logging
```

## 🛠️ Development

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Testing Alerts

From the Dashboard, click "Simulate Temp Anomaly" on any tray to:
1. Generate temperature anomaly
2. Trigger alert notification
3. See real-time response

## 🔐 Firebase Setup (Optional)

For production deployment with real devices:

1. Create Firebase project: [https://console.firebase.google.com](https://console.firebase.google.com)
2. Follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions
3. Add credentials to `.env.local`
4. Set `useSimulator = false` in `AppContext.jsx`

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for complete Firebase configuration guide.

## 📦 Dependencies

**Frontend Framework**
- React 19.2.5
- React Router DOM 6.20
- React DOM 19.2.5

**Styling**
- Tailwind CSS 3.4
- PostCSS 8.4
- Autoprefixer 10.4

**Data & Charts**
- Recharts 2.10 (real-time charting)
- Axios 1.6 (HTTP client)

**Backend (Optional)**
- Firebase 10.7 (real-time database & Firestore)

**Date Utilities**
- date-fns 3.0

## 🧪 Using the Sensor Simulator

The `SensorSimulator` creates realistic mock data for development:

```javascript
import { SensorSimulatorRegistry } from './services/sensorSimulator';

// Start simulator for Tray A with Strawberry
const simulator = SensorSimulatorRegistry.create('A', 'strawberry');
simulator.start();

// Simulate temperature spike
simulator.simulateAnomaly('temperature', 'high');

// Reset to normal
simulator.resetAnomaly();

// Stop simulator
simulator.stop();
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm run build
# Push to GitHub, connect to Vercel
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### Deploy to Netlify
```bash
npm run build
# Drag & drop the 'dist' folder to Netlify
```

## 📚 Architecture Overview

```
┌─────────────────────────────────────┐
│         React Components            │
├─────────────────────────────────────┤
│      AppContext (Global State)      │
├─────────────────────────────────────┤
│   Firebase Service / Simulator      │
├─────────────────────────────────────┤
│   Firebase Backend / IoT Devices    │
└─────────────────────────────────────┘
```

## 🔄 Data Flow

1. **Sensor Input**: Devices → Firebase RTDB (or Simulator)
2. **Context Update**: Firebase → AppContext
3. **UI Render**: Context → Components
4. **AI Scoring**: Helper functions analyze data
5. **Alert Generation**: Scoring triggers notifications
6. **Control Output**: User action → Firebase → Device

## 🐛 Troubleshooting

### Issue: No sensor data showing
**Solution**: Check that simulator is enabled (default). Verify crop is assigned to tray.

### Issue: Alerts not appearing
**Solution**: 
- Ensure sensor data is within anomaly threshold
- Check browser console for errors
- Alerts auto-dismiss after 30 seconds (except critical)

### Issue: Charts not rendering
**Solution**: Verify Recharts is installed (`npm list recharts`)

### Issue: Firebase connection issues
**Solution**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for configuration help

## 🎓 Learning Resources

- **React**: [react.dev](https://react.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Firebase**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Recharts**: [recharts.org](https://recharts.org)
- **Vite**: [vitejs.dev](https://vitejs.dev)

## 📄 Documentation Files

- **[STRUCTURE.md](./STRUCTURE.md)** - Detailed project structure
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Firebase configuration guide
- **[README_FULL.md](./README_FULL.md)** - Complete documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 🎉 What's Next?

- ✅ Real-time sensor monitoring
- ✅ AI scoring engine
- ✅ Alert system
- ⏳ User authentication (Firebase Auth)
- ⏳ Advanced ML predictions
- ⏳ Mobile app (React Native)
- ⏳ Multi-facility management
- ⏳ Crop yield optimization
- ⏳ Integration with IoT platforms

## 📞 Support

For issues, questions, or suggestions:
1. Check the documentation
2. Review [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for Firebase issues
3. Open an issue on GitHub

---

Made with 🌿 for farmers and growers everywhere
