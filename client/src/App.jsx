import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home      from './pages/Home';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

const isLoggedIn = () => !!localStorage.getItem('accessToken');

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/login"               element={!isLoggedIn() ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard"           element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/analytics/:shortCode" element={isLoggedIn() ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}