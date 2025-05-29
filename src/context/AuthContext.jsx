import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token) {
            // Декодируем токен, чтобы извлечь роль
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({ role: payload.role });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/login', { username, password });
            const newToken = response.data.token;
            setToken(newToken);
            localStorage.setItem('token', newToken);
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);