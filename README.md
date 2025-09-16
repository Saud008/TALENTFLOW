# TalentFlow - Mini Hiring Platform

A modern hiring platform built with React (Vite) frontend featuring dual portals for admins and candidates. Experience seamless job management, candidate tracking, and assessment workflows with a beautiful, responsive UI powered by TailwindCSS and DaisyUI.

**Live Demo**: [https://incredible-dragon-bf9e3f.netlify.app/candidate](https://incredible-dragon-bf9e3f.netlify.app/candidate)

## Features

### Admin Portal
- **Jobs Management**: Create, edit, archive jobs with drag-and-drop reordering
- **Candidates Management**: Virtualized list (1000+ candidates) with search and filtering
- **Kanban Board**: Drag-and-drop candidate stage management
- **Assessments**: Dynamic assessment builder with multiple question types
- **Real-time Updates**: Optimistic UI updates with error rollback
- **Responsive Design**: Mobile-first design with TailwindCSS + DaisyUI

### Candidate Portal
- **Job Search**: Browse and filter available job opportunities
- **Application Tracking**: Monitor application status and progress
- **Profile Management**: Complete professional profile with experience and skills
- **Dashboard**: Overview of applications, interviews, and profile activity
- **Settings**: Customize notifications, privacy, and job preferences
- **Theme Support**: Light/Dark/Auto theme switching


### Data Layer
- **MSW (Mock Service Worker)**: Simulates REST API with artificial latency
- **Dexie (IndexedDB)**: Local data persistence with 1000+ seeded records
- **Error Injection**: 5-10% random failure rate for testing

## Tech Stack

### Frontend
- **React 18** + **Vite** (Fast development & build)
- **React Router DOM** (Client-side routing)
- **TailwindCSS + DaisyUI** (Modern, responsive UI)
- **MSW (Mock Service Worker)** (API simulation with error injection)
- **Dexie (IndexedDB)** (Local data persistence)
- **@dnd-kit** (Drag & Drop functionality)
- **React Window** (Virtualized lists for performance)
- **Axios** (HTTP client with interceptors)
- **AOS** (Animate On Scroll effects)

### Data & State Management
- **MSW Handlers** (Complete REST API simulation)
- **Dexie Database** (1000+ seeded candidates & jobs)
- **Error Injection** (5-10% random failures for testing)
- **Optimistic Updates** (Real-time UI with rollback)

## Quick Start


### Portal Access
- **Live Demo**: [https://incredible-dragon-bf9e3f.netlify.app/candidate](https://incredible-dragon-bf9e3f.netlify.app/candidate)
- **Admin Portal**: Navigate to `/admin` for the admin dashboard
- **Candidate Portal**: Navigate to `/candidate` for the candidate portal
- **Root Redirect**: Visiting `/` automatically redirects to `/candidate`
- **Quick Access**: Use the "Candidate Portal" link in the admin sidebar

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/Saud008/TALENTFLOW.git
cd TALENTFLOW
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- MSW: Automatically starts for API simulation
- Dexie: Auto-seeds with 1000+ candidates and jobs

### Live Demo Access
Visit the live deployment at: **[https://incredible-dragon-bf9e3f.netlify.app/candidate](https://incredible-dragon-bf9e3f.netlify.app/candidate)**

- **Candidate Portal**: Default landing page with job search and applications
- **Admin Portal**: Navigate to `/admin` for management dashboard
- **No Authentication Required**: Demo uses simulated data

## Project Structure

```
TALENTFLOW/
├── src/                    # Main React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components (Admin & Candidate portals)
│   ├── contexts/          # React contexts (Theme, Toast, User)
│   ├── services/          # Data services and API simulation
│   ├── data/              # Mock data and JSON files
│   └── main.jsx           # Application entry point
├── app/                    # Alternative frontend structure
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── services/          # MSW handlers, Dexie, API services
│   ├── stores/            # State management
│   └── utils/             # Helper functions
├── public/                # Static assets & Netlify config
│   └── _redirects         # SPA routing configuration
├── netlify.toml           # Netlify deployment configuration
└── dist/                  # Production build output
```

## API Endpoints (MSW Simulated)

### Jobs Management
- `GET /jobs?search=&status=&page=&pageSize=&sort=` - List jobs with filtering
- `POST /jobs` - Create new job
- `PATCH /jobs/:id` - Update job details
- `PATCH /jobs/:id/reorder` - Reorder jobs (with 10% error injection for rollback testing)

### Candidates Management
- `GET /candidates?search=&stage=&page=` - List candidates with filtering
- `POST /candidates` - Create new candidate
- `PATCH /candidates/:id` - Update candidate (stage transitions)
- `GET /candidates/:id/timeline` - Get candidate activity timeline

### Assessments
- `GET /assessments/:jobId` - Get assessment for specific job
- `PUT /assessments/:jobId` - Save/update assessment
- `POST /assessments/:jobId/submit` - Submit assessment response (stored locally)

### Error Simulation Features
- **Random 500 errors** on reorder endpoint (10% failure rate)
- **Artificial latency** (200-2000ms range)
- **Multiple error types**: server, timeout, validation, conflict
- **Optimistic updates** with automatic rollback on failure

## Key Features Implemented

### Core Functionality
- Admin dashboard with job and candidate management
- Jobs CRUD with drag-and-drop reordering
- Candidates management with virtualized list
- Kanban board for candidate stages
- Assessment builder with multiple question types
- Real-time search and filtering
- Responsive design with DaisyUI

### Technical Features
- MSW API simulation with artificial latency
- Dexie IndexedDB persistence
- Error injection and optimistic updates
- Virtualized lists for performance
- Drag-and-drop with @dnd-kit
- React Router for navigation
- Context API for state management

### Data Seeding
- 25 jobs with various statuses
- 1000 candidates with random assignments
- 3 assessments with 10+ questions each
- Candidate timeline entries
- Realistic data generation

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Netlify (automatic via GitHub)
# Or manually deploy dist/ folder
```

## Deployment

### Netlify Configuration
- **Automatic Deployments**: Connected to GitHub repository
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Routing**: Configured with `_redirects` and `netlify.toml`

### Environment Setup
No environment variables required for the demo version. The application uses:
- **MSW**: For API simulation
- **Dexie**: For local data persistence
- **Netlify**: For hosting and SPA routing

## Troubleshooting

### Common Issues

1. **404 Error on Page Refresh**
   - **Fixed**: Netlify SPA routing configured with `_redirects` and `netlify.toml`

2. **MSW Not Working**
   - Check browser console for MSW startup messages
   - Ensure MSW handlers are properly imported
   - Clear browser cache and refresh

3. **Dexie Seeding Issues**
   - Clear browser storage and refresh
   - Check console for seeding errors
   - Data auto-seeds on first visit

4. **Build Issues**
   - Ensure Node.js 18+ is installed
   - Run `npm install` to install dependencies
   - Check for TypeScript/ESLint errors

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

---

## Features Showcase

### Live Demo Highlights
- **Dual Portal System**: Seamless switching between admin and candidate views
- **Real-time Data**: MSW simulation with 1000+ candidates and jobs
- **Error Testing**: Built-in error injection for testing rollback scenarios
- **Responsive Design**: Mobile-first approach with TailwindCSS + DaisyUI
- **Performance**: Virtualized lists and optimized rendering

### Try It Now
Visit: **[https://incredible-dragon-bf9e3f.netlify.app/candidate](https://incredible-dragon-bf9e3f.netlify.app/candidate)**

**No setup required** - everything works out of the box!
