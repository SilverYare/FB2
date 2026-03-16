import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!user) {
        navigate('/login');
        return null;
    }
    
    return (
        <div className="profile-page">
            <h1>Профиль пользователя</h1>
            <div className="profile-card">
                <div className="profile-info">
                    <div className="info-row">
                        <label>Email:</label>
                        <span>{user.email}</span>
                    </div>
                    <div className="info-row">
                        <label>Имя:</label>
                        <span>{user.first_name}</span>
                    </div>
                    <div className="info-row">
                        <label>Фамилия:</label>
                        <span>{user.last_name}</span>
                    </div>
                    <div className="info-row">
                        <label>ID:</label>
                        <span className="user-id">{user.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}