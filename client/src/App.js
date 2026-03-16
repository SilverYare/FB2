import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
import Profile from './pages/Profile';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Публичные маршруты */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Защищённые маршруты */}
                    <Route path="/products" element={
                        <PrivateRoute>
                            <Products />
                        </PrivateRoute>
                    } />
                    <Route path="/products/create" element={
                        <PrivateRoute>
                            <ProductCreate />
                        </PrivateRoute>
                    } />
                    <Route path="/products/:id" element={
                        <PrivateRoute>
                            <ProductDetail />
                        </PrivateRoute>
                    } />
                    <Route path="/products/:id/edit" element={
                        <PrivateRoute>
                            <ProductEdit />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    
                    {/* Редиректы */}
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="*" element={<Navigate to="/products" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;