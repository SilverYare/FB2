import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        loadProduct();
    }, [id]);
    
    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await api.getProduct(id);
            setProduct(response.data);
        } catch (err) {
            setError('Товар не найден');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            return;
        }
        
        try {
            await api.deleteProduct(id);
            navigate('/products');
        } catch (err) {
            alert('Ошибка при удалении товара');
        }
    };
    
    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="error">Товар не найден</div>;
    
    return (
        <div className="product-detail">
            <div className="detail-header">
                <Link to="/products" className="back-link">← Назад к списку</Link>
                <div className="detail-actions">
                    <Link to={`/products/${id}/edit`} className="btn btn-edit">
                        Редактировать
                    </Link>
                    <button onClick={handleDelete} className="btn btn-delete">
                        Удалить
                    </button>
                </div>
            </div>
            
            <div className="detail-card">
                <h1>{product.title}</h1>
                <div className="detail-meta">
                    <span className="category">{product.category}</span>
                </div>
                <div className="detail-description">
                    <h3>Описание</h3>
                    <p>{product.description || 'Нет описания'}</p>
                </div>
                <div className="detail-price">
                    <h3>Цена</h3>
                    <p className="price">{product.price} ₽</p>
                </div>
            </div>
        </div>
    );
}