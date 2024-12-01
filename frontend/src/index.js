import React, { memo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Home from './Pages/Home';
import AdminLogin from './components/AdminLogin';
import FormView from './components/FormView';
import FormBuilder from './components/FormBuilder'; // Add this import
import Admin from "./Pages/Admin.jsx";
import UserFormView from './components/UserFormView';

const ProtectedRoute = memo(({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/AdminPage" replace />;
});

ProtectedRoute.displayName = 'ProtectedRoute';

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AdminPage" element={<AdminLogin />} />
          <Route
            path="/Admin/*"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/form/:formId" element={<FormView />} />
          <Route path="/create-form" element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          } />
          <Route path="/fill-form/:formId" element={<UserFormView />} />
          <Route path="/form/:formId/responses" element={
            <ProtectedRoute>
              <FormView showResponses={true} />
            </ProtectedRoute>
          } />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
