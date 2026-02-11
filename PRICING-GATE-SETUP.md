# Magic-Link Pricing Gate — Setup Guide

This document explains how to set up and deploy the magic-link pricing gate system.

## Overview

The system soft-gates pricing for 7 advanced service cards. Users enter their email → receive a magic link via Resend → clicking the link creates a 60-minute pricing session → pricing becomes visible.

**Entry-level services** (Founders Direction Check & Brand & Website Starter Map) remain publicly priced.

---

## 1. Vercel Postgres Setup

### Create Database

1. Go to Vercel Dashboard → Storage → Create → Postgres
2. Name it (e.g., `bertrandbrands-db`)
3. Select a region close to your deployment
4. Once created, go to the `.env.local` tab
5. Copy the `POSTGRES_URL` value

### Add to Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
POSTGRES_URL = <your postgres connection string>
```

The database tables are created automatically on first API request.

---

## 2. Resend Setup

### Create API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys → Create API Key
3. Copy the key (starts with `re_`)

### Verify Domain (Important)

1. Go to Domains → Add Domain
2. Add `bertrandgroup.ca`
3. Add the DNS records Resend provides
4. Wait for verification (usually < 1 hour)

### Add to Environment Variables

```
RESEND_API_KEY = re_xxxxxxxxxx
RESEND_FROM_EMAIL = Bertrand Group | Brands & Web Systems <hello@bertrandgroup.ca>
```

---

## 3. Required Environment Variables

Add these to Vercel Dashboard → Settings → Environment Variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `POSTGRES_URL` | Yes | — | Vercel Postgres connection string |
| `RESEND_API_KEY` | Yes | — | Resend API key |
| `RESEND_FROM_EMAIL` | Yes | — | Verified sender email |
| `APP_URL` | Yes | — | Production URL (no trailing slash) |
| `PRICING_MAGIC_LINK_TTL_MINUTES` | No | `15` | Magic link expiration |
| `PRICING_SESSION_TTL_MINUTES` | No | `60` | Session duration |

---

## 4. Deploy

```bash
# Install dependencies
npm install

# Deploy to Vercel
vercel --prod
```

---

## 5. Testing Checklist

- [ ] Entry-level services (Start Here cards) show pricing without login
- [ ] Advanced services (01-07) show "Email me the pricing" button when not logged in
- [ ] Clicking "Email me the pricing" opens the modal
- [ ] Submitting email sends a magic link via Resend
- [ ] Magic link expires after 15 minutes
- [ ] Magic link cannot be used twice (replay protection)
- [ ] After clicking link, pricing is visible for 60 minutes
- [ ] Pricing banner shows remaining time
- [ ] After 60 minutes, pricing hides again
- [ ] Cookie is HttpOnly + Secure in production

---

## Architecture

### Files Created

```
api/
├── lib/
│   └── db.js                    # Database utilities
├── pricing/
│   ├── request-access.js        # POST - sends magic link email
│   ├── access.js                # GET - verifies token, creates session
│   ├── check-access.js          # GET - validates session for frontend
│   └── logout.js                # POST - clears session
scripts/
└── init-db.js                   # Database initialization script
```

### Database Tables

**pricing_magic_links**
- `id` (UUID, PK)
- `email` (text)
- `token_hash` (text, unique)
- `expires_at` (timestamptz)
- `used_at` (timestamptz, null)
- `created_at` (timestamptz)

**pricing_sessions**
- `id` (UUID, PK)
- `email` (text)
- `expires_at` (timestamptz)
- `created_at` (timestamptz)

### Security Features

1. **One-time tokens**: Tokens are hashed with SHA-256 and marked as used atomically
2. **HttpOnly cookies**: Session cookie cannot be accessed by JavaScript
3. **Secure cookies**: HTTPS-only in production
4. **SameSite=Lax**: CSRF protection
5. **Rate limiting**: 3 requests per email per hour
6. **No enumeration**: Always returns success on request-access

---

## Troubleshooting

### "Email not received"

1. Check Resend dashboard for delivery status
2. Verify domain is confirmed in Resend
3. Check spam folder
4. Ensure `RESEND_FROM_EMAIL` uses verified domain

### "Link expired or already used"

- Links expire after 15 minutes
- Each link works only once
- User needs to request a new link

### "Database connection error"

1. Verify `POSTGRES_URL` is set correctly
2. Check Vercel Postgres dashboard for connection issues
3. Ensure you're not exceeding connection limits

### "Pricing not showing after clicking link"

1. Check browser cookies are enabled
2. Verify session was created in database
3. Check browser dev tools for API errors
