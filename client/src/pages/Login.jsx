import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.login(formData);
            const { accessToken, refreshToken, user } = response.data;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            navigate('/products');
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.error || `Ошибка ${err.response.status}`);
            } else if (err.request) {
                setError('Сервер не отвечает. Проверь, запущен ли сервер на порту 3003');
            } else {
                setError('Ошибка при отправке запроса');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Добро пожаловать! 👋</h2>
                <div className="auth-subtitle">Войдите в свой аккаунт</div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@mail.ru"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary btn-block"
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                
                {/* Новая красивая плашка регистрации */}
                <div className="auth-link-container">
                    <div className="auth-link-text">Впервые у нас?</div>
                    <Link to="/register" className="auth-link">
                        Создать аккаунт →
                    </Link>
                </div>
            </div>
        </div>
    );
}