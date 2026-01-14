# Analytics System Test Plan

## Prerequisites
- [ ] Firebase Admin credentials configured in Vercel
- [ ] Firestore security rules updated
- [ ] Project deployed to Vercel
- [ ] Can access /login and /analytics pages

## Test 1: Direct Visit
**Objective**: Verify tracking works for direct traffic

1. Open browser in incognito/private mode
2. Clear localStorage: `localStorage.clear()`
3. Visit your portfolio homepage
4. Open browser DevTools → Network tab
5. Look for POST request to `/api/track`
6. Verify request payload contains:
   ```json
   {
     "source": "direct",
     "refDomain": "",
     "linkedinWebview": false
   }
   ```
7. Check Firestore `analytics_events` collection
8. Verify new document exists with `source: "direct"`

**Expected Result**: ✅ Event tracked with source="direct"

---

## Test 2: LinkedIn with UTM Parameters
**Objective**: Verify UTM parameter tracking

1. Clear localStorage
2. Visit: `https://yoursite.com/?utm_source=linkedin&utm_medium=social&utm_campaign=test_campaign&utm_content=test_post`
3. Check Network tab for `/api/track` POST
4. Verify payload contains:
   ```json
   {
     "source": "linkedin",
     "utm": {
       "utm_source": "linkedin",
       "utm_medium": "social",
       "utm_campaign": "test_campaign",
       "utm_content": "test_post"
     }
   }
   ```
5. Check Firestore for event with UTM data

**Expected Result**: ✅ Event tracked with source="linkedin" and all UTM parameters

---

## Test 3: LinkedIn In-App Browser Detection
**Objective**: Verify LinkedIn WebView detection

1. Clear localStorage
2. Open DevTools Console
3. Override user agent:
   ```javascript
   Object.defineProperty(navigator, 'userAgent', {
     get: () => 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) LinkedInApp/4.1.0 Chrome/91.0.4472.120 Mobile Safari/537.36',
     configurable: true
   });
   ```
4. Reload the page
5. Check `/api/track` payload:
   ```json
   {
     "linkedinWebview": true,
     "source": "linkedin"
   }
   ```
6. Check Firestore event has `linkedinWebview: true`

**Expected Result**: ✅ LinkedIn WebView detected correctly

---

## Test 4: First-Touch Attribution
**Objective**: Verify first-touch attribution persists across sessions

1. Clear localStorage
2. Visit with UTM: `https://yoursite.com/?utm_source=linkedin&utm_campaign=initial`
3. Check localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('analytics_first_touch'))
   ```
   Should contain:
   ```json
   {
     "source": "linkedin",
     "utm": { "utm_source": "linkedin", "utm_campaign": "initial" },
     "timestamp": 1705234567890,
     "expiresAt": 1705839367890
   }
   ```
4. Navigate to another page (e.g., scroll to a section)
5. Check new tracking event includes `firstTouch` data
6. Close browser and reopen (within 7 days)
7. Visit site directly (no UTM)
8. Verify event still includes original `firstTouch` attribution

**Expected Result**: ✅ First-touch attribution persists for 7 days

---

## Test 5: Excluded Routes
**Objective**: Verify /admin and /analytics are not tracked

1. Login to the site
2. Visit `/admin`
3. Check Network tab - should see NO `/api/track` request
4. Visit `/analytics`
5. Check Network tab - should see NO `/api/track` request
6. Visit homepage
7. Should see `/api/track` request

**Expected Result**: ✅ Protected routes are not tracked

---

## Test 6: sendBeacon vs Fetch
**Objective**: Verify sendBeacon is used when available

1. Open DevTools → Network tab
2. Visit homepage
3. Look for `/api/track` request
4. Check request type - should use `sendBeacon` if supported
5. In Console, test:
   ```javascript
   console.log('sendBeacon available:', !!navigator.sendBeacon);
   ```

**Expected Result**: ✅ sendBeacon used when available

---

## Test 7: Analytics API Endpoint
**Objective**: Verify analytics summary endpoint works

1. Get your analytics API key from Vercel env vars (or use query param if testing)
2. Make request:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://yoursite.com/api/analytics/summary?days=30
   ```
   Or visit in browser:
   ```
   https://yoursite.com/api/analytics/summary?key=YOUR_API_KEY&days=30
   ```
3. Verify response contains:
   ```json
   {
     "totalVisits": 5,
     "uniqueVisitors": 2,
     "visitsBySource": {
       "linkedin": 3,
       "direct": 2
     },
     "topPages": [...],
     "dailyVisits": [...],
     "linkedInStats": {
       "total": 3,
       "webview": 1,
       "withUTM": 2
     }
   }
   ```

**Expected Result**: ✅ API returns aggregated analytics data

---

## Test 8: Analytics Dashboard
**Objective**: Verify dashboard displays data correctly

