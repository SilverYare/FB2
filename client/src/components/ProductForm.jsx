import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductForm.css';

export default function ProductForm({ initialData, onSubmit, loading, buttonText }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Шу Пуэр',
        description: '',
        price: ''
    });
    
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                category: initialData.category || 'Шу Пуэр',
                description: initialData.description || '',
                price: initialData.price || ''
            });
        }
    }, [initialData]);
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.category || !formData.price) {
            alert('Заполните обязательные поля');
            return;
        }
        
        if (formData.price <= 0) {
            alert('Цена должна быть положительным числом');
            return;
        }
        
        try {
            await onSubmit(formData);
        } catch (err) {
            // Ошибка уже обработана в родительском компоненте
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
                <label>Название *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Категория *</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="Шу Пуэр">Шу Пуэр</option>
                    <option value="Шен Пуэр">Шен Пуэр</option>
                    <option value="Белый Пуэр">Белый Пуэр</option>
                </select>
            </div>
            
            <div className="form-group">
                <label>Описание</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                />
            </div>
            
            <div className="form-group">
                <label>Цена *</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                />
            </div>
            
            <div className="form-actions">
                <button 
                    type="button" 
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                >
                    Отмена
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Сохранение...' : buttonText}
                </button>
            </div>
        </form>
    );
}