import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

export default function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user  ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}