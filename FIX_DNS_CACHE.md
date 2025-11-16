# Fix DNS Cache Issue on Your Mac

Your domain works on mobile but not on your computer's WiFi. This is a DNS cache problem.

## Solution 1: Clear Mac DNS Cache (Recommended)

Open Terminal and run:

```bash
sudo killall -HUP mDNSResponder
```

Enter your Mac password when prompted (you won't see characters as you type - that's normal).

Then try accessing `nello.my` again.

## Solution 2: Flush DNS Cache (Alternative)

If Solution 1 doesn't work, try:

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

## Solution 3: Restart Your WiFi

1. Turn WiFi off (click WiFi icon in menu bar → Turn WiFi Off)
2. Wait 10 seconds
3. Turn WiFi back on
4. Try accessing `nello.my` again

## Solution 4: Use Google DNS Temporarily

If the above doesn't work, change your DNS server:

1. **System Settings** → **Network**
2. Select your WiFi connection
3. Click **Details...**
4. Go to **DNS** tab
5. Click the **+** button
6. Add: `8.8.8.8`
7. Add: `8.8.4.4`
8. Click **OK**
9. Try accessing `nello.my`

(You can remove these later and go back to automatic DNS)

## Solution 5: Restart Your Router

If nothing else works, restart your WiFi router:
1. Unplug router for 30 seconds
2. Plug it back in
3. Wait 2-3 minutes for it to fully restart
4. Try accessing `nello.my`

---

**Most likely Solution 1 will fix it!** The domain is working correctly - your Mac just needs to refresh its DNS cache.


