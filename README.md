# TaskFlow — Full-Stack Task Manager

A production-ready full-stack web application with JWT authentication and a task management dashboard.

---

## 1. Folder Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register & login logic
│   │   ├── userController.js      # Profile CRUD
│   │   └── taskController.js      # Task CRUD + filtering
│   ├── middleware/
│   │   ├── auth.js                # JWT protect middleware
│   │   ├── errorHandler.js        # Global error handler
│   │   └── validate.js            # express-validator rules
│   ├── models/
│   │   ├── User.js                # Mongoose User schema
│   │   └── Task.js                # Mongoose Task schema
│   ├── routes/
│   │   ├── auth.js                # POST /api/auth/*
│   │   ├── user.js                # GET/PUT /api/user/*
│   │   └── tasks.js               # CRUD /api/tasks/*
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── common/
    │   │   │   ├── EmptyState.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   └── Spinner.jsx
    │   │   ├── layout/
    │   │   │   ├── DashboardLayout.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Sidebar.jsx
    │   │   └── tasks/
    │   │       ├── TaskCard.jsx
    │   │       ├── TaskFilters.jsx
    │   │       └── TaskForm.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state
    │   ├── hooks/
    │   │   └── useTasks.js         # Task data + operations
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   ├── api.js              # Axios instance + interceptors
    │   │   ├── authService.js
    │   │   ├── taskService.js
    │   │   └── userService.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 2. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`) — optional
```env
VITE_API_URL=http://localhost:5000
```

---

## 3. Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev        # starts on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000` automatically.

---

## 4. API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/user/profile | Yes | Get own profile |
| PUT | /api/user/profile | Yes | Update name/bio/password |
| GET | /api/tasks | Yes | List tasks (search, filter, paginate) |
| POST | /api/tasks | Yes | Create task |
| PUT | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |

### Query Parameters for GET /api/tasks
- `search` — text search in title/description
- `status` — `pending` | `in-progress` | `completed`
- `priority` — `low` | `medium` | `high`
- `page` — page number (default: 1)
- `limit` — results per page (default: 20)

---

## 5. Deployment

### Backend — Railway / Render / Heroku

```bash
# Set these environment variables on your platform:
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

**Render (recommended):**
1. Connect your GitHub repo
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env vars in dashboard

### Frontend — Vercel / Netlify

```bash
cd frontend
npm run build
# dist/ folder is ready to deploy
```

**Vercel:**
```bash
npm i -g vercel
cd frontend
vercel
# Follow prompts, set VITE_API_URL to your backend URL
```

**Netlify:**
1. Drag `dist/` to Netlify dashboard, or
2. Connect GitHub, set build command: `npm run build`, publish dir: `dist`

Add `frontend/public/_redirects`:
```
/*  /index.html  200
```

---

## 6. Production Scaling Guide

### Database
- Use **MongoDB Atlas** with replica sets for high availability
- Enable **connection pooling** (Mongoose default handles this)
- Add compound indexes (already in `Task.js`) for query performance
- Consider **read replicas** for analytics-heavy workloads

### Backend Horizontal Scaling
```bash
# Use PM2 for multi-process on a single server
npm i -g pm2
pm2 start server.js -i max   # spawns one process per CPU core
pm2 save && pm2 startup
```

For multi-server scaling:
- Deploy to **AWS ECS** / **GCP Cloud Run** / **Kubernetes**
- Use **Redis** for session caching and rate limiting
- Use a **Load Balancer** (AWS ALB) in front

### Security Hardening for Production
```bash
npm install helmet express-rate-limit compression
```

Add to `server.js`:
```js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

app.use(helmet());
app.use(compression());
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));
```

### Environment Best Practices
- Rotate `JWT_SECRET` periodically; invalidate old tokens on rotation
- Use **short-lived tokens** (15m) + **refresh tokens** stored in httpOnly cookies for higher security
- Enable MongoDB Atlas **IP allowlisting** and **audit logging**
- Set up **CORS** to only allow your frontend domain in production

### Monitoring
- **Logs**: Use Winston + ship to Datadog / Logtail / CloudWatch
- **Errors**: Integrate Sentry (`@sentry/node`)
- **Uptime**: UptimeRobot or BetterUptime

### CI/CD (GitHub Actions example)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: cd backend && npm install && npm test
      # Deploy to Render/Railway via their CLI or webhook
```

---

## 7. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Routing | React Router v6 |
| HTTP | Axios with interceptors |
| State | Context API + useReducer |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Toasts | react-hot-toast |
| Fonts | Syne + JetBrains Mono |
