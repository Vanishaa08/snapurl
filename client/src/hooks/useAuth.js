import { useState } from 'react';
import api from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('accessToken');
    return token ? { token } : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser({ token: data.accessToken });
  };

  const register = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser({ token: data.accessToken });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return { user, login, register, logout };
}