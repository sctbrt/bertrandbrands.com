# bertrandbrands.com

Bertrand Brands — Brand & Web Systems studio site.

## Structure

```
bertrandbrands.com/
├── src/
│   ├── index.html        # Main page
│   ├── styles/
│   │   ├── tokens.css    # Design tokens (shared DNA with ecosystem)
│   │   └── main.css      # Site styles
│   ├── scripts/
│   │   └── main.js       # Site scripts
│   └── assets/           # Images, fonts, etc.
├── public/               # Static assets (copied to root on deploy)
└── dist/                 # Build output (if needed)
```

## Development

```bash
# Start local server
npm run dev
# Opens at http://localhost:8005
```

## Deployment

Configured for Vercel. Push to main branch to deploy.

## DNS Setup (Namecheap → Vercel)

```
Type: A
Host: @
Value: 76.76.21.21

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

## Related Sites

- [scottbertrand.com](https://scottbertrand.com) — Personal hub
- [notes.scottbertrand.com](https://notes.scottbertrand.com) — Field Notes
- [goods.scottbertrand.com](https://goods.scottbertrand.com) — Still Goods
