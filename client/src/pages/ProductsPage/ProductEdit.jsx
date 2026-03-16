import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import ProductForm from '../components/ProductForm';

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadProduct();
    }, [id]);
    
    const loadProduct = async () => {
        try {
            const response = await api.getProduct(id);
            setProduct(response.data);
        } catch (err) {
            alert('Товар не найден');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = async (formData) => {
        try {
            await api.updateProduct(id, formData);
            navigate(`/products/${id}`);
        } catch (err) {
            alert('Ошибка при обновлении товара');
            throw err;
        }
    };
    
    if (loading) return <div className="loading">Загрузка...</div>;
    
    return (
        <div className="product-form-page">
            <h1>Редактировать товар</h1>
            <ProductForm 
                initialData={product}
                onSubmit={handleSubmit}
                buttonText="Сохранить изменения"
            />
        </div>
    );
}