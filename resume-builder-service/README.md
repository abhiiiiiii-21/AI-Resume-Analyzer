# AI Resume Builder Service

> A standalone, backend-first AI-powered Resume Builder API built with Node.js, TypeScript, Express, Drizzle ORM, Neon Postgres, and Google Gemini.

Build professional, ATS-optimized resumes through a conversational AI interface. The AI strategically asks follow-up questions, extracts structured data, and generates downloadable PDFs.

---

## 🏗️ Architecture

```
src/
├── config/           # Environment, DB, and Gemini configuration
├── controllers/      # Thin HTTP request handlers
├── db/schema/        # Drizzle ORM table definitions
├── dto/              # Data Transfer Objects (service layer contracts)
├── middleware/        # Express middleware (auth, validation, errors)
├── prompts/          # AI prompt templates
├── providers/        # External service wrappers (Gemini, Puppeteer)
├── repositories/     # Database access layer (one per table)
├── routes/           # Express route definitions
├── services/         # Business logic layer
├── templates/        # HTML resume templates for PDF generation
├── types/            # TypeScript interfaces and enums
├── utils/            # Helper utilities
├── validators/       # Zod request validation schemas
├── app.ts            # Express app setup
└── server.ts         # HTTP server entry point
```

**Layered Architecture:**  
`Routes → Middleware → Controllers → Services → Repositories → Database`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A [Neon Postgres](https://neon.tech) database
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (copy from template)
cp .env.example .env

# 3. Fill in your .env values:
#    DATABASE_URL=postgresql://...
#    GEMINI_API_KEY=...

# 4. Generate and run database migrations
npm run db:generate
npm run db:migrate

# 5. Start the development server
npm run dev
```

The server will start at `http://localhost:4000`.

---

## 📡 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Service health status |

### Builder (Session & Chat)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/builder/session/start` | Start a new resume session |
| GET | `/api/v1/builder/session/:sessionId` | Get session details + draft + messages |
| POST | `/api/v1/builder/session/:sessionId/message` | Send message to AI |
| PATCH | `/api/v1/builder/drafts/:draftId/section/:sectionName` | Manually update a section |
| POST | `/api/v1/builder/drafts/:draftId/finalize` | Finalize draft → resume |

### Resumes (CRUD)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/resumes` | List all user resumes |
| GET | `/api/v1/resumes/:resumeId` | Get single resume |
| DELETE | `/api/v1/resumes/:resumeId` | Delete a resume |
| POST | `/api/v1/resumes/:resumeId/export-pdf` | Generate PDF |

> **All endpoints** (except health) require the `x-user-id` header.

---

## 🧪 Example Usage

### 1. Start a session
```bash
curl -X POST http://localhost:4000/api/v1/builder/session/start \
  -H "Content-Type: application/json" \
  -H "x-user-id: user-123" \
  -d '{"title": "Backend Developer Resume"}'
```

### 2. Send a message
```bash
curl -X POST http://localhost:4000/api/v1/builder/session/<sessionId>/message \
  -H "Content-Type: application/json" \
  -H "x-user-id: user-123" \
  -d '{"message": "Hi! I am John Doe, a software engineer with 3 years of experience at Google working on distributed systems."}'
```

### 3. Finalize the resume
```bash
curl -X POST http://localhost:4000/api/v1/builder/drafts/<draftId>/finalize \
  -H "Content-Type: application/json" \
  -H "x-user-id: user-123" \
  -d '{"title": "John Doe - Backend Developer", "templateKey": "modern-ats"}'
```

### 4. Generate PDF
```bash
curl -X POST http://localhost:4000/api/v1/resumes/<resumeId>/export-pdf \
  -H "x-user-id: user-123"
```

---

## 🔧 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start with ts-node + nodemon |
| Build | `npm run build` | Compile TypeScript |
| Start | `npm start` | Run compiled JS |
| Generate migrations | `npm run db:generate` | Create SQL from schema |
| Run migrations | `npm run db:migrate` | Apply migrations to DB |
| Drizzle Studio | `npm run db:studio` | Open DB GUI |

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Maps external user IDs to internal UUIDs |
| `builder_sessions` | Tracks resume building conversations |
| `chat_messages` | Stores full chat history |
| `resume_drafts` | Holds evolving resume data (JSONB) |
| `resumes` | Finalized resumes |
| `resume_assets` | Generated PDF file references |

---

## 🤖 How the AI Works

1. User sends a message via the chat endpoint
2. System builds a prompt with: system instructions + current resume state + chat history
3. Gemini returns a structured JSON with extracted resume data + follow-up questions
4. Response is safely parsed (handles markdown fences, malformed JSON)
5. New data is merged into the existing draft (never overwrites, only adds/improves)
6. Updated draft is saved to database
7. Frontend gets back: AI message, updated resume data, completion score, next question

---

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | Neon Postgres connection string |
| `GEMINI_API_KEY` | ✅ | — | Google Gemini API key |
| `GEMINI_MODEL` | ❌ | `gemini-1.5-flash` | Gemini model name |
| `PORT` | ❌ | `4000` | Server port |
| `NODE_ENV` | ❌ | `development` | Environment |
| `CORS_ORIGINS` | ❌ | `http://localhost:3000` | Allowed origins |
| `RATE_LIMIT_WINDOW_MS` | ❌ | `60000` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ | `100` | Max requests per window |

---

## 📂 Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript (strict mode)
- **Framework:** Express.js
- **ORM:** Drizzle ORM
- **Database:** Neon Postgres
- **AI:** Google Gemini API
- **PDF:** Puppeteer
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting
