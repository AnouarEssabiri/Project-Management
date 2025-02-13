# Scrum Project Management Application

A modern, scalable React application for project management based on Scrum methodology. Built with React, Tailwind CSS, and modern web technologies.

## Features

- User Authentication with Role-Based Access
- Interactive Dashboard
- Scrum Board & Sprint Management
- Kanban Board with Drag & Drop
- Real-time Updates
- Dark Mode Support
- Responsive Design
- Modern UI with Animations

## Tech Stack

- React (Latest Version)
- React Router for routing
- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn/UI for UI components
- Redux Toolkit for state management
- React Beautiful DnD for drag and drop
- Firebase for authentication and database

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── layouts/           # Layout components
├── features/          # Feature-specific components
├── hooks/             # Custom React hooks
├── services/          # API and service functions
├── store/             # Redux store and slices
├── utils/             # Utility functions
├── constants/         # Constants and configurations
└── assets/           # Static assets
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Run linter
- `npm run format`: Format code

## Authentication

The application uses Firebase Authentication with the following roles:
- Admin: Full access to all features
- Team Lead: Project and team management
- Developer: Task management and updates

## Design System

- Uses Tailwind CSS for styling
- Consistent color scheme and typography
- Responsive design for all screen sizes
- Dark mode support
- Smooth animations with Framer Motion

## Core Features

### Dashboard
- Project overview
- Sprint statistics
- Team member management
- Activity timeline

### Scrum Board
- Sprint planning
- Backlog management
- Sprint review
- Daily standup tracking

### Kanban Board
- Drag and drop tasks
- Multiple columns
- Task filtering
- Priority management

### User Management
- Role-based access control
- Team management
- User profiles
- Activity tracking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
