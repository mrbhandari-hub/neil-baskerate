# DNS Troubleshooting for nello.my

## Quick Fixes to Try

### 1. Clear Your Local DNS Cache (Do This First!)

**On Mac (your system):**
```bash
sudo killall -HUP mDNSResponder
```

Then try accessing your site again.

### 2. Check Vercel Domain Status

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your `neil-baskerate` project
3. Go to **Settings** → **Domains**
4. Check if `nello.my` shows:
   - ✅ **Valid Configuration** (green checkmark)
   - ⚠️ **Pending** (yellow warning)
   - ❌ **Invalid Configuration** (red error)

### 3. Verify DNS Records in Vercel

In Vercel's domain settings, you should see DNS records. Common setups:

**Option A: Using Vercel Nameservers (if you bought domain through Vercel)**
- Should be automatic
- Nameservers should be: `ns1.vercel-dns.com` and `ns2.vercel-dns.com`

**Option B: Using DNS Records**
- You should see a CNAME or A record
- Copy these values

### 4. Check Your Domain Registrar

Since you bought the domain through Vercel, check:

1. Go to Vercel Dashboard → **Settings** → **Domains**
2. Click on `nello.my`
3. Look for "Nameservers" or "DNS Records" section
4. Verify the nameservers are set correctly

### 5. Test DNS Propagation

Check if DNS has propagated globally:
- Go to [dnschecker.org](https://dnschecker.org)
- Enter `nello.my`
- Select record type: **A** or **CNAME**
- Click "Search"
- See if records are showing up worldwide

### 6. Check if Vercel Deployment is Working

1. In Vercel dashboard, check your project
2. Look for the default Vercel URL (like `neil-baskerate.vercel.app`)
3. Try accessing that URL - does it work?
4. If the Vercel URL works but your custom domain doesn't, it's a DNS issue

### 7. Common Issues & Solutions

**Issue: Domain shows "Pending" in Vercel**
- Wait 10-30 more minutes
- DNS can take up to 48 hours (but usually faster)

**Issue: Domain shows "Invalid Configuration"**
- Check that nameservers are correct
- Make sure no conflicting DNS records exist

**Issue: Works on some networks but not others**
- DNS propagation is still in progress
- Wait longer or clear DNS cache on that device

**Issue: Bought domain through Vercel but DNS not configured**
- Sometimes you need to manually verify the domain
- Check Vercel's domain settings for a "Verify" button

### 8. Force DNS Refresh

Try accessing your site using:
- Different browser (Chrome, Firefox, Safari)
- Incognito/Private mode
- Mobile data (instead of WiFi)
- Different device

### 9. Check Vercel Project Settings

1. Go to your project in Vercel
2. Settings → Domains
3. Make sure `nello.my` is listed
4. If there's a warning icon, click it to see what's wrong

### 10. Contact Vercel Support (If Still Not Working)

If nothing works after 2-3 hours:
1. Go to [vercel.com/support](https://vercel.com/support)
2. Include:
   - Your domain: `nello.my`
   - Project name: `neil-baskerate`
   - Screenshot of domain settings
   - Error message you're seeing

---

## Quick Command to Test DNS

Run this in Terminal to check if DNS is resolving:

```bash
nslookup nello.my
```

Or:

```bash
dig nello.my
```

If you see IP addresses, DNS is working. If you see "NXDOMAIN" or no results, DNS isn't configured yet.

---

## Expected Timeline

- **Immediate:** If using Vercel nameservers (bought through Vercel) - should work in 5-15 minutes
- **Normal:** 30 minutes to 2 hours
- **Maximum:** Up to 48 hours (rare)

Since it's been 20 minutes, it's likely still propagating. Try clearing your DNS cache first!

