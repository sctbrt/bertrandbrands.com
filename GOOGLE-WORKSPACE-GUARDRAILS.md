# Google Workspace Recovery Guardrails

**Domain:** bertrandbrands.com
**Case #:** 67429105 (previously 67429105)
**Recovery Email:** bertrandbrands@outlook.com
**Created:** 2026-01-31
**Updated:** 2026-02-01

---

## Current Status

- [x] Old Workspace org deleted (domain stuck in "contested" state)
- [x] DNS cleaned up (removed old verification CNAME 67438343)
- [x] DNS cleaned up (removed old TXT google-gws-recovery-domain-verification=67438343)
- [x] New verification CNAME added (67429105 → google.com)
- [x] DNS propagation confirmed
- [x] Reply sent to Google Support confirming DNS updated
- [ ] Google verification complete
- [ ] Access to hello@bertrandbrands.com restored

---

## DNS Baseline (DO NOT MODIFY)

### Critical Records for Google Workspace

| Type | Name | Content | Proxy | Notes |
|------|------|---------|-------|-------|
| **CNAME** | **67429105** | **google.com** | DNS only | **VERIFICATION - DO NOT DELETE** |
| MX | @ | aspmx.l.google.com | DNS only | Priority 1 |
| MX | @ | alt1.aspmx.l.google.com | DNS only | Priority 5 |
| MX | @ | alt2.aspmx.l.google.com | DNS only | Priority 5 |
| MX | @ | alt3.aspmx.l.google.com | DNS only | Priority 10 |
| MX | @ | alt4.aspmx.l.google.com | DNS only | Priority 10 |
| ~~TXT~~ | ~~@~~ | ~~google-gws-recovery-...~~ | ~~DNS only~~ | **DELETED** - was conflicting |
| TXT | @ | v=spf1 include:_spf.google.com ~all | DNS only | SPF for Google |
| TXT | @ | google-site-verification=... | DNS only | Site verification |
| TXT | google._domainkey | v=DKIM1; k=rsa; p=... | DNS only | DKIM for Google |

### Other Records (Safe)

| Type | Name | Content | Notes |
|------|------|---------|-------|
| A | @ | 76.76.21.123 | Vercel website |
| CNAME | www | cname.vercel-dns.com | Vercel website |
| CNAME | clients | 161b420c666ed031.v... | Client portal |
| CNAME | dashboard | 387cd488fb653998.v... | Admin dashboard |
| CNAME | test | cname.vercel-dns.com | Test subdomain |
| MX | send | feedback-smtp.us... | Resend transactional |
| TXT | resend._domainkey | p=MIGfMA0GCS... | DKIM for Resend |
| TXT | send | v=spf1 include:amazonses.com ~all | SPF for Resend |
| TXT | _vercel | vc-domain-verify=... | Vercel verification |

---

## Red Flags - STOP IMMEDIATELY IF YOU SEE

1. **MX records pointing anywhere other than Google**
   - PrivateEmail.com / Namecheap
   - Microsoft 365 / Outlook
   - Any other mail server

2. **New verification CNAMEs you didn't add**
   - Any numeric CNAME other than 67429105
   - Any CNAME claiming to be for "domain verification"

3. **Domain "reclaimed" message**
   - If Google Admin shows domain is claimed by another org
   - If you can't access admin.google.com for the domain

4. **Verification record deleted**
   - CNAME 67429105 missing from Cloudflare
   - Any of the MX records removed

---

## Verification Checklist (Run Every 15-30 min)

### Quick Check via Google Dig Tool
URL: https://toolbox.googleapps.com/apps/dig/#CNAME/67429105.bertrandbrands.com

**Expected Result:**
```
CNAME
TTL: 5 minutes
TARGET: google.com.
```

### Recovery Page Check
URL: https://toolbox.googleapps.com/apps/recovery/ownership?email=bertrandbrands%40outlook.com&domain=bertrandbrands.com&case=67429105&flow=contested

1. Click "CHECK AGAIN"
2. If still on Step 3 → Wait and try again later
3. If moved to Step 4 → Verification successful!

---

## If Domain Gets "Reclaimed" Again

### Immediate Actions

1. **Screenshot everything** - Admin console, DNS records, error messages

2. **Check Cloudflare DNS immediately**
   - Verify MX records still point to Google
   - Verify CNAME 67429105 still exists
   - Look for any NEW records you didn't add

3. **Check for competing verification**
   - Look for new CNAME records with numbers
   - Look for new TXT records with verification codes

4. **Contact Google Support**
   - Google Workspace Support: https://support.google.com/a/contact
   - Reference Case #67429105
   - Explain this is 5th attempt at recovery

### Root Cause Possibilities

1. **Old org not fully released** - Need Google to manually release
2. **Cached verification** - Old verification record being honored
3. **Competing claim** - Another account trying to verify simultaneously

---

## Important Links

- **Recovery Page:** https://toolbox.googleapps.com/apps/recovery/ownership?email=bertrandbrands%40outlook.com&domain=bertrandbrands.com&case=67429105&flow=contested
- **DNS Dig Tool:** https://toolbox.googleapps.com/apps/dig/#CNAME/67429105.bertrandbrands.com
- **Cloudflare DNS:** https://dash.cloudflare.com/a2b3daf9f6d887fc131d0658e4f9f486/bertrandbrands.com/dns/records
- **Google Admin:** https://admin.google.com
- **Google Support:** https://support.google.com/a/contact

---

## Timeline

| Time | Action | Result |
|------|--------|--------|
| 2026-01-31 | Started recovery process | Case #67465151 created |
| 2026-01-31 | Added CNAME 67465151 | DNS propagated |
| 2026-01-31 | Deleted old CNAME 67438343 | Cleaned up |
| 2026-01-31 | Verified DNS via Google Dig | Confirmed working |
| 2026-02-01 | New case opened by Google | Case #67429105 |
| 2026-02-01 | Updated CNAME to 67429105 | DNS propagated |
| 2026-02-01 | Deleted conflicting TXT record | 67438343 removed |
| 2026-02-01 | Replied to Google confirming DNS | Email sent |
| | Verification complete | Pending... |
| | Access restored | Pending... |

---

## Notes

- Google says verification can take "minutes to 24 hours"
- The 3-day deadline is when they auto-close the case if DNS isn't found
- Keep the CNAME record until AFTER verification succeeds
- Do NOT delete the CNAME even after email works - wait for explicit confirmation
