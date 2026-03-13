import React, { useState, useEffect } from "react";
import "./ProductsPage.scss";
import { api } from "../../api";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
            
            // Получаем уникальные категории
            const uniqueCategories = [...new Set(data.map(p => p.category))];
            setCategories(uniqueCategories);
        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки товаров");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode("create");
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setModalMode("edit");
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить товар?");
        if (!ok) return;

        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
            alert("Ошибка удаления товара");
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === "create") {
                const newProduct = await api.createProduct(payload);
                setProducts(prev => [...prev, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(payload.id, payload);
                setProducts(prev => 
                    prev.map(p => p.id === payload.id ? updatedProduct : p)
                );
            }
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Ошибка сохранения товара");
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">🍵 Чайная лавка</div>
                    <div className="header__right">Пуэрный рай</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Наш пуэр ({products.length})</h1>
                        <button className="btn btn--primary" onClick={openCreate}>
                            + Добавить пуэр
                        </button>
                    </div>

                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : (
                        <ProductsList 
                            products={products}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">
                    © {new Date().getFullYear()} Чайная лавка
                </div>
            </footer>

            <ProductModal
                open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                categories={categories}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
}

function ProductsList({ products, onEdit, onDelete }) {
    if (!products.length) {
        return <div className="empty">Товаров пока нет</div>;
    }

    return (
        <div className="list">
            {products.map(product => (
                <ProductItem 
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

function ProductItem({ product, onEdit, onDelete }) {
    return (
        <div className="productRow">
            <img src={product.image} alt={product.name} className="productImage" />
            <div className="productMain">
                <div className="productId">#{product.id}</div>
                <div className="productName">{product.name}</div>
                <div className="productCategory">{product.category}</div>
                <div className="productPrice">{product.price} ₽</div>
                <div className="productStock">В наличии: {product.stock}</div>
                <div className="productRating">⭐ {product.rating}</div>
            </div>
            <div className="productActions">
                <button className="btn" onClick={() => onEdit(product)}>
                    Редактировать
                </button>
                <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
                    Удалить
                </button>
            </div>
        </div>
    );
}

function ProductModal({ open, mode, initialProduct, categories, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [rating, setRating] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (!open) return;
        
        setName(initialProduct?.name ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
        setRating(initialProduct?.rating != null ? String(initialProduct.rating) : "");
        setImage(initialProduct?.image ?? "");
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактировать товар" : "Добавить новый пуэр";

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const parsedPrice = Number(price);
        const parsedStock = Number(stock);
        const parsedRating = rating ? Number(rating) : 0;

        if (!trimmedName) {
            alert("Введите название");
            return;
        }

        if (!category) {
            alert("Выберите категорию");
            return;
        }

        if (!parsedPrice || parsedPrice <= 0) {
            alert("Введите корректную цену");
            return;
        }

        if (!parsedStock || parsedStock < 0) {
            alert("Введите корректное количество");
            return;
        }

        onSubmit({
            id: initialProduct?.id,
            name: trimmedName,
            category,
            description,
            price: parsedPrice,
            stock: parsedStock,
            rating: parsedRating,
            image: image || 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
        });
    };

    return (
        <div className="backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose}>✕</button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название
                        <input
                            className="input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Например, Шу Пуэр Золотой"
                            autoFocus
                        />
                    </label>

                    <label className="label">
                        Категория
                        <select
                            className="input"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="">Выберите категорию</option>
                            <option value="Шу Пуэр">Шу Пуэр</option>
                            <option value="Шен Пуэр">Шен Пуэр</option>
                            <option value="Белый Пуэр">Белый Пуэр</option>
                        </select>
                    </label>

                    <label className="label">
                        Описание
                        <textarea
                            className="input"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Описание товара"
                            rows="3"
                        />
                    </label>

                    <label className="label">
                        Цена (₽)
                        <input
                            className="input"
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="1200"
                        />
                    </label>

                    <label className="label">
                        Количество на складе
                        <input
                            className="input"
                            type="number"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            placeholder="10"
                        />
                    </label>

                    <label className="label">
                        Рейтинг (0-5)
                        <input
                            className="input"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                            placeholder="4.5"
                        />
                    </label>

                    <label className="label">
                        URL изображения
                        <input
                            className="input"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            placeholder="https://..."
                        />
                    </label>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}