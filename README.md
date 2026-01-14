# Seif's Portfolio

A modern, performant portfolio website built with React, Vite, and Firebase, featuring first-party analytics with LinkedIn tracking.

## Features

- 🎨 Modern, responsive design with dark/light mode
- 🔐 Protected admin dashboard
- 📊 **First-party analytics with LinkedIn tracking**
- 🚀 Deployed on Vercel with serverless API routes
- 🔥 Firebase Authentication & Firestore

## Analytics System

This portfolio includes a comprehensive first-party analytics system designed to reliably track visits from LinkedIn, including the LinkedIn in-app browser which often strips referrers or blocks third-party analytics.

### Key Features

- ✅ **LinkedIn Detection**: Identifies LinkedIn traffic via:
  - Referrer analysis (`linkedin.com`)
  - User agent detection (LinkedIn in-app browser/WebView)
  - UTM parameter tracking
  
- ✅ **First-Touch Attribution**: Stores initial traffic source in localStorage for 7 days, ensuring proper attribution even when referrer is lost on subsequent visits

- ✅ **Privacy-Focused**: 
  - No PII collection
  - IP addresses are hashed server-side
  - Only anonymized visitor IDs stored
  - Referrer domains (not full URLs) tracked

- ✅ **Reliable Tracking**:
  - Uses `navigator.sendBeacon` for better reliability in WebViews
  - Fallback to `fetch` with `keepalive` flag
  - Works even when page is closing/navigating

- ✅ **UTM Parameter Support**: Full tracking of:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `utm_content`
  - `utm_term`

### How It Works

1. **Client-Side** (`src/lib/track.ts`):
   - Tracks page views on route changes
   - Detects LinkedIn traffic via multiple signals
   - Manages first-touch attribution in localStorage
   - Sends data to `/api/track` endpoint

2. **Server-Side** (`api/track.ts`):
   - Receives tracking data via POST
   - Enriches with server-side data (hashed IP, timestamp)
   - Writes to Firestore using Firebase Admin SDK
   - Uses date-partitioned collections for efficiency

3. **Analytics Dashboard** (`/analytics`):
   - Fetches aggregated data from `/api/analytics/summary`
   - Displays LinkedIn-specific insights
   - Shows traffic sources, top pages, daily trends
   - Export to CSV functionality

### Adding UTM Parameters to LinkedIn Posts

To track specific LinkedIn campaigns, add UTM parameters to your links:

```
https://yourportfolio.com/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio_launch&utm_content=post1
```

**Example LinkedIn Post:**
```
Check out my latest project! 🚀

[Your compelling text here]

👉 https://yourportfolio.com/?utm_source=linkedin&utm_medium=social&utm_campaign=jan2026_launch
```

Even without UTM tags, the system will detect LinkedIn traffic automatically.

## Environment Variables

### Client-Side (.env)

```env
# Firebase Client SDK (already configured)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Server-Side (Vercel Environment Variables)

Add these in your Vercel project settings:

```env
# Firebase Admin SDK (for server-side Firestore writes)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"

# Analytics API Protection (optional but recommended)
ANALYTICS_API_KEY=your_secure_random_key_here

# IP Hashing Salt (optional, for privacy)
IP_HASH_SALT=your_random_salt_here
```

### Getting Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Extract the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters as-is)

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Name: `FIREBASE_PROJECT_ID`
   - Value: `your_project_id`
   - Environments: Production, Preview, Development
4. Repeat for all server-side variables
5. Redeploy your project for changes to take effect

## Firestore Security Rules

Update your Firestore security rules to allow server-side writes only:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics events - server-side writes only
    match /analytics_events/{document=**} {
      allow read: if request.auth != null; // Only authenticated users can read
      allow write: if false; // Only server (Admin SDK) can write
    }
    
    match /analytics_events_{date}/{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    // Your other collections...
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for Vercel deployment:

1. **Connect to Vercel**:
   ```bash
   vercel
   ```

2. **Set Environment Variables** (see above section)

3. **Deploy**:
   ```bash
   vercel --prod
   ```

The `vercel.json` configuration ensures:
- API routes are handled by serverless functions
- SPA routing works correctly
- All requests to `/api/*` go to serverless functions

## Project Structure

```
seif-portfolio/
├── api/                          # Vercel serverless functions
│   ├── track.ts                  # POST /api/track - receive tracking data
│   └── analytics/
│       └── summary.ts            # GET /api/analytics/summary - aggregated stats
├── src/
│   ├── components/               # React components
│   │   ├── Portfolio.tsx         # Main portfolio page
│   │   ├── AdminDashboard.tsx    # Content management
│   │   └── AnalyticsDashboard.tsx # Analytics dashboard
│   ├── lib/
│   │   └── track.ts              # Client-side tracking module
│   ├── server/
│   │   └── firebaseAdmin.ts      # Firebase Admin SDK initialization
│   ├── contexts/                 # React contexts
│   ├── App.tsx                   # Main app with routing
│   └── main.tsx                  # Entry point
├── vercel.json                   # Vercel configuration
└── package.json
```

## Testing the Analytics System

### Test Plan

1. **Direct Visit**:
   - Clear localStorage
   - Visit `https://yoursite.com/`
   - Check Firestore: should see event with `source: "direct"`

2. **LinkedIn with UTM**:
   - Visit: `https://yoursite.com/?utm_source=linkedin&utm_medium=social&utm_campaign=test`
   - Check Firestore: should see `source: "linkedin"` with UTM data

3. **Simulate LinkedIn WebView**:
   - Use browser DevTools
   - Open Console and run:
     ```javascript
     Object.defineProperty(navigator, 'userAgent', {
       get: () => 'LinkedInApp/1.0'
     });
     ```
   - Reload page
   - Check Firestore: should see `linkedinWebview: true`

4. **First-Touch Attribution**:
   - Visit with UTM parameters
   - Navigate to another page (without UTM)
   - Check localStorage: should have `analytics_first_touch`
   - Check Firestore: second event should include `firstTouch` data

5. **Analytics Dashboard**:
   - Login to `/analytics`
   - Verify all metrics display correctly
   - Check LinkedIn-specific stats
   - Test CSV export

### Monitoring

Check Firestore collections:
- `analytics_events` - Main collection with all events
- `analytics_events_YYYY_MM_DD` - Date-partitioned collections

Each event document contains:
```javascript
{
  ts: 1705234567890,              // Client timestamp
  path: "/",                       // Page path
  source: "linkedin",              // Traffic source
  refDomain: "linkedin.com",       // Referrer domain
  utm: {                           // UTM parameters
    utm_source: "linkedin",
    utm_medium: "social",
    utm_campaign: "portfolio"
  },
  linkedinWebview: true,           // LinkedIn in-app browser flag
  visitorId: "v_1705234567890_abc", // Anonymous visitor ID
  firstTouch: { ... },             // First-touch attribution
  receivedAt: 1705234567900,       // Server timestamp
  dateStr: "2026-01-14",           // Date string for querying
  ipHash: "a1b2c3d4e5f6",          // Hashed IP
  userAgent: "...",                // Full user agent
  createdAt: Timestamp             // Firestore timestamp
}
```

## Protected Routes

- `/admin` - Content management dashboard (requires authentication)
- `/analytics` - Analytics dashboard (requires authentication)
- `/login` - Authentication page

## License

Private portfolio project.

## Author

Seif Mohsen
