# Statera marketing site

Standalone marketing site for **Statera**. It does not include login, worker, or supervisor product routes.

## Local

```bash
cd website
cp .env.example .env.local
# paste your Formspree form id
npm install
npm run dev
```

Runs on [http://localhost:3001](http://localhost:3001).

## Formspree (notify form)

1. Create a form at [formspree.io](https://formspree.io).
2. Copy the form id (the segment after `/f/` in the endpoint).
3. Set `NEXT_PUBLIC_FORMSPREE_FORM_ID` in `website/.env.local` and later in Vercel.

The form posts from the browser to `https://formspree.io/f/{id}`. There is no Statera waitlist database.

Until the id is set, the page still renders; submit shows a short “not connected yet” note.

## Vercel (later)

Create a **separate** Vercel project from this GitHub repo (do not replace the product app deploy).

- Production branch: `marketing`
- **Root Directory:** `website`
- Environment variable: `NEXT_PUBLIC_FORMSPREE_FORM_ID`

No Supabase or Anthropic keys are required.

After you buy a domain, attach it on that Vercel project. Canonical / `metadataBase` can be set then. Until then the public name on the page is **Statera**; the first URL will be `*.vercel.app`.
