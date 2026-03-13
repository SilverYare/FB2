const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3003;

// Middleware для CORS - разрешаем запросы от React (порт 3000)
app.use(cors({ 
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// ============================================
// SWAGGER CONFIGURATION
// ============================================

// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '🍵 API Чайной лавки (Пуэр)',
            version: '1.0.0',
            description: 'API для управления коллекцией разных видов пуэра',
            contact: {
                name: 'Чайная лавка',
                email: 'info@teashop.ru'
            }
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер'
            }
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    required: ['name', 'category', 'price', 'stock'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Уникальный ID товара',
                            example: 'abc123'
                        },
                        name: {
                            type: 'string',
                            description: 'Название пуэра',
                            example: 'Шу Пуэр "Золотой брикет"'
                        },
                        category: {
                            type: 'string',
                            description: 'Категория пуэра',
                            enum: ['Шу Пуэр', 'Шен Пуэр', 'Белый Пуэр'],
                            example: 'Шу Пуэр'
                        },
                        description: {
                            type: 'string',
                            description: 'Описание товара',
                            example: 'Мягкий, землистый вкус с нотками шоколада'
                        },
                        price: {
                            type: 'number',
                            description: 'Цена в рублях',
                            example: 1200
                        },
                        stock: {
                            type: 'integer',
                            description: 'Количество на складе',
                            example: 15
                        },
                        rating: {
                            type: 'number',
                            description: 'Рейтинг товара (0-5)',
                            example: 4.5
                        },
                        image: {
                            type: 'string',
                            description: 'URL изображения',
                            example: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Сообщение об ошибке'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Products',
                description: 'Управление товарами (пуэр)'
            }
        ]
    },
    // Путь к файлам с JSDoc комментариями
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Чайная лавка - API документация'
}));

// ============================================
// БАЗА ДАННЫХ (минимум 10 товаров)
// ============================================
let puerProducts = [
    { 
        id: nanoid(6),
        name: 'Шу Пуэр "Золотой брикет"', 
        category: 'Шу Пуэр',
        description: 'Мягкий, землистый вкус с нотками шоколада. Выдержка 5 лет.',
        price: 1200,
        stock: 15,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Шен Пуэр "Дракон весны"', 
        category: 'Шен Пуэр',
        description: 'Свежий, травянистый с медовыми нотками. Молодой пуэр 2021 года.',
        price: 2500,
        stock: 8,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Белый Пуэр "Серебряные иглы"', 
        category: 'Белый Пуэр',
        description: 'Нежный, цветочный аромат с оттенками дыни. Ручной сбор.',
        price: 1800,
        stock: 12,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Шу Пуэр "Лао Ча Тоу"', 
        category: 'Шу Пуэр',
        description: 'Пуэрные комочки, плотный сладковатый вкус. Выдержка 8 лет.',
        price: 3500,
        stock: 5,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Шен Пуэр "И У"', 
        category: 'Шен Пуэр',
        description: 'Классический регион, выдержанный, с оттенками сухофруктов. 2010 год.',
        price: 4200,
        stock: 3,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Шу Пуэр "Мэнхай"', 
        category: 'Шу Пуэр',
        description: 'Знаменитая фабрика, классический вкус, шоколадно-ореховый.',
        price: 2800,
        stock: 10,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Шен Пуэр "Си Шуан Бань На"', 
        category: 'Шен Пуэр',
        description: 'Дикие деревья, яркий фруктовый аромат, долгое послевкусие.',
        price: 5500,
        stock: 4,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Пуэр в мандарине', 
        category: 'Шу Пуэр',
        description: 'Пуэр, прессованный в кожуре мандарина, цитрусовый аромат.',
        price: 900,
        stock: 20,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Мини-точа "Утренняя роса"', 
        category: 'Шу Пуэр',
        description: 'Удобные гнезда для одной заварки, мягкий вкус.',
        price: 600,
        stock: 50,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    },
    { 
        id: nanoid(6),
        name: 'Шен Пуэр "Горы Цзиньма"', 
        category: 'Шен Пуэр',
        description: 'Элитный пуэр из старых деревьев, цветочный аромат.',
        price: 6800,
        stock: 2,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
    }
];

// Функция-помощник для поиска товара
function findProductOr404(id, res) {
    const product = puerProducts.find(p => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Товар не найден" });
        return null;
    }
    return product;
}

// ============================================
// CRUD ОПЕРАЦИИ С SWAGGER ДОКУМЕНТАЦИЕЙ
// ============================================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список всех товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
    res.json(puerProducts);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/products', (req, res) => {
    try {
        const { name, category, description, price, stock, rating, image } = req.body;
        
        if (!name || !category || !price || !stock) {
            return res.status(400).json({ 
                error: 'Не все поля заполнены. Требуются: name, category, price, stock' 
            });
        }
        
        const newProduct = {
            id: nanoid(6),
            name: name.trim(),
            category,
            description: description || '',
            price: Number(price),
            stock: Number(stock),
            rating: rating || 0,
            image: image || 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200'
        };
        
        puerProducts.push(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch('/api/products/:id', (req, res) => {
    try {
        const id = req.params.id;
        const product = findProductOr404(id, res);
        if (!product) return;
        
        const { name, category, description, price, stock, rating, image } = req.body;
        
        if (name !== undefined) product.name = name.trim();
        if (category !== undefined) product.category = category;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = Number(price);
        if (stock !== undefined) product.stock = Number(stock);
        if (rating !== undefined) product.rating = Number(rating);
        if (image !== undefined) product.image = image;
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const exists = puerProducts.some(p => p.id === id);
    
    if (!exists) {
        return res.status(404).json({ error: "Товар не найден" });
    }
    
    puerProducts = puerProducts.filter(p => p.id !== id);
    res.status(204).send();
});

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Получить товары по категории
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Категория товара (Шу Пуэр, Шен Пуэр, Белый Пуэр)
 *     responses:
 *       200:
 *         description: Список товаров в категории
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products/category/:category', (req, res) => {
    const category = req.params.category;
    const filtered = puerProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
    );
    res.json(filtered);
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`🍵 Чайная лавка запущена на http://localhost:${port}`);
    console.log(`📚 Swagger документация: http://localhost:${port}/api-docs`);
    console.log('📦 Маршруты:');
    console.log('   GET    /api/products');
    console.log('   GET    /api/products/:id');
    console.log('   POST   /api/products');
    console.log('   PATCH  /api/products/:id');
    console.log('   DELETE /api/products/:id');
    console.log('   GET    /api/products/category/:category');
});