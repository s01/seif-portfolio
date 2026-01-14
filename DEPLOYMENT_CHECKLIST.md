# Deployment Checklist

## ✅ Local Setup Complete
- [x] Firebase Admin credentials added to `.env`
- [x] API keys generated
- [x] `.env` is in `.gitignore`
- [x] Dependencies installed (`firebase-admin`, `@vercel/node`)
- [x] Build succeeds (`npm run build`)

## 📋 Next Steps for Vercel Deployment

### 1. Update Firestore Security Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **seif-portfolio-abe7a**
3. Navigate to **Firestore Database** → **Rules**
4. Copy the rules from `firestore.rules` file
5. Click **Publish**

### 2. Set Environment Variables in Vercel

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these **5 variables** (copy from your `.env` file):

#### Variable 1: FIREBASE_PROJECT_ID
```
Name: FIREBASE_PROJECT_ID
Value: seif-portfolio-abe7a
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2: FIREBASE_CLIENT_EMAIL
```
Name: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@seif-portfolio-abe7a.iam.gserviceaccount.com
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3: FIREBASE_PRIVATE_KEY
```
Name: FIREBASE_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCy6rf+1tAQTFPT\n4oUSR/oY3G37OfMNBEgOqjmK3tUI39WgXmHeBE3c2nQ2NHAKg/OnzBfCNC1fXAmS\nSDLbVs2ZbOKZiNVfc/cXY8HNSueWDz3yewDCBNWgTSVKuvRjrekhQhPJ+4U1x7Un\n9j9sEzIpucrwoylAYei59O5cMaAJLm/MoM0dYd7tpZ0YaQlf2lCcSPmrIbRm3aPG\n8kcX4xhjeHjPWfFZjR0TRmLNXR7S+3yI8t/Oa4aEacgC8QTbL8gFziiwCuAnJcLO\nhaJ+7ttuCCbkcbZFladRD5aaFBCtGbtPO5bNEwJtqnHbS+MizfT9wLVL2E+fN7+F\nPeVZ8+SvAgMBAAECggEAN/GEjr6EWFRFcd9GVK0E2nkyOneoM82+6jb3vyBl5Fx4\n46gfWdhmsEPuSnSjA+a2bSU32JWQCl0w8Ph6TnMZ3ntZb0CF107fWATtOE/PkfA6\nInOrjP8N/Q2iN3e1quVaG/gZT/LBeEt1rYUl15k4+isJ9axO3b6/kkWvskwiCjxg\nvZYm9avn5CMSyn5AVO1T0a9lfFqACY8RqfDftSE2El75pXHiaCoyKPkG/vE/Ax5D\ndUKO74BiHAgA6ji47xSW1y/nnCH/gv3PeT4I88pLhjda8oQ1bUSxaZ2c5ZVgF/cg\ntnAveLIDXZZFwY73ArEi/wE4A42Y/02VNfWExYQiYQKBgQDk0VOES2bOEgXRW5SH\nO9rLSAZDKFxRUOufpqNnbjUo8W4naU7+4Uwy2PgbuPsNlU2MrNI1qFbAkxj0zykU\nkIq5+24bqtnZmOyhVR/3N5LMvx9L8oKStGLfTv+2tkcpbR2ssjW6Lr1CmFaYaF1x\nC/x+IcdBwJFTWPPtcJT4q0j/hQKBgQDIK9ZY6bsiP0dcbumpIMd+i6NREsluB1Cr\nnY2Q+96qsOPwszQTLMpOLfkgwKEOVoyGOkwWNa42kkuEK7cb6yG1MgSE/9/gqlcV\nF+KrGyUZHuhw4kD93u0jecEKEz6ECpNcJfs+gAi+Y5+px2xDy6kRHfupjYF+iXF8\nyVHkMwdXowKBgQCsKKbaydSOxValP29QFIO5IPa9Pre+4tB1bW5SWsQaixQjCQPL\nl326YC7ExPf3L1eKuVjr0D19ZO+I+fjhpSMLbZZZsMF6C6o2dJK5cZG9BSup+8us\nT5Z4h7q0IQ8HpzaFggwUiigR3AaDYzqy3J7b09RUr2toN2xIQMWFF3Kz9QKBgQCc\nNqHTx6wz4OBHAYO2ao9lcYIlvhyWknzhQVZ+hCFUYjGw4ZlNMZI8CuK2Lb5C20ZV\nZl+EoaXwjqECZ79BuXEX4A3o4WsNAMJvArHxSIDeJuHNXrTLqtKz8cu1mikakMpJ\nipaVQwQP2N18eNZD3kd1xUlmG7moT4jSkqYnCa+8MwKBgE6Y8YcrT4Jsy7D7ZYUl\nvgJanDfDZcaKHt0wfOwzynKrq/85hSishsrPrjOue08RmCYkjvfY+hSZ12ush8nj\nxG+jYl09JIuHMlz2c8IADwrn+wKW8reOoj++Q8AWOfux7YpT+kiYjofQjld6YtHr\n4CB4UMyGBFj2LNNDQttClDJL\n-----END PRIVATE KEY-----\n"

⚠️ IMPORTANT: Copy the ENTIRE value including quotes and \n characters
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 4: ANALYTICS_API_KEY
```
Name: ANALYTICS_API_KEY
Value: PLKFZBj27+Qs8QQ/szfkIlt5Xo8nQ1TWLIvVFFCE/q/k=
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 5: IP_HASH_SALT
```
Name: IP_HASH_SALT
Value: yL44OkL14mBQ3uO8AoUzAiFQk4qi/oNEShqsnnu3J8Is=
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3. Deploy to Vercel

```bash
# Option A: Deploy via CLI
vercel --prod

