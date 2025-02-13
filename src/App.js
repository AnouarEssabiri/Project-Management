import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MainLayout from './layouts/MainLayout';
import React from 'react';
import LoadingSpinner from './loading/LoadingSpinner';
// import TestEnv from './components/TestEnv';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ScrumBoard = React.lazy(() => import('./pages/ScrumBoard'));
const KanbanBoard = React.lazy(() => import('./pages/KanbanBoard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* <TestEnv /> Temporary test component */}
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={
            <React.Suspense fallback={<div><LoadingSpinner /></div>}>
              <Login />
            </React.Suspense>
          } />
          <Route path="/register" element={
            <React.Suspense fallback={<div><LoadingSpinner /></div>}>
              <Register />
            </React.Suspense>
          } />

          {/* Protected routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={
              <React.Suspense fallback={<div><LoadingSpinner /></div>}>
                <Dashboard />
              </React.Suspense>
            } />
            <Route path="scrum" element={
              <React.Suspense fallback={<div><LoadingSpinner /></div>}>
                <ScrumBoard />
              </React.Suspense>
            } />
            <Route path="kanban" element={
              <React.Suspense fallback={<div><LoadingSpinner /></div>}>
                <KanbanBoard />
              </React.Suspense>
            } />
            <Route path="profile" element={
              <React.Suspense fallback={<div><LoadingSpinner /></div>}>
                <Profile />
              </React.Suspense>
            } />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
