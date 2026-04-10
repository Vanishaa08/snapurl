import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

const isLoggedIn = () => !!localStorage.getItem('accessToken');

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isLoggedIn() ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}