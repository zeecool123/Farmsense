# Farmsense Frontend

🌿 **Farmsense** is an AI-driven autonomous farming system that replicates perfect growing conditions using real-time sensor data and automated climate control.

## 📋 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Top navigation bar
│   ├── Sidebar.jsx     # Side navigation menu
│   ├── Layout.jsx      # Main layout wrapper
│   ├── TrayCard.jsx    # Individual tray display card
│   ├── AlertBox.jsx    # Alert/notification display
│   ├── SensorChart.jsx # Real-time sensor charts
│   └── SensorReading.jsx # Sensor value display
├── pages/              # Full page components
│   ├── Dashboard.jsx   # Main dashboard with tray overview
│   ├── TrayManagement.jsx # Assign crops and manage trays
│   ├── Analytics.jsx   # Historical data and trends
│   └── Settings.jsx    # User and system settings
├── services/           # External service integrations
│   └── firebaseService.js # Firebase Firestore & RTDB operations
├── hooks/              # Custom React hooks
│   └── useTray.js      # Tray data management hook
├── context/            # React Context for global state
│   └── AppContext.jsx  # Global app state management
├── config/             # Configuration files
│   └── firebase.js     # Firebase initialization
├── utils/              # Utility functions
│   ├── constants.js    # App constants (crop profiles, thresholds)
│   └── helpers.js      # Helper functions (AI scoring, formatting)
├── assets/             # Static assets
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles (Tailwind CSS)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Farmsense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase credentials in `.env.local`

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

## 📁 File Descriptions

### Components

- **Layout.jsx** - Wraps pages with Navbar and Sidebar
- **TrayCard.jsx** - Displays tray status with AI score progress bar
- **AlertBox.jsx** - Shows alerts with severity levels (critical, warning, info)
- **SensorChart.jsx** - Renders real-time sensor trends using Recharts
- **SensorReading.jsx** - Individual sensor value display

### Pages

- **Dashboard** - Real-time overview of all trays, recent alerts, and quick stats
- **TrayManagement** - Assign crops to trays, view crop profiles and optimal parameters
- **Analytics** - Historical sensor data, trend charts, and analytics
- **Settings** - Account, notifications, and system configuration

### Core Utilities

**constants.js** includes:
- `CROP_PROFILES` - Optimal parameters for different crops
- `AI_SCORE_THRESHOLDS` - Scoring system (Perfect ≥95, Excellent ≥80, etc.)
- `TRAY_IDS`, `SENSOR_TYPES`, `CONTROLS`, `ALERT_SEVERITY`

**helpers.js** includes:
- `calculateAIScore()` - Compares sensor data against optimal crop profile
- `getHealthStatus()` - Converts score to status text
- `getScoreColor()` - Color coding for visual feedback
- `formatSensorReading()` - Format sensor values with units

### Context

**AppContext.jsx** manages:
- Tray data (assignments, status)
- Real-time sensor data
- Alerts and notifications
- User authentication state
- Loading states

### Services

**firebaseService.js** provides:
- Firestore operations for tray management
- Real-time Database (RTDB) for sensor streaming
- Control operations for LED, AC, Irrigation systems

## 🎨 Styling

The project uses **Tailwind CSS** for styling. Configuration:
- `tailwind.config.js` - Tailwind theme and plugin configuration
- `postcss.config.js` - PostCSS setup for Tailwind processing
- Custom green color palette defined as `farm-*` utility classes

## 🔌 Key Features

### 1. Real-Time Monitoring
- Live sensor data from IoT devices
- Instant visualization of temperature, humidity, pH, water usage
- Status indicators (Online/Offline)

### 2. AI Scoring System
- Compares current sensor readings against optimal crop profiles
- Generates 0-100 health score for each tray
- "Perfect Match" (>95) triggers automated controls

### 3. Tray Management
- Assign any crop to any tray
- View optimal parameters for each crop type
- Real-time status monitoring

### 4. Automated Alerts
- Critical alerts for anomalies
- Smart notifications (AC inefficiency, water depletion, etc.)
- Alert history and dismissal

### 5. Analytics & Trends
- 24-hour sensor data visualization
- Historical trend analysis
- Resource consumption tracking

## 🔐 Environment Variables

Create a `.env.local` file:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

## 📦 Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **firebase** - Backend services
- **recharts** - Data visualization
- **axios** - HTTP client
- **date-fns** - Date utilities
- **tailwindcss** - Styling

## 🛠️ Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🚀 Next Steps

1. **Connect Firebase** - Add Firebase credentials and test real-time data
2. **Implement Authentication** - Add login/logout functionality
3. **Backend API** - Connect to your backend for sensor data
4. **Mobile Optimization** - Ensure responsive design works on all devices
5. **Push Notifications** - Implement Firebase Cloud Messaging
6. **Advanced Analytics** - Add more chart types and predictions

## 📝 Notes

- Mock data is generated for demonstration purposes
- Replace all mock data with real Firebase queries
- The AI scoring system can be enhanced with ML models
- Sensor data simulation is ready for IoT device integration

## 📄 License

MIT License - See LICENSE file for details
