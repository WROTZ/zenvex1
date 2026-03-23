# Zenvex Capital

Premium dark MVP for a funded trading platform built with React + Vite, Firebase Authentication, Firestore, Tailwind CSS, and Razorpay via Firebase Functions.

## What is included

- Branded landing page, challenges page, checkout flow, success page, and trader dashboard
- Firebase email/password authentication with session persistence
- Firestore collections for `users`, `orders`, and `dashboard`
- Secure Razorpay flow using Firebase Functions for order creation and payment verification
- Protected routes, loading states, empty states, and responsive dark UI
- Local demo mode when Firebase env values are not added yet, so the client can still review the full UI flow

## GitHub + Vercel demo handoff

1. Upload this project to a GitHub repository.
2. Import the repository into Vercel.
3. Deploy as-is for a client demo.

What happens without env keys:

- Public pages render normally
- The auth page enters local demo mode
- Checkout simulates a successful purchase
- Dashboard shows locally stored sample trader data

What happens after env keys and Firebase secrets are added:

- Email/password auth becomes live
- Razorpay uses the real checkout flow
- Orders and dashboard records are stored in Firestore

The included [vercel.json](./vercel.json) keeps React Router routes working on direct page refreshes.

## Local setup

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Install Firebase Functions dependencies:

   ```bash
   npm run functions:install
   ```

3. Create a `.env` file in the project root using `.env.example`.

4. Create a Firebase project, then enable:

- Authentication -> Email/Password
- Firestore Database
- Cloud Functions

5. Select your Firebase project from the CLI:

   ```bash
   firebase login
   firebase use --add
   ```

6. Add Razorpay secrets for Cloud Functions:

   ```bash
   firebase functions:secrets:set RAZORPAY_KEY_ID
   firebase functions:secrets:set RAZORPAY_KEY_SECRET
   ```

7. Run the frontend:

   ```bash
   npm run dev
   ```

8. Deploy when ready:

   ```bash
   npm run build
   firebase deploy
   ```

## Notes

- Dashboard values are seeded automatically after successful payment and can be updated manually in Firebase Console.
- The in-app logo asset was recreated from the uploaded mark so the project is self-contained. If you later want to swap in the original file, replace `src/assets/zenvex-logo.svg`.
- For demo-only deployments, you do not need to set env variables. The app will switch to local presentation mode automatically.
