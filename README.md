# Quiz Builder

A full-stack quiz creation platform built with **Express + Prisma (SQLite)** on the backend and **Next.js + Tailwind CSS** on the frontend.

---

## Project Structure

```
quiz-builder/
├── backend/          # Express + TypeScript + Prisma
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/quizzes.ts
│   │   ├── lib/prisma.ts
│   │   └── types/quiz.ts
│   └── prisma/schema.prisma
└── frontend/         # Next.js + TypeScript + Tailwind
    ├── app/
    │   ├── page.tsx
    │   ├── create/page.tsx
    │   └── quizzes/[id]/page.tsx
    ├── components/
    └── services/api.ts
```

---

## Setup

### Prerequisites

- Node.js 18+
- npm

---

### Backend

```bash
cd backend

# Install dependencies
npm install

# Copy env file and configure
cp .env.example .env

# Run database migration (creates dev.db)
npm run db:migrate

# Start dev server (http://localhost:3001)
npm run dev
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.local.example .env.local

# Start dev server (http://localhost:3000)
npm run dev
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/quizzes` | Create a new quiz |
| `GET` | `/quizzes` | List all quizzes |
| `GET` | `/quizzes/:id` | Get quiz details |
| `DELETE` | `/quizzes/:id` | Delete a quiz |

---

## Data Shape

### Create Quiz — `POST /quizzes`

```ts
{
  title: string
  questions: {
    text: string
    type: "BOOLEAN" | "INPUT" | "CHECKBOX"

    // BOOLEAN — correct answer is "true" or "false"
    correctAnswer?: string

    // INPUT — the expected text answer
    correctAnswer?: string

    // CHECKBOX — mark each option as correct or not
    options?: { label: string; isCorrect: boolean }[]
  }[]
}
```

### Quiz Response — `GET /quizzes/:id`

```ts
{
  id: number
  title: string
  createdAt: string
  questions: {
    id: number
    text: string
    type: "BOOLEAN" | "INPUT" | "CHECKBOX"
    correctAnswer: string | null
    options: { id: number; label: string; isCorrect: boolean }[]
  }[]
}
```

---

## Create a Sample Quiz

The example below covers all three question types.

```bash
curl -X POST http://localhost:3001/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Basics",
    "questions": [
      {
        "type": "BOOLEAN",
        "text": "JavaScript is a compiled language.",
        "correctAnswer": "false"
      },
      {
        "type": "INPUT",
        "text": "What keyword declares a block-scoped constant?",
        "correctAnswer": "const"
      },
      {
        "type": "CHECKBOX",
        "text": "Which of the following are valid JavaScript data types?",
        "options": [
          { "label": "String",    "isCorrect": true  },
          { "label": "Number",    "isCorrect": true  },
          { "label": "Boolean",   "isCorrect": true  },
          { "label": "Float64",   "isCorrect": false }
        ]
      }
    ]
  }'
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home / landing |
| `/create` | Quiz creation form |
| `/quizzes` | List of all quizzes |
| `/quizzes/:id` | Quiz detail (read-only) |

---

## Linting & Formatting

```bash
# Backend
cd backend && npm run lint && npm run format

# Frontend
cd frontend && npm run lint
```
