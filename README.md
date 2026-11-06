# SocietyVault

SocietyVault is a web application for managing the day-to-day finances and resident records of a housing society. It gives administrators a place to track maintenance dues, payments, income, and expenses, while residents can view their own account and society information.

[**Live Demo →**](https://society-vault.vercel.app/)

This project was built as a full-stack student project to demonstrate authentication, role-based access, CRUD operations, database-backed dashboards, and financial reporting.

## What the app does

- **Admin dashboard:** View key figures such as income, expenses, available funds, and outstanding dues.
- **Resident management:** View resident profiles and update their society details.
- **Maintenance dues:** Create dues for residents and track paid and outstanding amounts.
- **Payment records:** Residents can submit a payment request. An administrator can review it, or record a payment made outside the app.
- **Income and expenses:** Record and manage society income and expenses.
- **Reports:** Review monthly financial activity and resident payment information; export reports from the browser.
- **Resident portal:** Residents can view their dashboard, dues, payment history, receipts, profile, and shared society finances.
- **Other admin tools:** Manage society settings, maintenance schedules, and audit history.
- **Responsive interface:** Use the app on desktop, tablet, or mobile screens.

## User flows

### Resident

1. Sign up with an email and password, or continue with Google.
2. Complete the resident profile on the next step.
3. Sign in to view dues, submit a payment request, download available receipts, and check society finances.

### Administrator

1. An administrator account is created privately during development or deployment; there is no public admin signup.
2. Sign in to manage resident records, dues, payment reviews, income, expenses, reports, and settings.
3. For payments made outside the app, record the payment in the admin area so the due and financial records stay in sync.

> **Payment integration note:** SocietyVault does not connect to a bank or payment gateway. A resident payment request is not proof that money was received; an administrator must review or record the payment.

## Built with

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS, HeroUI |
| Charts and exports | Recharts, jsPDF, ExcelJS |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt, Firebase Admin token verification for Google sign-in |

## Project structure

```text
society-vault/
├── client/                 # React application
│   └── src/
│       ├── features/
│       │   ├── admin/      # Admin dashboard, residents, finances, reports, settings
│       │   ├── auth/       # Login, signup, and profile setup
│       │   └── resident/   # Resident dashboard, dues, payments, and reports
│       ├── routes/         # Role-protected application routes
│       └── services/       # Frontend API clients
├── server/                 # Express REST API
│   └── src/
│       ├── config/         # Environment and database configuration
│       ├── controllers/    # HTTP request handlers
│       ├── middleware/     # Authentication and request handling
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Versioned API routes
│       ├── scripts/        # Admin and sample-data setup scripts
│       └── services/       # Application and database logic
└── README.md
```

## Run locally

### Requirements

- Node.js 20 or newer and npm
- A MongoDB database (local MongoDB or MongoDB Atlas)
- Firebase project credentials if you want to use Google sign-in

### 1. Get the code and install dependencies

```bash
git clone https://github.com/bemohitt1717/society-vault.git
cd society-vault
npm install --prefix server
npm install --prefix client
```

### 2. Configure the API

Copy `server/.env.example` to `server/.env`, then set the required values:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
MONGODB_URI=mongodb://127.0.0.1:27017/societyvault
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
JWT_EXPIRES_IN=7d

# Needed for Google sign-in
FIREBASE_PROJECT_ID=your-firebase-project-id
GOOGLE_APPLICATION_CREDENTIALS=absolute-path-to-service-account.json

# Used only when creating the first admin
ADMIN_NAME=Your Admin Name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-strong-password
```

Use your own MongoDB connection string if you use Atlas. Keep service-account files and real credentials outside version control; never put production secrets in this README or commit them.

Create the first administrator once:

```bash
cd server
npm run seed:admin
```

Start the API in the same `server` directory:

```bash
npm run dev
```

The API starts at `http://localhost:5000`. Check `http://localhost:5000/api/v1/health` to confirm it is running.

### 3. Configure and start the frontend

Copy `client/.env.example` to `client/.env` and set your Firebase web app values if using Google sign-in:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your-firebase-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

In a second terminal:

```bash
cd client
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`).

### Optional: load sample data

To populate a **disposable development database** with five sample residents, maintenance dues, payment history, income, expenses, and settings:

```bash
cd server
npm run seed:sample-data -- --confirm
```

This command is disabled in production and does not remove unrelated records. The sample passwords are intentionally simple and are for local testing only. See [`server/README.md`](./server/README.md) for the sample-account list and additional API/deployment notes. **Never use the sample accounts or passwords in production.**

## Useful commands

Run these from their respective folders:

| Folder | Command | Purpose |
|---|---|---|
| `client` | `npm run dev` | Start the frontend development server |
| `client` | `npm run lint` | Run ESLint |
| `client` | `npm run build` | Create the production frontend build |
| `client` | `npm run preview` | Preview the production build locally |
| `server` | `npm run dev` | Start the API with automatic reload |
| `server` | `npm start` | Start the API |
| `server` | `npm run seed:admin` | Create the initial admin account |
| `server` | `npm run reset:admin-password` | Reset an existing admin password |
| `server` | `npm run seed:sample-data -- --confirm` | Add or refresh local demo data |

## Security and project scope

- Passwords are stored as bcrypt hashes; protected API routes use JWT authentication and role checks.
- Google sign-in tokens are verified by Firebase Admin on the server.
- Keep separate databases and credentials for development and production.
- The app currently does **not** send password-reset emails or process real payments through a payment provider.
- PDF and spreadsheet exports are generated in the browser; exported files are not stored by the API.

For detailed API routes and deployment configuration, see [`server/README.md`](./server/README.md).
