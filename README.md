# TalentFlow - Mini Hiring Platform

A complete hiring platform built with React (Vite) frontend and Node.js/Express backend with MongoDB authentication. Features MSW for API simulation, Dexie for local data persistence, and a modern UI with DaisyUI.

## Features

### Frontend (React + Vite)
- **Jobs Management**: Create, edit, archive jobs with drag-and-drop reordering
- **Candidates Management**: Virtualized list (1000+ candidates) with search and filtering
- **Kanban Board**: Drag-and-drop candidate stage management
- **Assessments**: Dynamic assessment builder with multiple question types
- **Real-time Updates**: Optimistic UI updates with error rollback
- **Responsive Design**: Mobile-first design with TailwindCSS + DaisyUI

### Backend (Node.js + Express)
- **Admin Authentication**: JWT-based auth with MongoDB
- **Secure Routes**: Protected admin endpoints
- **Database Integration**: MongoDB with Mongoose ODM

### Data Layer
- **MSW (Mock Service Worker)**: Simulates REST API with artificial latency
- **Dexie (IndexedDB)**: Local data persistence with 1000+ seeded records
- **Error Injection**: 5-10% random failure rate for testing

## Tech Stack

### Frontend
- React 18 + Vite
- React Router DOM
- TanStack Query (React Query)
- Zustand (State Management)
- TailwindCSS + DaisyUI
- MSW (Mock Service Worker)
- Dexie (IndexedDB)
- @dnd-kit (Drag & Drop)
- React Window (Virtualization)
- Axios (HTTP Client)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt (Password Hashing)
- CORS enabled

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd TalentFlow
npm run install:all
```

2. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Seed the admin user:**
```bash
npm run seed:admin
```

4. **Start the development servers:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Default Admin Credentials
- **Email**: admin@example.com
- **Password**: Password123!

## Project Structure

```
TalentFlow/
├── app/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services, MSW handlers, Dexie
│   ├── stores/            # Zustand state stores
│   ├── utils/             # Helper functions and constants
│   └── styles/            # Global styles
├── backend/               # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── server.js          # Main server file
└── public/                # Static assets
```

## API Endpoints

### Backend (Real)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `POST /api/auth/logout` - Logout

### Frontend (MSW Simulated)
- `GET /jobs` - List jobs with pagination/filtering
- `POST /jobs` - Create job
- `PATCH /jobs/:id` - Update job
- `PATCH /jobs/:id/reorder` - Reorder jobs (with error injection)
- `GET /candidates` - List candidates
- `POST /candidates` - Create candidate
- `PATCH /candidates/:id` - Update candidate
- `GET /candidates/:id/timeline` - Get candidate timeline
- `GET /assessments/:jobId` - Get assessment
- `PUT /assessments/:jobId` - Save assessment
- `POST /assessments/:jobId/submit` - Submit assessment response

## Key Features Implemented

### ✅ Core Functionality
- [x] Admin authentication with JWT
- [x] Jobs CRUD with drag-and-drop reordering
- [x] Candidates management with virtualized list
- [x] Kanban board for candidate stages
- [x] Assessment builder with multiple question types
- [x] Real-time search and filtering
- [x] Responsive design with DaisyUI

### ✅ Technical Features
- [x] MSW API simulation with artificial latency
- [x] Dexie IndexedDB persistence
- [x] Error injection and optimistic updates
- [x] Virtualized lists for performance
- [x] Drag-and-drop with @dnd-kit
- [x] React Query for data fetching
- [x] Zustand for state management

### ✅ Data Seeding
- [x] 25 jobs with various statuses
- [x] 1000 candidates with random assignments
- [x] 3 assessments with 10+ questions each
- [x] Candidate timeline entries
- [x] Realistic data generation

## Development

### Frontend Development
```bash
cd app
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Database Seeding
```bash
# Seed admin user
npm run seed:admin

# Frontend auto-seeds Dexie on first run
```

## Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/talentflow
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file

2. **CORS Issues**
   - Backend has CORS enabled for localhost:5173

3. **MSW Not Working**
   - Check browser console for MSW startup messages
   - Ensure MSW handlers are properly imported

4. **Dexie Seeding Issues**
   - Clear browser storage and refresh
   - Check console for seeding errors

## License

MIT License - feel free to use this project for learning and development.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
