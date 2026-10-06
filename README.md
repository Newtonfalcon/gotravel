This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Assistant setup

This project includes a simple AI assistant that proxies to Google Gemini and stores chats in Firebase.

Required environment variables:

- `GEMINI_API_KEY` — Server-side API key for Google Gemini / Generative Language API.
- `FIREBASE_PROJECT_ID` — Firebase project ID for `firebase-admin` initialization.
- `FIREBASE_CLIENT_EMAIL` — Service account client email.
- `FIREBASE_PRIVATE_KEY` — Service account private key (use `\\n` escapes or real newlines).
- `MONGODB_URI` — MongoDB connection string (already required by the app).
- Clerk environment variables — configure Clerk per their Next.js docs (frontend & server keys).

Quick start:

1. Add the environment variables to your hosting provider or `.env.local` (do not commit secrets).
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Run dev server:

```bash
npm run dev
```

4. Use the chat widget on any page by importing the component:

```jsx
import ChatWidget from '@/components/ai/ChatWidget';

export default function Page() {
	return <ChatWidget />;
}
```

Notes:
- Chats are stored in Firestore under `ai_chats` with an `expiryAt` date two weeks from creation. Configure a backend TTL policy in Firebase to delete expired docs automatically.
- Keep `GEMINI_API_KEY` server-side only.
