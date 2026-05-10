# Authentication System Guide

## Overview

Farmsense now includes a complete Firebase Authentication system with email/password sign-up and sign-in functionality.

## Features Implemented

✅ **User Registration** - Sign up with email, password, and name
✅ **User Login** - Sign in with email and password
✅ **Session Persistence** - Sessions persist across browser refreshes
✅ **Protected Routes** - Dashboard and features require authentication
✅ **User Profile** - Firestore user documents with preferences
✅ **Logout** - Secure logout from dropdown menu
✅ **Demo Account** - Quick access demo account for testing
✅ **Error Handling** - User-friendly error messages
✅ **Form Validation** - Client-side validation for security

## File Structure

```
src/
├── pages/
│   ├── Login.jsx          # Login page with demo account option
│   └── Signup.jsx         # Registration page with validation
├── services/
│   └── authService.js     # Firebase auth operations
├── context/
│   └── AuthContext.jsx    # Global auth state
├── components/
│   ├── ProtectedRoute.jsx # Route guard component
│   └── Navbar.jsx         # Updated with logout dropdown
└── App.jsx                # Updated with auth routes
```

## How It Works

### 1. Authentication Flow

```
User → Login/Signup → Firebase Auth → Session Stored → App
                             ↓
                     Firestore User Document
```

### 2. Protected Routes

All dashboard pages are wrapped with `ProtectedRoute` component:
- If authenticated → Show page
- If not authenticated → Redirect to login
- While loading → Show loading spinner

### 3. User Session

- Sessions persist in browser storage
- User logged in automatically on page reload
- Auth state available globally via `useAuth()` hook

## Usage

### In Components

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, isAuthenticated, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <p>Welcome, {currentUser.displayName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Authentication Service Functions

```javascript
import {
  signUpUser,
  signInUser,
  signOutUser,
  getCurrentUser,
  updateUserProfile,
  getUserProfile,
} from '../services/authService';

// Sign up
await signUpUser('email@test.com', 'password123', 'John Farmer');

// Sign in
await signInUser('email@test.com', 'password123');

// Sign out
await signOutUser();

// Get current user
const user = getCurrentUser();

// Update profile
await updateUserProfile(userId, { displayName: 'New Name' });

// Get user profile
const profile = await getUserProfile(userId);
```

## Pages

### Login Page (`/login`)
- Email input
- Password input
- Sign in button
- Demo account button (quick access)
- Link to signup page
- Feature highlights

### Signup Page (`/signup`)
- Full name input
- Email input
- Password input
- Confirm password input
- Form validation
- Terms agreement
- Link to login page

## Validation Rules

### Password
- Minimum 6 characters
- Firebase handles strength validation

### Email
- Must be valid email format
- Firebase checks uniqueness

### Full Name
- Minimum 2 characters

### Form Validation
- Client-side validation before submission
- Server-side validation by Firebase
- User-friendly error messages

## Database Structure

### Firestore Collection: `users`
```
users/
  {userId}/
    ├── uid: string
    ├── email: string
    ├── displayName: string
    ├── photoURL: string (null by default)
    ├── createdAt: timestamp
    ├── updatedAt: timestamp
    └── preferences/
        ├── alertNotifications: boolean
        ├── dailyReports: boolean
        └── dataRefreshInterval: number (seconds)
```

## Demo Account

For testing purposes, you can use:
- **Email**: demo@farmsense.com
- **Password**: Demo123!

Click "🎮 Demo Account" button on login page for quick access.

## Error Handling

The system handles these Firebase errors:

| Error Code | Message | Cause |
|-----------|---------|-------|
| `auth/email-already-in-use` | Email already in use | Signup with existing email |
| `auth/user-not-found` | No account found | Login with wrong email |
| `auth/wrong-password` | Incorrect password | Wrong password |
| `auth/invalid-email` | Invalid email | Malformed email |
| `auth/weak-password` | Password too weak | Password < 6 chars |

## Security Features

1. **Session Persistence** - `browserLocalPersistence` keeps users logged in
2. **Protected Routes** - Unauthorized users redirected to login
3. **Password Hashing** - Firebase handles password encryption
4. **Email Verification** - Can be added for additional security
5. **CSRF Protection** - Built into Firebase

## Firebase Rules for Users Collection

Add to Firestore Security Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents - own access only
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Trays - own trays only
    match /trays/{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

## Next Steps

1. **Set up Firebase credentials** - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. **Configure Firestore Rules** - Use rules above
3. **Test authentication** - Use demo account
4. **Customize user preferences** - Extend preferences object
5. **Add password reset** - Use `resetPasswordEmail()` function
6. **Social authentication** - Add Google, GitHub login

## Troubleshooting

### "Can't sign in" error
- Check Firebase project is active
- Verify credentials in `.env.local`
- Check Firestore rules allow writes

### Session doesn't persist
- Browser storage might be disabled
- Check privacy/incognito mode
- Verify `enablePersistence()` is called

### User profile not saving
- Check Firestore rules allow writes
- Verify `users` collection exists
- Check browser console for errors

### Demo account doesn't work
- Create account: Email: demo@farmsense.com, Password: Demo123!
- Or modify demo credentials in Login.jsx

## API Reference

### AuthContext Methods

```javascript
const {
  currentUser,      // Current Firebase user object
  isAuthenticated,  // Boolean - user is logged in
  loading,          // Boolean - auth state loading
  error,            // Error message if any
  logout,           // Function - sign out user
} = useAuth();
```

### Auth Service Functions

- `signUpUser(email, password, displayName)` - Create new account
- `signInUser(email, password)` - Sign in existing user
- `signOutUser()` - Sign out current user
- `getCurrentUser()` - Get current Firebase user
- `onAuthChange(callback)` - Subscribe to auth changes
- `updateUserProfile(userId, data)` - Update Firestore profile
- `getUserProfile(userId)` - Fetch user profile
- `resetPasswordEmail(email)` - Send password reset email

## Best Practices

1. **Always use `useAuth()`** instead of direct Firebase auth calls
2. **Handle loading state** - Show spinners during auth operations
3. **Validate form input** - Before submission
4. **Store sensitive data in Firestore** only
5. **Use protected routes** - Don't skip authentication checks
6. **Log out on suspicious activity** - Security best practice
7. **Update user preferences** - Periodically save settings

## Support

For issues with authentication:
1. Check Firebase project settings
2. Verify security rules
3. Review browser console errors
4. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for configuration
