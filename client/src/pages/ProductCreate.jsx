import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import ProductForm from '../components/ProductForm';

export default function ProductCreate() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await api.createProduct(formData);
            navigate(`/products/${response.data.id}`);
        } catch (err) {
            alert('Ошибка при создании товара');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="product-form-page">
            <h1>Добавить новый товар</h1>
            <ProductForm 
                onSubmit={handleSubmit}
                loading={loading}
                buttonText="Создать товар"
            />
        </div>
    );
}