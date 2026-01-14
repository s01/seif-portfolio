# Quick Start: Firebase Admin Setup

This guide will help you set up Firebase Admin SDK credentials for your Vercel deployment.

## Step 1: Generate Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **seif-portfolio-abe7a**
3. Click the gear icon ⚙️ → **Project Settings**
4. Navigate to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** in the confirmation dialog
7. A JSON file will download (keep it safe!)

## Step 2: Extract Credentials

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "seif-portfolio-abe7a",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@seif-portfolio-abe7a.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

You need these three values:
- `project_id` → **FIREBASE_PROJECT_ID**
- `client_email` → **FIREBASE_CLIENT_EMAIL**
- `private_key` → **FIREBASE_PRIVATE_KEY**

## Step 3: Add to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

#### FIREBASE_PROJECT_ID
- **Name**: `FIREBASE_PROJECT_ID`
- **Value**: `seif-portfolio-abe7a`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### FIREBASE_CLIENT_EMAIL
- **Name**: `FIREBASE_CLIENT_EMAIL`
- **Value**: `firebase-adminsdk-xxxxx@seif-portfolio-abe7a.iam.gserviceaccount.com`
  (Copy from your JSON file)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### FIREBASE_PRIVATE_KEY
- **Name**: `FIREBASE_PRIVATE_KEY`
- **Value**: Paste the entire private key INCLUDING the quotes and newlines
  ```
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n"
  ```
  ⚠️ **Important**: Keep the `\n` characters as-is. Do NOT replace them with actual newlines.
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### ANALYTICS_API_KEY (Optional but Recommended)
- **Name**: `ANALYTICS_API_KEY`
- **Value**: Generate a secure random key:
  ```bash
  # On Mac/Linux:
  openssl rand -base64 32
  
  # On Windows PowerShell:
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  ```
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### IP_HASH_SALT (Optional)
- **Name**: `IP_HASH_SALT`
- **Value**: Generate another secure random key (same method as above)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

### Option B: Vercel CLI

```bash
# Set environment variables via CLI
vercel env add FIREBASE_PROJECT_ID
# Enter: seif-portfolio-abe7a
# Select: Production, Preview, Development

vercel env add FIREBASE_CLIENT_EMAIL
# Enter: firebase-adminsdk-xxxxx@seif-portfolio-abe7a.iam.gserviceaccount.com
# Select: Production, Preview, Development

vercel env add FIREBASE_PRIVATE_KEY
# Paste the entire private key with quotes and \n
# Select: Production, Preview, Development

vercel env add ANALYTICS_API_KEY
# Enter: your_generated_key
# Select: Production, Preview, Development

vercel env add IP_HASH_SALT
# Enter: your_generated_salt
# Select: Production, Preview, Development
```

## Step 4: Redeploy

After adding environment variables, you must redeploy:

```bash
# Trigger a new deployment
vercel --prod

# Or push to your Git repository (if auto-deploy is enabled)
git add .
git commit -m "Add analytics system"
git push
```

## Step 5: Verify

1. Check deployment logs in Vercel dashboard
2. Look for any errors related to Firebase Admin
3. Test the `/api/track` endpoint:
   ```bash
   curl -X POST https://yoursite.com/api/track \
     -H "Content-Type: application/json" \
     -d '{
       "ts": 1705234567890,
       "path": "/test",
       "source": "test",
       "refDomain": "",
       "utm": {},
       "linkedinWebview": false,
       "visitorId": "test_visitor"
     }'
   ```
4. Check Firestore for the test event

## Troubleshooting

### Error: "Missing Firebase Admin credentials"
- Verify all three variables are set in Vercel
- Check for typos in variable names
- Ensure you selected all environments (Production, Preview, Development)

### Error: "Invalid private key"
- Make sure you copied the ENTIRE private key including:
  - Opening quote `"`
  - `-----BEGIN PRIVATE KEY-----`
  - The key content
  - `-----END PRIVATE KEY-----`
  - Closing quote `"`
  - All `\n` characters (don't replace with actual newlines)

### Error: "Permission denied"
- Verify the service account has Firestore permissions
- Check Firestore security rules allow server-side writes

### Events not appearing in Firestore
- Check Vercel function logs for errors
- Verify Firebase Admin credentials are correct
- Ensure Firestore database exists
- Check that collections are being created

## Security Best Practices

✅ **DO**:
- Keep the service account JSON file secure (never commit to Git)
- Use environment variables for all credentials
- Rotate keys periodically
- Use different service accounts for dev/prod if needed

❌ **DON'T**:
- Commit the service account JSON to Git
- Share the private key publicly
- Use the same key across multiple projects
- Store credentials in client-side code

## Next Steps

After setup is complete:
1. ✅ Test the tracking system (see ANALYTICS_TEST_PLAN.md)
2. ✅ Update Firestore security rules (see README.md)
3. ✅ Create a test LinkedIn post with UTM parameters
4. ✅ Verify events appear in Firestore
5. ✅ Check the /analytics dashboard

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Review Firebase Admin SDK documentation
4. Verify Firestore security rules
5. Test with the ANALYTICS_TEST_PLAN.md

---

**You're all set!** 🎉

Your analytics system is now ready to track LinkedIn traffic reliably.
