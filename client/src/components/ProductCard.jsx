import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product, onDelete }) {
    return (
        <div className="product-card">
            <div className="product-card__header">
                <h3 className="product-card__title">{product.title}</h3>
                <span className="product-card__category">{product.category}</span>
            </div>
            
            <div className="product-card__body">
                <p className="product-card__description">
                    {product.description || 'Нет описания'}
                </p>
                <p className="product-card__price">{product.price} ₽</p>
            </div>
            
            <div className="product-card__footer">
                <Link to={`/products/${product.id}`} className="btn btn-primary">
                    Подробнее
                </Link>
                <div className="product-card__actions">
                    <Link 
                        to={`/products/${product.id}/edit`} 
                        className="btn btn-edit"
                        title="Редактировать"
                    >
                        ✎
                    </Link>
                    <button 
                        onClick={() => onDelete(product.id)}
                        className="btn btn-delete"
                        title="Удалить"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}