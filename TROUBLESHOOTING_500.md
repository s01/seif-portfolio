# Troubleshooting 500 Error on /api/analytics/summary

## 🔍 **The Error**

```
GET https://www.seifmohsen.com/api/analytics/summary?days=30 500 (Internal Server Error)
```

This means the Vercel serverless function is running but encountering an error.

## 🩺 **Step 1: Check Health Endpoint**

I've added a diagnostic endpoint. After Vercel redeploys (wait ~2 minutes), visit:

```
https://www.seifmohsen.com/api/health
```

This will show you:
- ✅ Which environment variables are set
- ❌ Which environment variables are missing
- ✅ Firebase Admin SDK initialization status
- ❌ Any Firebase connection errors

## 🔧 **Step 2: Check Vercel Function Logs**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **seif-portfolio** project
3. Click on the latest deployment
4. Click **"Functions"** tab
5. Find `/api/analytics/summary`
6. Click to see the error logs

**Look for:**
- `Missing Firebase Admin credentials`
- `FIREBASE_PROJECT_ID is not defined`
- `Error: Invalid private key`
- `Permission denied` (Firestore)

## 🎯 **Most Likely Causes**

### **Cause 1: Missing Environment Variables** (90% likely)

The environment variables might not be set in Vercel.

**Fix:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add all 5 variables from your `.env` file:

```
FIREBASE_PROJECT_ID=seif-portfolio-abe7a
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@seif-portfolio-abe7a.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ANALYTICS_API_KEY=PLKFZBj27+Qs8QQ/szfkIlt5Xo8nQ1TWLIvVFFCE/q/k=
IP_HASH_SALT=yL44OkL14mBQ3uO8AoUzAiFQk4qi/oNEShqsnnu3J8Is=
```

