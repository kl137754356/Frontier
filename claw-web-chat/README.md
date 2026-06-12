# Claw Web Chat

Web chat interface for Frontier AI programming assistant.

## Project Structure

```
claw-web-chat/
├── frontend/       # Vite + React + TypeScript + Tailwind CSS
├── backend/        # Node.js + TypeScript + WebSocket (ws)
├── shared/         # Shared types and protocol definitions
└── package.json    # Root scripts for running both projects
```

## Setup

```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

## Development

```bash
# From root directory
npm run dev:frontend    # Start frontend dev server (port 3000)
npm run dev:backend     # Start backend server

# Run tests
npm run test            # Run all tests
npm run test:frontend   # Frontend tests only
npm run test:backend    # Backend tests only
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v3, Zustand, react-markdown
- **Backend**: Node.js, TypeScript, ws (WebSocket)
- **Testing**: Vitest, fast-check (property-based testing)
