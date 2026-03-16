import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import './Products.css';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        loadProducts();
    }, []);
    
    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await api.getProducts();
            setProducts(response.data);
        } catch (err) {
            setError('Ошибка при загрузке товаров');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            return;
        }
        
        try {
            await api.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert('Ошибка при удалении товара');
        }
    };
    
    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    
    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Наш пуэр</h1>
                <Link to="/products/create" className="btn btn-primary">
                    + Добавить товар
                </Link>
            </div>
            
            {products.length === 0 ? (
                <p className="empty">Товаров пока нет</p>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <h3>{product.title}</h3>
                            <p className="category">{product.category}</p>
                            <p className="description">{product.description}</p>
                            <p className="price">{product.price} ₽</p>
                            <div className="product-actions">
                                <Link to={`/products/${product.id}`} className="btn">
                                    Подробнее
                                </Link>
                                <Link to={`/products/${product.id}/edit`} className="btn btn-edit">
                                    ✎
                                </Link>
                                <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="btn btn-delete"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}