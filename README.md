# CodeForge

CodeForge is a MERN-stack coding practice platform. Users can browse data-structure and algorithm problems, write and run code in the browser, submit solutions against hidden test cases, and review their submission history. The platform also includes an AI problem assistant, video editorials, and an administrator interface for managing problems and editorial videos.

## Features

- **Problem library:** Browse problems by difficulty and topic, and filter the list to show solved problems.
- **In-browser editor:** Edit JavaScript, Java, and C++ solutions in Monaco Editor.
- **Code execution:** Run code against a problem's visible examples and submit code against its hidden test cases using Judge0.
- **Progress tracking:** See solved problems and inspect historical submissions, including submitted source, status, test-case counts, runtime, and memory.
- **AI problem assistant:** Ask a Gemini-powered assistant for DSA-related help in the context of the current problem.
- **Video editorials:** Play problem walkthrough videos hosted on Cloudinary.
- **Authentication and roles:** Register and log in with email and password. Passwords are hashed with bcrypt; authenticated requests use a JWT cookie. User and admin routes have role checks.
- **Admin tools:** Create and delete problems, and upload or delete problem editorial videos.
- **Submission throttling:** Submission requests have a per-user 10-second cooldown backed by Redis.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Redux Toolkit, Axios, Monaco Editor, React Hook Form, Zod, Tailwind CSS, DaisyUI |
| Backend | Node.js, Express 5, Mongoose |
| Data and cache | MongoDB, Redis |
| Code execution | Judge0 CE via RapidAPI |
| AI assistance | Google Gemini (`gemini-2.5-flash`) |
| Video storage | Cloudinary |
| Authentication | JSON Web Tokens, bcrypt |

## Repository layout

```text
.
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB and Redis connections
│   │   ├── controllers/  # Authentication, problem, submission, AI, and video handlers
│   │   ├── middleware/   # Authentication, admin authorization, and submission limiter
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express route definitions
│   │   └── utils/        # Validation and Judge0 helpers
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # Admin, chat, editorial, and submission-history components
    │   ├── pages/        # Login, signup, home, problem, and admin pages
    │   ├── store/        # Redux store
    │   └── utils/        # Axios API client
    ├── package.json
    └── vite.config.js
```

## Requirements

- Node.js and npm (use a currently supported Node.js LTS release).
- A MongoDB database and its connection string.
- A reachable Redis instance.
- Credentials/configuration for Gemini, Cloudinary, and Judge0/RapidAPI if those features are to be used.

The backend and frontend have separate package manifests and are installed and run independently.

## Local development

### 1. Configure the backend

Create `backend/.env`:

```dotenv
PORT=3000
DB_CONNECT_STRING=mongodb://127.0.0.1:27017/codeforge
JWT_KEY=replace-with-a-long-random-secret
GEMINI_KEY=your-google-ai-studio-api-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

Install dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The server connects to MongoDB and Redis before it starts listening on `PORT`. The checked-in Redis client currently contains a fixed remote Redis configuration, rather than reading its connection settings from environment variables. Configure a trusted Redis instance and update that client configuration before relying on the backend; do not commit Redis credentials.

### 2. Configure the frontend

The frontend API client uses `VITE_API_URL` when set and otherwise defaults to `http://localhost:3000`. For local development, create `frontend/.env.local`:

```dotenv
VITE_API_URL=http://localhost:3000
```

Then install dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The backend currently allows credentialed CORS requests only from that local origin. If the frontend runs on another origin, update the backend CORS configuration to match it.

### 3. Set up an administrator

Public registration (`POST /user/register`) creates a regular user. The admin registration route is protected by admin authentication, so it is not an open bootstrap endpoint. Provision the first administrator through a controlled database/admin setup process, then use the admin account to access the admin pages. Do not expose a privileged account-creation route publicly.

## Using the platform

1. Create an account or log in.
2. Browse the problem list and optionally filter by difficulty, topic, or solved status.
3. Open a problem, choose JavaScript, Java, or C++, and edit the starter code.
4. Choose **Run** to check the visible examples, or **Submit** to evaluate against hidden test cases.
5. Review results and previous attempts in the problem's **Submissions** tab.
6. Use the **ChatAI** tab for problem-specific DSA assistance and **Editorial** to watch an available video.
7. Administrators can use the admin panel to create/delete problems and manage editorial videos.

Problem difficulty values are `easy`, `medium`, and `hard`. Problem topics supported by the data model include `array`, `linkedList`, `graph`, `dp`, `math`, and `string`; the current problem creation form exposes only a subset of these.

### Current implementation notes

- The C++ submission handler normalizes the frontend's `cpp` language value, but the visible-test run handler does not. C++ run requests may therefore fail until that handler applies the same language mapping.
- The admin dashboard currently links to problem creation, deletion, and video management. Although an update API handler exists, the frontend does not currently define an update page/route.

