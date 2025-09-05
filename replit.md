# CRM Auto Frontend

## Overview
This is a React-based CRM frontend application that manages customers, loans, and call outcomes. It's designed to work with a backend API and provides a modern, responsive user interface built with Tailwind CSS.

## Architecture
- **Frontend**: React 18 with Create React App
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router DOM for navigation
- **API Integration**: Axios with context-based API management
- **Components**: Modular component structure for customers, loans, dashboard, and call outcomes

## Key Features
- Customer management (CRUD operations)
- Loan management and tracking
- Dashboard with statistics
- Call outcome recording
- Responsive design
- Auto-detecting API backend connection

## Recent Changes
- 2025-09-05: Initial setup for Replit environment
- Configured development server for host 0.0.0.0:5000
- Set up environment variables for API connection
- Installed all dependencies successfully

## Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard
│   ├── Customers.js     # Customer list
│   ├── CustomerDetail.js
│   ├── Loans.js         # Loan management
│   ├── LoanDetail.js
│   └── CallOutcome.js   # Call tracking
├── context/
│   └── ApiContext.js    # API management context
├── App.js              # Main app component
└── index.js            # Entry point
```

## Development Setup
- Port: 5000 (frontend)
- Host: 0.0.0.0 (to work with Replit proxy)
- Backend API: Configurable via environment variables
- Build System: Create React App (react-scripts)

## User Preferences
- No specific user preferences recorded yet