⚠️ **IMPORTANT for FIREBASE_PRIVATE_KEY:**
- Include the quotes: `"-----BEGIN...`
- Keep the `\n` characters (don't replace with actual newlines)
- Select all 3 environments: Production, Preview, Development

4. **Redeploy** after adding variables:
   - Go to **Deployments** tab
   - Click the three dots (...) on latest deployment
   - Click **"Redeploy"**

### **Cause 2: Private Key Format Issue** (5% likely)

The `FIREBASE_PRIVATE_KEY` might have incorrect newline formatting.

**Fix:**
In Vercel environment variables, the value should be:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCy6rf+1tAQTFPT\n4oUSR/oY3G37OfMNBEgOqjmK3tUI39WgXmHeBE3c2nQ2NHAKg/OnzBfCNC1fXAmS\nSDLbVs2ZbOKZiNVfc/cXY8HNSueWDz3yewDCBNWgTSVKuvRjrekhQhPJ+4U1x7Un\n9j9sEzIpucrwoylAYei59O5cMaAJLm/MoM0dYd7tpZ0YaQlf2lCcSPmrIbRm3aPG\n8kcX4xhjeHjPWfFZjR0TRmLNXR7S+3yI8t/Oa4aEacgC8QTbL8gFziiwCuAnJcLO\nhaJ+7ttuCCbkcbZFladRD5aaFBCtGbtPO5bNEwJtqnHbS+MizfT9wLVL2E+fN7+F\nPeVZ8+SvAgMBAAECggEAN/GEjr6EWFRFcd9GVK0E2nkyOneoM82+6jb3vyBl5Fx4\n46gfWdhmsEPuSnSjA+a2bSU32JWQCl0w8Ph6TnMZ3ntZb0CF107fWATtOE/PkfA6\nInOrjP8N/Q2iN3e1quVaG/gZT/LBeEt1rYUl15k4+isJ9axO3b6/kkWvskwiCjxg\nvZYm9avn5CMSyn5AVO1T0a9lfFqACY8RqfDftSE2El75pXHiaCoyKPkG/vE/Ax5D\ndUKO74BiHAgA6ji47xSW1y/nnCH/gv3PeT4I88pLhjda8oQ1bUSxaZ2c5ZVgF/cg\ntnAveLIDXZZFwY73ArEi/wE4A42Y/02VNfWExYQiYQKBgQDk0VOES2bOEgXRW5SH\nO9rLSAZDKFxRUOufpqNnbjUo8W4naU7+4Uwy2PgbuPsNlU2MrNI1qFbAkxj0zykU\nkIq5+24bqtnZmOyhVR/3N5LMvx9L8oKStGLfTv+2tkcpbR2ssjW6Lr1CmFaYaF1x\nC/x+IcdBwJFTWPPtcJT4q0j/hQKBgQDIK9ZY6bsiP0dcbumpIMd+i6NREsluB1Cr\nnY2Q+96qsOPwszQTLMpOLfkgwKEOVoyGOkwWNa42kkuEK7cb6yG1MgSE/9/gqlcV\nF+KrGyUZHuhw4kD93u0jecEKEz6ECpNcJfs+gAi+Y5+px2xDy6kRHfupjYF+iXF8\nyVHkMwdXowKBgQCsKKbaydSOxValP29QFIO5IPa9Pre+4tB1bW5SWsQaixQjCQPL\nl326YC7ExPf3L1eKuVjr0D19ZO+I+fjhpSMLbZZZsMF6C6o2dJK5cZG9BSup+8us\nT5Z4h7q0IQ8HpzaFggwUiigR3AaDYzqy3J7b09RUr2toN2xIQMWFF3Kz9QKBgQCc\nNqHTx6wz4OBHAYO2ao9lcYIlvhyWknzhQVZ+hCFUYjGw4ZlNMZI8CuK2Lb5C20ZV\nZl+EoaXwjqECZ79BuXEX4A3o4WsNAMJvArHxSIDeJuHNXrTLqtKz8cu1mikakMpJ\nipaVQwQP2N18eNZD3kd1xUlmG7moT4jSkqYnCa+8MwKBgE6Y8YcrT4Jsy7D7ZYUl\nvgJanDfDZcaKHt0wfOwzynKrq/85hSishsrPrjOue08RmCYkjvfY+hSZ12ush8nj\nxG+jYl09JIuHMlz2c8IADwrn+wKW8reOoj++Q8AWOfux7YpT+kiYjofQjld6YtHr\n4CB4UMyGBFj2LNNDQttClDJL\n-----END PRIVATE KEY-----\n"
```

Copy this EXACT value from your `.env` file.

### **Cause 3: Firestore Permissions** (3% likely)

The Firebase service account might not have Firestore permissions.

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **seif-portfolio-abe7a**
3. Go to **Firestore Database**
4. Click **Rules** tab
5. Make sure rules allow server-side reads:
   ```javascript
   match /analytics_events/{document=**} {
     allow read: if request.auth != null;
     allow write: if false; // Server writes via Admin SDK
   }
   ```
6. Click **Publish**

### **Cause 4: Firebase Admin SDK Import Issue** (2% likely)

The import path might be incorrect in production.

**Check:** Look at Vercel function logs for import errors.

## 📋 **Quick Checklist**

After Vercel redeploys (~2 min), check:

1. ✅ Visit `https://www.seifmohsen.com/api/health`
   - Should show `status: "ok"`
   - All environment variables should be `true`
   - Firebase status should be `"connected"`

2. ✅ Check Vercel Dashboard → Functions → Logs
   - Look for specific error messages

3. ✅ Verify environment variables in Vercel
   - All 5 variables set
   - All 3 environments selected
   - Private key has correct format

4. ✅ Redeploy after adding/fixing variables
   - Deployments → ... → Redeploy

## 🎯 **Expected Health Check Response**

When everything is working:

```json
{
  "status": "ok",
  "timestamp": "2026-01-14T09:30:00.000Z",
  "environment": {
    "variables": {
      "FIREBASE_PROJECT_ID": true,
      "FIREBASE_CLIENT_EMAIL": true,
      "FIREBASE_PRIVATE_KEY": true,
      "ANALYTICS_API_KEY": true,
      "IP_HASH_SALT": true
    },
    "missing": []
  },
  "firebase": {
    "status": "connected",
    "error": null
  }
}
```

## 🚨 **If Health Check Shows Missing Variables**

```json
{
  "status": "missing_env_vars",
  "environment": {
    "missing": ["FIREBASE_PRIVATE_KEY", "ANALYTICS_API_KEY"]
  }
}
```

**Action:** Add the missing variables in Vercel Dashboard → Settings → Environment Variables

## 🔄 **After Fixing**

1. Wait for Vercel to redeploy (~2 minutes)
2. Visit `https://www.seifmohsen.com/api/health` - should be "ok"
3. Visit `https://www.seifmohsen.com/analytics` - should load dashboard
4. Test tracking: Visit `https://www.seifmohsen.com/?utm_source=linkedin&utm_medium=test`
5. Check Firestore for new events

## 💡 **Need More Help?**

Share the output from:
1. `https://www.seifmohsen.com/api/health`
2. Vercel function logs (screenshot)

And I can provide specific guidance!

---

**Most likely fix:** Add the 5 environment variables in Vercel Dashboard, then redeploy.