# Option B: Push to Git (if auto-deploy enabled)
git add .
git commit -m "Add LinkedIn analytics tracking system"
git push
```

### 4. Test the Deployment

After deployment completes:

1. **Test tracking endpoint:**
   ```bash
   curl -X POST https://yoursite.vercel.app/api/track \
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
   Expected: `{"success":true}`

2. **Check Firestore:**
   - Go to Firebase Console → Firestore Database
   - Look for `analytics_events` collection
   - Should see the test event

3. **Test analytics API:**
   ```bash
   curl "https://yoursite.vercel.app/api/analytics/summary?key=PLKFZBj27+Qs8QQ/szfkIlt5Xo8nQ1TWLIvVFFCE/q/k="
   ```
   Expected: JSON with analytics data

4. **Test the dashboard:**
   - Visit `https://yoursite.vercel.app/analytics`
   - Login with your credentials
   - Should see the analytics dashboard with data

5. **Test live tracking:**
   - Visit your homepage with UTM:
     ```
     https://yoursite.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=test
     ```
   - Check Firestore for new event
   - Check dashboard for updated stats

### 5. Run Full Test Suite

Follow the comprehensive test plan in `ANALYTICS_TEST_PLAN.md`:
- [ ] Direct visit tracking
- [ ] LinkedIn with UTM
- [ ] LinkedIn WebView simulation
- [ ] First-touch attribution
- [ ] Excluded routes (/admin, /analytics)
- [ ] sendBeacon usage
- [ ] Analytics API
- [ ] Dashboard display
- [ ] Visitor ID persistence
- [ ] Referrer tracking
- [ ] IP hashing
- [ ] Date partitioning

### 6. Create Test LinkedIn Post

Once everything works, create a real LinkedIn post:

```
🚀 Excited to share my updated portfolio!

Check out my latest projects and experience in web development, 
featuring React, Firebase, and Salesforce integrations.

👉 https://yoursite.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=jan2026_launch&utm_content=main_post

#WebDevelopment #Portfolio #React #Firebase #Salesforce
```

Then:
- Click the link from LinkedIn web
- Click from LinkedIn mobile app
- Check Firestore for both events
- Verify `linkedinWebview: true` for mobile app
- Check dashboard for LinkedIn stats

## 🎯 Success Criteria

- [ ] Vercel deployment succeeds
- [ ] No errors in Vercel function logs
- [ ] Events appear in Firestore
- [ ] Analytics dashboard loads and displays data
- [ ] LinkedIn traffic is detected correctly
- [ ] UTM parameters are captured
- [ ] First-touch attribution works
- [ ] No console errors in browser
- [ ] CSV export works

## 📊 Monitoring

After deployment, monitor:
1. **Vercel Function Logs** - Check for errors
2. **Firestore Usage** - Monitor read/write operations
3. **Browser Console** - Check for client-side errors
4. **Analytics Dashboard** - Verify data accuracy

## 🔒 Security Reminder

- ✅ `.env` is in `.gitignore`
- ✅ Never commit service account JSON to Git
- ✅ Environment variables are only in Vercel
- ✅ Firestore rules restrict client writes
- ✅ Analytics API is protected by key

## 📝 Notes

- The dev server (`npm run dev`) won't have access to server-side env vars
- API routes only work in production or Vercel preview deployments
- For local testing of API routes, use `vercel dev` instead of `npm run dev`

## 🆘 Troubleshooting

If something doesn't work:
1. Check Vercel deployment logs
2. Check Vercel function logs for `/api/track` and `/api/analytics/summary`
3. Verify all 5 environment variables are set in Vercel
4. Check Firestore security rules are published
5. Test with `curl` commands above
6. Review `ANALYTICS_TEST_PLAN.md` for specific test cases

---

**Ready to deploy!** 🚀

All credentials are configured. Just follow the steps above to deploy to Vercel.
