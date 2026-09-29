# ReviewLens

Mobile-first AI-powered review intelligence and personalized recommendation platform.

ReviewLens extracts deep structured intelligence from unstructured customer reviews, checks reviews with a deterministic **Review Trust Signal**, scores venues against the user's personal aspect priorities via a transparent mathematical formula, and surfaces crystal-clear, mathematically verified **"Why Recommended"** explanations.

## Current Status

✅ **Frontend Audit Complete** - All critical issues resolved, application fully functional in development mode

### Recent Updates (2026-09-29)
- ✅ Fixed port mismatch between client and server
- ✅ Implemented graceful database connection handling
- ✅ Enhanced error handling across all API endpoints
- ✅ Improved environment configuration and documentation
- ✅ Added comprehensive environment setup guide

### Quick Start

The application can run in **mock mode** without a database connection for development and testing:

```bash
# Terminal 1: Start backend server
cd server
npm install
npm start

# Terminal 2: Start frontend (with mock data)
cd client
npm install
# Set VITE_USE_DUMMY=true in client/.env for mock mode
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173 (or next available port)
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/api/health

## Structure

- `client/` — React/Vite/Tailwind frontend
- `server/` — Node/Express/MongoDB backend
- `data/` — seed JSON placeholders
- `docs/` — comprehensive architecture and setup documentation

## Documentation

- **[Environment Setup Guide](docs/ENVIRONMENT_SETUP.md)** - Complete configuration instructions for development and production
- **[Frontend Audit Report](docs/FRONTEND_AUDIT_REPORT.md)** - Detailed frontend functionality audit and fixes
- **[Current State](docs/CURRENT_STATE.md)** - Current implementation status and known limitations
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture and technical specifications
- **[Project Spec](docs/PROJECT_SPEC.md)** - Product definition and requirements

## Setup

### Development Setup (Mock Mode - No Database Required)

```bash
# Clone repository
git clone <repository-url>
cd ReviewLens

# Install dependencies
cd server && npm install
cd ../client && npm install

# Configure environment
cd server
cp .env.example .env
# Edit .env if needed (defaults work for mock mode)

cd ../client
cp .env.example .env
# Set VITE_USE_DUMMY=true for mock mode
# Set VITE_API_URL=http://localhost:3000

# Start servers
cd server && npm start
cd ../client && npm run dev
```

### Production Setup (Requires MongoDB Atlas)

See [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md) for detailed production configuration instructions.

## Features

### Implemented ✅
- **Frontend Pages:** Home, Explore, Preferences, Recommendations, Place Details, Review Intelligence, Insights
- **Navigation:** Responsive bottom navigation (mobile) and top navigation (desktop)
- **API Integration:** Centralized API client with error handling
- **State Management:** Preferences context with localStorage persistence
- **Mock Data Mode:** Full functionality without database connection
- **Error Handling:** Graceful fallbacks and user-friendly error messages
- **Responsive Design:** Mobile-first with tablet and desktop layouts

### Backend Services ✅
- **Recommendation Engine:** 40/20/15/15/10 scoring formula
- **Review Trust Signal:** Deterministic heuristic analysis
- **AI Analysis:** Mock mode (with live Gemini API integration ready)
- **API Endpoints:** Places, reviews, recommendations, intelligence

### Database Requirements ⚠️
- **MongoDB Atlas:** Required for full functionality with real data
- **Current Status:** Graceful fallback when database unavailable
- **DNS Issues:** Current MongoDB Atlas connection has DNS resolution problems

## Known Limitations

- **Database Connection:** Current MongoDB Atlas connection fails due to DNS resolution issues
- **Review Submission:** Not implemented (documented as out-of-scope for MVP)
- **Live AI Mode:** Requires Gemini API key configuration for production
- **Automated Testing:** No automated test infrastructure currently implemented

## Contributing

This project follows strict architectural guidelines as documented in [ARCHITECTURE.md](docs/ARCHITECTURE.md). Key principles:

- **AI Boundary:** Gemini understands review text; the application decides scores, trust, and recommendations
- **Immutable Formula:** The 40/20/15/15/10 recommendation formula must not be altered
- **8 Canonical Aspects:** Fixed set of aspects across the entire system
- **Review Trust Signal:** Always use this terminology, never "fake review detector"
- **Security:** Never commit API keys or secrets to version control

See [AGENTS.md](docs/AGENTS.md) for detailed collaboration guidelines and development rules.

## License

See project license file for details.
