const express = require('express');
const app = express();
const port = 3003;

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ============================================
// БАЗА ДАННЫХ (массив с разными видами пуэра)
// ============================================
let puerProducts = [
    { 
        id: 1, 
        name: 'Шу Пуэр "Золотой брикет"', 
        price: 1200,
        type: 'Шу Пуэр',
        year: 2018,
        description: 'Мягкий, землистый вкус с нотками шоколада'
    },
    { 
        id: 2, 
        name: 'Шен Пуэр "Дракон весны"', 
        price: 2500,
        type: 'Шен Пуэр',
        year: 2021,
        description: 'Свежий, травянистый с медовыми нотками'
    },
    { 
        id: 3, 
        name: 'Белый Пуэр "Серебряные иглы"', 
        price: 1800,
        type: 'Белый Пуэр',
        year: 2022,
        description: 'Нежный, цветочный аромат с оттенками дыни'
    },
    { 
        id: 4, 
        name: 'Шу Пуэр "Лао Ча Тоу"', 
        price: 3500,
        type: 'Шу Пуэр',
        year: 2015,
        description: 'Пуэрные комочки, плотный сладковатый вкус'
    },
    { 
        id: 5, 
        name: 'Шен Пуэр "И У"', 
        price: 4200,
        type: 'Шен Пуэр',
        year: 2010,
        description: 'Классический регион, выдержанный, с оттенками сухофруктов'
    },
    { 
        id: 6, 
        name: 'Мини Пуэр "Точа"', 
        price: 600,
        type: 'Шу Пуэр',
        year: 2023,
        description: 'Прессованные гнезда для быстрой заварки'
    }
];

// ============================================
// CRUD ОПЕРАЦИИ ДЛЯ ПУЭРА
// ============================================

// 1. CREATE (POST) - Добавление нового пуэра
app.post('/api/puer', (req, res) => {
    try {
        const { name, price, type, year, description } = req.body;
        
        // Валидация данных
        if (!name || !price || !type) {
            return res.status(400).json({ 
                error: 'Не все поля заполнены. Требуются: name, price, type' 
            });
        }
        
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ 
                error: 'Цена должна быть положительным числом' 
            });
        }
        
        // Создаем новый продукт
        const newProduct = {
            id: puerProducts.length > 0 ? Math.max(...puerProducts.map(p => p.id)) + 1 : 1,
            name: name,
            price: price,
            type: type,
            year: year || null,
            description: description || ''
        };
        
        puerProducts.push(newProduct);
        res.status(201).json({
            message: 'Новый пуэр успешно добавлен в коллекцию',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 2. READ ALL (GET) - Получение всего пуэра
app.get('/api/puer', (req, res) => {
    res.json({
        count: puerProducts.length,
        products: puerProducts
    });
});

// 3. READ ONE (GET) - Получение пуэра по ID
app.get('/api/puer/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = puerProducts.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ 
            error: `Пуэр с ID ${id} не найден в коллекции` 
        });
    }
    
    res.json(product);
});

// 4. UPDATE (PATCH) - Обновление информации о пуэре
app.patch('/api/puer/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = puerProducts.find(p => p.id === id);
        
        if (!product) {
            return res.status(404).json({ 
                error: `Пуэр с ID ${id} не найден` 
            });
        }
        
        const { name, price, type, year, description } = req.body;
        
        // Обновляем только переданные поля
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === '') {
                return res.status(400).json({ 
                    error: 'Название должно быть непустой строкой' 
                });
            }
            product.name = name;
        }
        
        if (price !== undefined) {
            if (typeof price !== 'number' || price <= 0) {
                return res.status(400).json({ 
                    error: 'Цена должна быть положительным числом' 
                });
            }
            product.price = price;
        }
        
        if (type !== undefined) {
            product.type = type;
        }
        
        if (year !== undefined) {
            product.year = year;
        }
        
        if (description !== undefined) {
            product.description = description;
        }
        
        res.json({
            message: 'Информация о пуэре обновлена',
            product: product
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 5. DELETE (DELETE) - Удаление пуэра из коллекции
app.delete('/api/puer/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = puerProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
        return res.status(404).json({ 
            error: `Пуэр с ID ${id} не найден` 
        });
    }
    
    const deletedProduct = puerProducts[productIndex];
    puerProducts.splice(productIndex, 1);
    
    res.json({
        message: 'Пуэр удален из коллекции',
        deletedProduct: deletedProduct
    });
});

// ============================================
// ДОПОЛНИТЕЛЬНЫЕ МАРШРУТЫ ДЛЯ ПОИСКА ПУЭРА
// ============================================

// Поиск по типу пуэра
app.get('/api/puer/type/:type', (req, res) => {
    const type = req.params.type;
    const filteredProducts = puerProducts.filter(p => 
        p.type.toLowerCase() === type.toLowerCase()
    );
    
    res.json({
        type: type,
        count: filteredProducts.length,
        products: filteredProducts
    });
});

// Поиск по году
app.get('/api/puer/year/:year', (req, res) => {
    const year = parseInt(req.params.year);
    const filteredProducts = puerProducts.filter(p => p.year === year);
    
    res.json({
        year: year,
        count: filteredProducts.length,
        products: filteredProducts
    });
});

// Поиск по цене
app.get('/api/puer/search/price', (req, res) => {
    const { min, max } = req.query;
    
    let filteredProducts = puerProducts;
    
    if (min) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseInt(min));
    }
    
    if (max) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseInt(max));
    }
    
    res.json({
        count: filteredProducts.length,
        products: filteredProducts
    });
});

// ============================================
// ГЛАВНАЯ СТРАНИЦА
// ============================================
app.get('/', (req, res) => {
    res.send(`
        <h1>🍵 Чайная лавка "Пуэрный рай"</h1>
        <p>API для коллекции разных видов пуэра</p>
        <h2>Доступные маршруты:</h2>
        <ul>
            <li><b>GET /api/puer</b> - все виды пуэра</li>
            <li><b>GET /api/puer/:id</b> - пуэр по ID</li>
            <li><b>GET /api/puer/type/:type</b> - пуэр по типу (Шу Пуэр, Шен Пуэр, Белый Пуэр)</li>
            <li><b>GET /api/puer/year/:year</b> - пуэр по году</li>
            <li><b>GET /api/puer/search/price?min=&max=</b> - поиск по цене</li>
            <li><b>POST /api/puer</b> - добавить новый пуэр</li>
            <li><b>PATCH /api/puer/:id</b> - обновить пуэр</li>
            <li><b>DELETE /api/puer/:id</b> - удалить пуэр</li>
        </ul>
    `);
});

// ============================================
// ОБРАБОТКА ОШИБОК
// ============================================

// Обработка 404 - маршрут не найден
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Маршрут не найден в чайной лавке' 
    });
});

// ============================================
// ЗАПУСК СЕРВЕРА
// ============================================
app.listen(port, () => {
    console.log(`🍵 Чайная лавка запущена на порту ${port}`);
    console.log(`📦 Сервер: http://localhost:${port}`);
    console.log('\n🌱 Доступные виды пуэра:');
    console.log('   GET  /api/puer');
    console.log('   GET  /api/puer/1');
    console.log('   GET  /api/puer/type/Шу Пуэр');
    console.log('   GET  /api/puer/year/2018');
    console.log('   POST /api/puer');
});