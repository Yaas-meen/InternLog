

```markdown
# InternLog — SIWES Documentation Platform

> A full-stack MERN application for Nigerian SIWES students to log daily
> internship activities, scan physical logbooks,
> generate professional PDF reports, and get supervisor reviews all in one place.

**Live Demo:** [Visit the Live Application](https://intern-log-ten.vercel.app) 
🔗 **Original vanilla version (frontend only):** [GitHub](https://github.com/Yaas-meen/Internship-Journal-Platform)

---

## What Changed in This Version

The original InternLog was built with plain HTML, CSS, and JavaScript
with no backend — data lived only in the browser. This version is a
complete migration to the MERN stack:

| Feature             | Vanilla Version        | MERN Version                           |
| ------------------- | ---------------------- | -------------------------------------- |
| Data storage        | localStorage only      | MongoDB Atlas (cloud)                  |
| Authentication      | None                   | JWT dual-token (access + refresh)      |
| User accounts       | None                   | Register / login / roles               |
| Supervisor review   | None                   | Admin portal with remarks              |
| AI Integration      | None                   | Gemini API (In development)            |
| PDF reports         | Basic                  | Weekly + monthly                       |
| Deployment          | Frontend only (Vercel) | Frontend (Vercel) + Backend (Render)   |

---

## Features

-  **Daily log entries** — record tasks, hours, day of week, and week number
-  **Weekly & monthly reports** — generate professional PDF reports with one click
-  **Supervisor review** — admin portal for reviewing and remarking on entries
-  **Secure authentication** — JWT access tokens + httpOnly refresh cookies
-  **Mobile-first** — camera capture directly from phone for logbook scanning

---

##  Roadmap (In Active Development)

-  **AI OCR scanning** — photograph a physical logbook page and extract text automatically using Gemini 1.5 Flash.
-  **AI weekly summary** — automated professional summaries of the week's activities.

---

## Tech Stack

### Backend
- **Node.js** + **Express.js** — REST API server
- **MongoDB Atlas** + **Mongoose** — cloud database
- **JWT** — stateless authentication (dual-token strategy)
- **bcrypt** — password hashing (salt factor 12)
- **Zod** — request validation
- **Multer** — image upload handling
- **Google Gemini 1.5 Flash** — OCR and AI summary generation
- **Nodemon** — development server

### Frontend
- **React 18** + **Vite** — SPA framework and build tool
- **Zustand** — global state management
- **Axios** — HTTP client with request/response interceptors
- **React Router v7** — client-side routing with role-based guards
- **Tailwind CSS v3** — utility-first styling
- **html2pdf.js** — client-side PDF generation
- **react-hot-toast** — toast notifications
- **lucide-react** — icon library

---

## Project Structure

```text
internLog/
├── server/                  
│   ├── src/
│   │   ├── server.js        
│   │   ├── app.js           
│   │   ├── models/          
│   │   ├── services/        
│   │   ├── controllers/     
│   │   ├── routes/          
│   │   ├── middleware/      
│   │   ├── validators/      
│   │   └── utils/          
│   ├── uploads/             
│   └── .env                 
│
└── client/                 
    ├── src/
    │   ├── api/            
    │   ├── store/           
    │   ├── pages/           
    │   ├── components/      
    │   └── assets/          
    └── .env                 

```

---

## Getting Started

### Prerequisites

* Node.js 18+
* MongoDB Atlas account
* Google Gemini API key ([get one free](https://aistudio.google.com))

### 1. Clone the repository

```bash
git clone [https://github.com/Yaas-meen/InternLog.git](https://github.com/Yaas-meen/InternLog)
cd InternLog

```

### 2. Backend setup

```bash
cd server
npm install

```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI= your MongoDB Atlas connection string 
JWT_SECRET= your 64-character random string 
JWT_REFRESH_SECRET= your different 64-character random string 
JWT_EXPIRES_IN= 15m
JWT_REFRESH_EXPIRES_IN= 7d
NODE_ENV= development
CLIENT_URL= http://localhost:5173
GEMINI_API_KEY= your gemini api key 

```

Generate JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

```

Seed the admin account:

```bash
npm run seed: admin

```

Start the backend:

```bash
npm run dev

```

### 3. Frontend setup

```bash
cd ../client
npm install

```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_UPLOADS_URL=http://localhost:5000/uploads

```

Start the frontend:

```bash
npm run dev

```

### 4. Open the app

Visit `http://localhost:5173`

---

## API Endpoints

### Auth

* `POST   /api/v1/auth/register`
* `POST   /api/v1/auth/login`
* `POST   /api/v1/auth/refresh`
* `POST   /api/v1/auth/logout`
* `GET    /api/v1/auth/me`

### Logs

* `POST   /api/v1/logs`              
* `GET    /api/v1/logs/my`           
* `GET    /api/v1/logs/week/:week`   
* `GET    /api/v1/logs/:id`
* `PATCH  /api/v1/logs/:id`          
* `DELETE /api/v1/logs/:id`          
* `GET    /api/v1/logs/admin/all`    
* `PATCH  /api/v1/logs/admin/:id/review`  

### Upload & OCR

* `POST   /api/v1/upload/logbook`        
* `POST   /api/v1/upload/logbook/:logId`

### Reports

* `GET    /api/v1/reports/weekly/:weekNumber`
* `GET    /api/v1/reports/monthly/:month/:year`
* `GET    /api/v1/reports/admin/dashboard`

### User

* `PATCH  /api/v1/users/profile`
* `PATCH  /api/v1/users/password`

---

## Authentication Flow

1. Login → access token (15min, stored in memory) + refresh token (7 days, httpOnly cookie)
2. On expiry → Axios interceptor fires `POST /auth/refresh`
3. Queues all concurrent requests
4. Retries with new token on success
5. Redirects to login on failure

---

## Roles

| Role | Access |
| --- | --- |
| **intern** | Dashboard, logs, OCR, reports, profile |
| **admin** | All intern logs, supervisor review, dashboard analytics |

*Admin accounts are created via seed script only — not available on the public register page.*

---

## Deployment

* **Frontend** — **Vercel** — set `VITE_API_BASE_URL` in environment variables.
* **Backend** — **Render** — configured with standard deployment and a cron job to prevent server hibernation.
* **Database** — **MongoDB Atlas** — whitelist `0.0.0.0/0` for Render cloud access.

---

## Original Project

This MERN version is a complete rebuild of the original vanilla HTML/CSS/JS internship journal that was deployed without a backend.

The original repo: [github.com/Yaas-meen/InternLog](https://github.com/Yaas-meen/InternLog)

**Author**
Yaas-meen
Nile University of Nigeria · Software Engineering

```

```
