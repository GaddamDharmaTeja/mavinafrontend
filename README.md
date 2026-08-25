# Mavinamane

Mavinamane is a mobile-first mango marketplace built with Next.js, TypeScript, Express, and MongoDB.

## Local setup

Copy `.env.example` to `.env.local`, add your MongoDB and admin credentials, then run `npm install` and `npm run dev`. The health endpoint is available at `/api/healthz`.

## Deploy to Render

This repository includes `render.yaml`. Render runs `npm ci && npm run build`, starts `npm run start`, and supplies its `PORT` automatically. Configure `MONGODB_URI`, `SESSION_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`; Razorpay settings are optional until online checkout is enabled.

## Netlify + Render connection

In Netlify project settings, add these variables and trigger a new deploy:

```text
NEXT_PUBLIC_API_BASE_URL=https://mavinabackend-1.onrender.com/api
NEXT_PUBLIC_API_ORIGIN=https://mavinabackend-1.onrender.com
```

The backend Render service must have `MONGODB_URI` set to the MongoDB Atlas connection string and `CORS_ORIGIN` set to your Netlify URL, for example `https://mavinafrontend.netlify.app,https://*.netlify.app`.
