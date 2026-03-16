import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import './Auth.css';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: ''
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
        
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        
        setLoading(true);
        
        try {
            await api.register({
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password
            });
            
            navigate('/login', { 
                state: { message: '🎉 Регистрация успешна! Теперь можно войти.' } 
            });
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.error || 'Ошибка при регистрации');
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
                <h2>Создать аккаунт ✨</h2>
                <div className="auth-subtitle">Присоединяйтесь к чайной лавке</div>
                
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
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Имя</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Иван"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Фамилия</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Иванов"
                                required
                            />
                        </div>
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
                    
                    <div className="form-group">
                        <label>Подтверждение пароля</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    {/* КРАСИВАЯ КНОПКА РЕГИСТРАЦИИ */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary btn-block btn-register"
                    >
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner"></span>
                                Регистрация...
                            </span>
                        ) : (
                            <span className="btn-text">
                                Зарегистрироваться
                                <span className="btn-icon">→</span>
                            </span>
                        )}
                    </button>
                </form>
                
                <div className="auth-link-container">
                    <div className="auth-link-text">Уже есть аккаунт?</div>
                    <Link to="/login" className="auth-link">
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}