1. Login to `/analytics`
2. Verify dashboard loads without errors
3. Check that metrics display:
   - Total Visits
   - Unique Visitors
   - Engagement Rate
   - LinkedIn Visits
4. Verify LinkedIn Insights section shows:
   - Total LinkedIn Visits
   - In-App Browser count
   - With UTM Tags count
5. Check Traffic Sources chart
6. Check Top Pages list
7. Check Daily Visits chart
8. Click "Refresh" button - data should reload
9. Click "Export" button - CSV should download

**Expected Result**: ✅ Dashboard displays all metrics correctly

---

## Test 9: Visitor ID Persistence
**Objective**: Verify visitor ID persists across page views

1. Clear localStorage
2. Visit homepage
3. Check localStorage:
   ```javascript
   localStorage.getItem('analytics_visitor_id')
   ```
4. Note the visitor ID
5. Navigate to different pages
6. Check that visitor ID remains the same
7. Close and reopen browser
8. Visitor ID should still be the same

**Expected Result**: ✅ Visitor ID persists in localStorage

---

## Test 10: Referrer Tracking
**Objective**: Verify referrer domain is captured

1. Create a simple HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
     <a href="https://yoursite.com/">Visit Portfolio</a>
   </body>
   </html>
   ```
2. Open this file in browser
3. Click the link
4. Check `/api/track` payload
5. Should contain `refDomain` from the HTML file's origin

**Expected Result**: ✅ Referrer domain captured correctly

---

## Test 11: IP Hashing
**Objective**: Verify IP addresses are hashed server-side

1. Make a request to your site
2. Check Firestore event document
3. Verify `ipHash` field exists
4. Verify it's a short hash (16 characters), not a full IP
5. Verify no plain IP address is stored

**Expected Result**: ✅ Only hashed IP stored, no plain IP

---

## Test 12: Date Partitioning
**Objective**: Verify events are stored in date-partitioned collections

1. Create several test events
2. Check Firestore collections
3. Should see:
   - `analytics_events` (main collection)
   - `analytics_events_2026_01_14` (date-partitioned)
4. Verify same event appears in both collections

**Expected Result**: ✅ Events stored in both main and partitioned collections

---

## Production Checklist

Before going live:
- [ ] All tests above pass
- [ ] Firebase Admin credentials set in Vercel
- [ ] `ANALYTICS_API_KEY` set in Vercel
- [ ] `IP_HASH_SALT` set in Vercel
- [ ] Firestore security rules updated
- [ ] Tested on mobile device
- [ ] Tested in LinkedIn mobile app (if possible)
- [ ] Verified no console errors
- [ ] Verified no tracking on /admin and /analytics
- [ ] CSV export works
- [ ] Dashboard loads quickly (< 2s)

---

## Debugging Tips

### No events in Firestore
1. Check browser console for errors
2. Check Network tab for failed `/api/track` requests
3. Verify Vercel function logs for errors
4. Ensure Firebase Admin credentials are correct
5. Check Firestore security rules

### Analytics dashboard shows no data
1. Verify `/api/analytics/summary` returns data (use curl)
2. Check browser console for fetch errors
3. Verify `ANALYTICS_API_KEY` is set (or endpoint allows access)
4. Check Vercel function logs

### LinkedIn detection not working
1. Test with actual LinkedIn mobile app
2. Verify user agent patterns in `src/lib/track.ts`
3. Check referrer in Network tab
4. Test with UTM parameters as fallback

### First-touch attribution not persisting
1. Check localStorage in DevTools
2. Verify expiry timestamp is 7 days in future
3. Check that `analytics_first_touch` key exists
4. Verify JSON parsing doesn't fail

---

## Manual LinkedIn Testing

To test with real LinkedIn traffic:

1. Create a LinkedIn post with your portfolio link + UTM:
   ```
   Check out my portfolio! 🚀
   
   https://yoursite.com/?utm_source=linkedin&utm_medium=social&utm_campaign=test_jan2026
   ```

2. Post it (you can delete it later)

3. Open the post on:
   - LinkedIn web (desktop)
   - LinkedIn mobile web
   - LinkedIn mobile app (iOS/Android)

4. Click the link from each platform

5. Check Firestore for events from each platform

6. Verify:
   - Web: `source: "linkedin"`, `linkedinWebview: false`
   - Mobile app: `source: "linkedin"`, `linkedinWebview: true`
   - All have UTM parameters

---

## Success Criteria

✅ All 12 tests pass
✅ No console errors
✅ Events appear in Firestore within 1 second
✅ Dashboard loads and displays data correctly
✅ LinkedIn traffic is properly attributed
✅ First-touch attribution works across sessions
✅ Protected routes are not tracked
✅ Privacy is maintained (no PII, hashed IPs)
