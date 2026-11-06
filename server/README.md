# SocietyVault API

Single-society REST API built with Express, MongoDB/Mongoose, and Firebase Admin verification for Google sign-in. API sessions use JWT bearer tokens.

## Local setup

1. Use Node.js 20 or newer.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters.
3. Configure `CLIENT_ORIGINS` as a comma-separated list of exact frontend origins (no paths), plus Firebase Admin credentials.
4. Run `npm install`, then `npm run seed:admin` once with `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` set in `.env`.
5. Start with `npm run dev`. The health endpoint is `GET /api/v1/health`.
6. In `client`, set `VITE_API_BASE_URL=http://localhost:5000/api/v1`.
7. Open the client at `http://localhost:5173`.

The admin seed command refuses to overwrite an existing administrator. Admin accounts cannot be created through public registration.
Use `npm run reset:admin-password` after changing `ADMIN_PASSWORD` in the local `.env` to rotate an existing admin password.
For local UI testing, first create an admin and start the API, then run `npm run seed:sample-data -- --confirm` from `server`. In production, the same idempotent seed can be used for a public project demo only: point the API at a separate MongoDB database named `societyvault_demo`, ensure an admin exists in that database, then run `npm run seed:sample-data -- --confirm --allow-production-demo` from the API shell. The production command refuses to write to any database whose name is not exactly `societyvault_demo`. It adds/refreshes five resident test accounts, five months of paid receipts per resident, current outstanding dues, six months of income/expenses, categories, demo financial settings, and one maintenance schedule; it does not remove unrelated records. Sample income is sized so each month's income covers its expenses. The test accounts use these credentials:

| Name | Email | Password |
|---|---|---|
| Geetansh | `geetansh@gmail.com` | `geetansh123` |
| Sahil | `sahil@gmail.com` | `sahil123` |
| Shivam | `shivam@gmail.com` | `shivam123` |
| Ishuu | `ishuu@gmail.com` | `ishuu123` |
| Dhansikha | `dhansikha@gmail.com` | `dhansikha123` |

These are public, weak demo credentials. Use them only in the isolated `societyvault_demo` database, never in a real society's database or for accounts containing real information. Public users may change demo data.

## Deployment configuration

- Deploy `client` as the Vercel project root so `client/vercel.json` can serve the React SPA routes. Use `npm run build` and `dist` if configuring the build manually.
- On Render, set `NODE_ENV=production`, `CLIENT_ORIGINS` to the exact Vercel production origin (and any preview origins you explicitly need), and `FIREBASE_PROJECT_ID`. It must match the client's `VITE_FIREBASE_PROJECT_ID`. Configure a Firebase service-account JSON for that same project as a Render Secret File and set `GOOGLE_APPLICATION_CREDENTIALS` to its path.
- On Vercel, set `VITE_API_BASE_URL` to `/api/v1` and all `VITE_FIREBASE_*` values. The Vercel rewrite proxies `/api/v1/*` to the Render service. Update the Render URL in `client/vercel.json` if the service hostname changes. Add the Vercel domain to Firebase Authentication's authorized domains.
- If Google sign-in returns 401 after the Google popup completes, check the `/auth/google` response body and Render logs. The authorized-domain setting allows the browser popup; it does not configure the API to verify Firebase ID tokens. Confirm the Vercel client project ID, Render `FIREBASE_PROJECT_ID`, and service-account `project_id` all match.
- Never set `CLIENT_ORIGINS` to `*`; credentialed CORS requires explicit origins. Add each origin as `https://domain` only, with no route or trailing path.
- Keep staging and production databases separate. Restrict MongoDB Network Access to the deployment's static outbound IPs where available; avoid leaving `0.0.0.0/0` enabled in production.
- For the public project demo, configure the deployed API to use the dedicated `societyvault_demo` database. Do not point the sample-data seed at a real society's production database.

## API groups

All endpoints are prefixed with `/api/v1`. Registration and login endpoints return a JWT and user. The client stores the token in localStorage and sends it as `Authorization: Bearer <token>` on authenticated requests; logout clears it in the browser.

| Group | Routes |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `GET /auth/me`, `PUT /auth/profile` |
| Dashboard | `GET /dashboard/admin`, `GET /dashboard/resident-finances`, `GET /dashboard/reports/financial`, `GET /dashboard/reports/resident` |
| Income | `GET/POST /income`, `PUT/DELETE /income/:id` |
| Expenses | `GET/POST /expenses`, `PUT/DELETE /expenses/:id` |
| Residents | `GET/POST /residents`, `PUT/DELETE /residents/:id`, admin `GET /residents/dues`, `GET /residents/me/dashboard`, `GET /residents/me/dues`, `GET /residents/:id/dues`, `POST /residents/dues` |
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
