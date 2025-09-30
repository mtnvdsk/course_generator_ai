# Course Generator AI

Course Generator AI is a full‑stack learning platform that turns any topic into a structured course with AI‑generated lessons and curated YouTube videos. Users can authenticate with email/password or Google OAuth, generate course outlines via chat, browse topics/subtopics, and view relevant videos alongside the AI content.

## Live Demo
- Frontend: https://course-generator-ai-eight.vercel.app/
- Backend: https://course-generator-ai-cuc7.onrender.com

## Features
- AI course generation from user prompts
- Topic → subtopic hierarchy with inline AI explanations
- YouTube video retrieval per subtopic
- Authentication: email/password + Google OAuth
- Responsive dashboard with sidebar navigation and loading states

## Tech Stack
- Frontend: React + TypeScript, Vite, TailwindCSS, shadcn/ui, React Router, TanStack Query
- Backend: Node.js, Express, Passport (Google OAuth 2.0), JWT
- Database: MongoDB (Mongoose)
- AI: OpenAI API
- External: YouTube Data API v3
- Hosting: Vercel (frontend), Render (backend)

## Architecture
- Frontend SPA consumes REST endpoints from the backend
- OAuth handled server‑side with Passport; frontend receives JWT via `postMessage` from popup
- Backend aggregates AI responses and YouTube results, persists user/course data

## API Endpoints (selection)
Auth
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/auth/google`
- `GET /api/users/auth/google/callback`

Courses
- `GET /api/courses/getcourse/all/` – list titles
- `POST /api/courses/getcourse/` – topics/subtopics by course title
- `POST /api/courses/getcourse/airesult/` – AI content + videos for a subtopic

## Environment Variables

Backend
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `SESSION_SECRET`
- `OPENAI_API_KEY`
- `YOUTUBE_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Google OAuth
- Authorized redirect URI: `https://course-generator-ai-cuc7.onrender.com/api/users/auth/google/callback`

## Quick Start

### Backend
```bash
cd Backend
npm install
# create .env and set variables from the Environment Variables section
npm start # or: npx nodemon
```

### Frontend
```bash
npm install
npm run dev
# or for production
npm run build && npm run preview
```

Make sure the frontend points to your backend base URL in API calls.

## Deployment Notes
- CORS: allow origin `https://course-generator-ai-eight.vercel.app` with `credentials: true`
- Sessions: `trust proxy = 1`, cookies `{ secure: true, sameSite: 'none' }` for Render
- Update OAuth redirect URI when domains change

## Security
- Store secrets in provider env vars
- Use HTTPS in production
- Rotate JWT/Session secrets periodically

## License
MIT