# SocietyVault API

Single-society REST API built with Express, MongoDB/Mongoose, Firebase Admin verification for Google sign-in, and HTTP-only JWT session cookies.

## Local setup

1. Use Node.js 20 or newer.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters.
3. Configure `CLIENT_ORIGINS` as a comma-separated list of exact frontend origins (no paths), plus Firebase Admin credentials.
4. Run `npm install`, then `npm run seed:admin` once with `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` set in `.env`.
5. Start with `npm run dev`. The health endpoint is `GET /api/v1/health`.
6. In `client`, set `VITE_API_BASE_URL=http://localhost:5000/api/v1`.
7. Open the client at `http://localhost:5173`. Keep the frontend and API on the same hostname (`localhost`, not `127.0.0.1`) so session cookies work consistently.

The admin seed command refuses to overwrite an existing administrator. Admin accounts cannot be created through public registration.
Use `npm run reset:admin-password` after changing `ADMIN_PASSWORD` in the local `.env` to rotate an existing admin password.

## Deployment configuration

- Deploy `client` as the Vercel project root so `client/vercel.json` can serve the React SPA routes. Use `npm run build` and `dist` if configuring the build manually.
- On Render, set `NODE_ENV=production`, `CLIENT_ORIGINS` to the exact Vercel production origin (and any preview origins you explicitly need), and `FIREBASE_PROJECT_ID`. Configure the Firebase service-account JSON as a Render Secret File and set `GOOGLE_APPLICATION_CREDENTIALS` to its path.
- On Vercel, set `VITE_API_BASE_URL` to `https://<render-service>.onrender.com/api/v1` and all `VITE_FIREBASE_*` values. Add the Vercel domain to Firebase Authentication's authorized domains.
- Production session cookies use `SameSite=None; Secure` for the cross-origin Vercel-to-Render API requests. Use HTTPS on both deployments and Axios `withCredentials`; browser privacy settings can still restrict third-party cookies on unrelated domains. For the most reliable production sessions, use frontend and API custom domains under the same site, such as `app.example.com` and `api.example.com`.
- Never set `CLIENT_ORIGINS` to `*`; credentialed CORS requires explicit origins. Add each origin as `https://domain` only, with no route or trailing path.
- Keep staging and production databases separate. Restrict MongoDB Network Access to the deployment's static outbound IPs where available; avoid leaving `0.0.0.0/0` enabled in production.

## API groups

All endpoints are prefixed with `/api/v1`. Authenticated requests use the HTTP-only `societyvault_session` cookie; browser Axios requests must send credentials.

| Group | Routes |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `POST /auth/logout`, `GET /auth/me`, `PUT /auth/profile` |
| Dashboard | `GET /dashboard/admin`, `GET /dashboard/resident-finances`, `GET /dashboard/reports/financial`, `GET /dashboard/reports/resident` |
| Income | `GET/POST /income`, `PUT/DELETE /income/:id` |
| Expenses | `GET/POST /expenses`, `PUT/DELETE /expenses/:id` |
| Residents | `GET/POST /residents`, `PUT/DELETE /residents/:id`, `GET /residents/me/dashboard`, `GET /residents/me/dues`, `GET /residents/:id/dues`, `POST /residents/dues` |
| Payments | `GET /payments/mine`, `GET /payments/receipts`, `GET /payments/report`, `POST /payments/initiate`, admin `GET/POST /payments`, `GET /payments/:id`, `PATCH /payments/:id/status` |
| Settings | `GET/PUT /settings`, `POST /settings/categories`, `PUT/DELETE /settings/categories/:id` |
| Audit | `GET /audit-logs` |
| Maintenance schedule | `GET /maintenance/upcoming`, admin `POST /maintenance`, `PUT/DELETE /maintenance/:id` |

List endpoints accept `page`, `limit`, and supported search/date/status filters. Responses use `{ data, meta? }`; failures use `{ error: { message, details? } }`.

## Data/security notes

- Passwords are bcrypt-hashed. Admin creation is a private seed operation.
- Firebase Google ID tokens are verified by Firebase Admin; the API does not trust a client-supplied email.
- Password reset email delivery and online payment-provider callbacks are intentionally not implemented until a mail provider and payment gateway are selected.
- `POST /payments/initiate` records a pending payment request. A pending request is not proof of money received; only an admin-recorded/verified payment can complete dues at this stage.
- The frontend PDF/Excel files remain client-generated from API data; no export file is stored by this API.
