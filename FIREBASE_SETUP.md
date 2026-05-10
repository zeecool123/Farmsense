# Firebase Integration Guide for Farmsense

## 🔧 Setup Firebase Project

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter "Farmsense" as project name
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Create Web App
1. In Firebase Console, click the web icon (</>) to create a new web app
2. Register app as "Farmsense Web"
3. Copy the configuration
4. Click "Continue to console"

### Step 3: Setup Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in **Production mode**
4. Select your preferred region
5. Click "Enable"

### Step 4: Setup Realtime Database
1. In Firebase Console, go to "Realtime Database"
2. Click "Create database"
3. Select the same region as Firestore
4. Start in **test mode** (for development)
5. Click "Enable"

### Step 5: Configure Security Rules

**For Firestore** - Go to Firestore > Rules and use:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // For development - allow all reads and writes
    match /{document=**} {
      allow read, write;
    }
    
    // For production - implement proper auth
    // match /trays/{trayId} {
    //   allow read, write: if request.auth.uid != null;
    // }
  }
}
```

**For Realtime Database** - Go to Realtime Database > Rules and use:
```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## 📝 Environment Variables

Create a `.env.local` file in your project root:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

## 🚀 How to Get Your Credentials

1. In Firebase Console, click the gear icon ⚙️ > Project Settings
2. Go to "General" tab
3. Scroll to "Your apps" section
4. Click on your web app
5. Click the copy icon next to the config
6. Paste into your `.env.local` file

## 📊 Database Structure

### Firestore Collection: `trays`
```
trays/
  {trayId}
    ├── crop: string (strawberry, lettuce, tomato, basil)
    ├── cropKey: string
    ├── status: string (online, offline)
    ├── userId: string
    ├── createdAt: timestamp
    └── updatedAt: timestamp
```

### Realtime Database Structure: `/trays`
```
trays/
  {trayId}/
    ├── sensors/
    │   ├── temperature: number
    │   ├── humidity: number
    │   ├── ph: number
    │   ├── waterUsage: number
    │   ├── lightIntensity: number
    │   └── timestamp: string
    ├── aiScore/
    │   ├── value: number (0-100)
    │   └── timestamp: string
    ├── controls/
    │   ├── led/
    │   │   ├── action: string (on, off)
    │   │   ├── status: string
    │   │   └── timestamp: string
    │   ├── ac/
    │   │   ├── action: string
    │   │   ├── status: string
    │   │   └── timestamp: string
    │   └── irrigation/
    │       ├── action: string
    │       ├── status: string
    │       └── timestamp: string
    └── history/ (last 100 sensor readings)
        ├── {entryId}/
        │   ├── temperature: number
        │   ├── humidity: number
        │   ├── ph: number
        │   ├── waterUsage: number
        │   └── timestamp: string
```

## 🔌 Using the Services

### Subscribe to Real-time Sensor Data
```javascript
import { subscribeSensorData } from './services/firebaseService';

const unsubscribe = subscribeSensorData('A', (data) => {
  console.log('Sensor data:', data);
});

// Clean up subscription
unsubscribe();
```

### Publish Sensor Data
```javascript
import { publishSensorData } from './services/firebaseService';

await publishSensorData('A', {
  temperature: 22.5,
  humidity: 75,
  ph: 6.5,
  waterUsage: 150,
  lightIntensity: 5000,
});
```

### Trigger Control
```javascript
import { triggerControl } from './services/firebaseService';

await triggerControl('A', 'led', 'on');
await triggerControl('A', 'ac', 'on', 3600); // 1 hour duration
await triggerControl('A', 'irrigation', 'on', 300); // 5 minutes
```

### Subscribe to Alerts
```javascript
import { subscribeAlerts } from './services/firebaseService';

const unsubscribe = subscribeAlerts(userId, (alerts) => {
  console.log('Alerts:', alerts);
});
```

## 🧪 Testing with Sensor Simulator

The app comes with a built-in `SensorSimulator` for local development without real Firebase:

```javascript
import { SensorSimulatorRegistry } from './services/sensorSimulator';

// Create and start simulator
const simulator = SensorSimulatorRegistry.create('A', 'strawberry', 5000);
simulator.start();

// Subscribe to updates
simulator.subscribe((data) => {
  console.log('Simulated sensor data:', data);
});

// Simulate anomaly for testing
simulator.simulateAnomaly('temperature', 'high');

// Reset to normal
simulator.resetAnomaly();

// Stop simulator
simulator.stop();
```

## 🔄 Enable/Disable Simulator vs Firebase

The app automatically uses the simulator by default. To switch to Firebase:

In `AppContext.jsx`, change:
```javascript
const [useSimulator, setUseSimulator] = useState(false); // Switch to Firebase
```

Or in your component:
```javascript
const { useSimulator, setUseSimulator } = useApp();

// Toggle Firebase
setUseSimulator(false);
```

## 🛡️ Security Best Practices

1. **Never commit `.env.local` to Git** - Add to `.gitignore`
2. **Use Environment Variables** - Don't hardcode credentials
3. **Implement Authentication** - Use Firebase Auth for user management
4. **Set up proper Firestore rules** - Restrict access by user/role
5. **Validate data** - Check input on backend
6. **Monitor Firebase usage** - Watch for unusual activity

## 📚 Useful Firebase Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy to Firebase Hosting
firebase deploy

# View logs
firebase functions:log
```

## 🐛 Common Issues

### Issue: "Permission denied" errors
**Solution**: Check your Firestore/RTDB security rules are set to test mode

### Issue: "Cannot find Firebase config"
**Solution**: Ensure `.env.local` file exists and has all required variables

### Issue: Real-time updates not working
**Solution**: 
- Check database rules allow reads
- Verify network connection
- Check browser console for errors

### Issue: Sensor data not appearing
**Solution**:
- Use simulator (`useSimulator = true`) for local testing
- For Firebase, ensure device is publishing to correct path
- Check RTDB rules allow writes

## 📖 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Realtime Database Guide](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
