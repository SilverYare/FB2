import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            // Опционально: уведомить сервер о выходе
            fetch('http://localhost:3003/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            }).finally(() => {
                localStorage.clear();
                navigate('/login');
            });
        } else {
            localStorage.clear();
            navigate('/login');
        }
    };
    
    return (
        <div className="layout">
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">🍵 Чайная лавка</Link>
                        <nav className="nav">
                            <Link to="/products">Товары</Link>
                            {user ? (
                                <>
                                    <Link to="/profile">{user.first_name}</Link>
                                    <button onClick={handleLogout} className="btn-logout">
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">Вход</Link>
                                    <Link to="/register">Регистрация</Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
            <main className="main">
                <div className="container">
                    {children}
                </div>
            </main>
            <footer className="footer">
                <div className="container">
                    <p>© 2024 Чайная лавка. Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
}