## API overview

All routes are mounted on the backend server. The default local API base URL is `http://localhost:3000`. Except for registration and login, the routes below require the JWT cookie unless noted otherwise.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/user/register` | Public | Create a regular account |
| `POST` | `/user/login` | Public | Authenticate and set the JWT cookie |
| `POST` | `/user/logout` | User | Block the current token in Redis and clear the cookie |
| `GET` | `/user/check` | User | Return the authenticated user's profile |
| `DELETE` | `/user/profile` | User | Delete the authenticated user's profile |
| `POST` | `/user/admin/register` | Admin | Create an account using the admin registration flow |
| `GET` | `/problem/getAllProblem` | User | List problems |
| `GET` | `/problem/problemById/:id` | User | Get a problem and, when available, its video metadata |
| `GET` | `/problem/problemSolvedByUser` | User | List problems solved by the current user |
| `GET` | `/problem/submittedProblem/:id` | User | Get the current user's submissions for a problem |
| `POST` | `/problem/create` | Admin | Create a problem after validating reference solutions |
| `PUT` | `/problem/update/:id` | Admin | Update a problem |
| `DELETE` | `/problem/delete/:id` | Admin | Delete a problem |
| `POST` | `/submission/run/:id` | User | Execute code against visible test cases |
| `POST` | `/submission/submit/:id` | User | Submit code against hidden test cases (10-second cooldown) |
| `POST` | `/ai/chat` | User | Ask the AI assistant about a problem |
| `GET` | `/video/create/:problemId` | Admin | Generate signed Cloudinary upload parameters |
| `POST` | `/video/save` | Admin | Verify and save uploaded video metadata |
| `DELETE` | `/video/delete/:problemId` | Admin | Remove a problem's video |

## Frontend routes

| Path | Page |
| --- | --- |
| `/` | Authenticated problem list |
| `/login` | Login |
| `/signup` | Registration |
| `/problem/:problemId` | Problem description, editor, test results, solutions, submissions, AI assistant, and editorial |
| `/admin` | Admin dashboard |
| `/admin/create` | Create a problem |
| `/admin/delete` | Delete problems |
| `/admin/video` | Manage editorial video uploads |
| `/admin/upload/:problemId` | Upload a video for a problem |

## Data model summary

- **User:** Name, email, bcrypt password hash, role (`user` or `admin`), and solved-problem references.
- **Problem:** Description, difficulty, topic, visible and hidden test cases, starter code and reference solutions for supported languages, and creator reference.
- **Submission:** User/problem references, source code, language, execution status, runtime/memory values, error text, test-case counts, and timestamps.
- **Solution video:** Problem/user references, Cloudinary public ID and URL, thumbnail, duration, and timestamps.

## Build and quality checks

Run these from the `frontend` directory:

```bash
npm run build
npm run lint
npm run preview
```

`npm run build` creates the production frontend bundle in `frontend/dist`. The backend package currently defines a development script (`npm run dev`) but does not define a build, lint, or automated test script.

## Deployment notes

The repository contains the application source and a frontend production build, but does not include EC2 provisioning, a reverse-proxy configuration, process manager configuration, or SSL certificate automation. For an AWS EC2 deployment:

1. Install a supported Node.js runtime and configure MongoDB, Redis, Gemini, Cloudinary, and Judge0 access.
2. Build the frontend with `npm run build` in `frontend`.
3. Run the backend with a process manager and provide production environment variables through the host's secret/configuration mechanism.
4. Serve `frontend/dist` behind a web server or CDN and proxy API traffic to the backend.
5. Set `VITE_API_URL` to the API path/origin reachable from the deployed frontend. The checked-in production frontend env file uses `/api`, which requires a reverse-proxy route for `/api` to the Express server.
6. Update backend CORS to allow the actual frontend origin and configure HTTPS at the proxy/load-balancer layer.

The project description indicates deployment on EC2 with a custom domain and SSL; those infrastructure settings are not represented in the files in this repository and therefore need to be configured and verified in the deployment environment.

## Security and configuration notes

- Keep `.env` files, database connection strings, JWT signing keys, and all provider credentials out of source control.
- The current source has fixed external Redis connection details in `backend/src/config/redis.js` and a Judge0/RapidAPI key in `backend/src/utils/problemUtility.js`. Treat these as exposed credentials: rotate/revoke them, move secrets to environment-based configuration, and avoid sharing or reusing the checked-in values.
- Configure secure cookie attributes (including `httpOnly`, `secure` in production, and an appropriate `sameSite` policy) and ensure the app is served over HTTPS in production.
- Restrict administrator provisioning and access to trusted operators.
- The configured Gemini key is used by the backend; do not expose it as a frontend `VITE_` variable.

