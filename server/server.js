const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const bcrypt = require('bcrypt');

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3003;

// Middleware для CORS
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
// ФУНКЦИИ ДЛЯ ХЕШИРОВАНИЯ ПАРОЛЕЙ
// ============================================

async function hashPassword(password) {
    const rounds = 10; // типичное значение для bcrypt
    return bcrypt.hash(password, rounds);
}

async function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

// ============================================
// БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ
// ============================================
let users = [
    {
        id: nanoid(6),
        email: 'admin@teashop.ru',
        first_name: 'Админ',
        last_name: 'Чайный',
        hashedPassword: '$2b$10$k06Hq7ZkfV4cPzGm8u7mEuR7r4Xx2p9mP0q3t1yZbCq9Lh5a8b1Qw' // пароль: admin123
    }
];

// ============================================
// БАЗА ДАННЫХ ТОВАРОВ
// ============================================
let puerProducts = [
    { 
        id: nanoid(6),
        title: 'Шу Пуэр "Золотой брикет"', 
        category: 'Шу Пуэр',
        description: 'Мягкий, землистый вкус с нотками шоколада. Выдержка 5 лет.',
        price: 1200
    },
    { 
        id: nanoid(6),
        title: 'Шен Пуэр "Дракон весны"', 
        category: 'Шен Пуэр',
        description: 'Свежий, травянистый с медовыми нотками. Молодой пуэр 2021 года.',
        price: 2500
    },
    { 
        id: nanoid(6),
        title: 'Белый Пуэр "Серебряные иглы"', 
        category: 'Белый Пуэр',
        description: 'Нежный, цветочный аромат с оттенками дыни. Ручной сбор.',
        price: 1800
    },
    { 
        id: nanoid(6),
        title: 'Шу Пуэр "Лао Ча Тоу"', 
        category: 'Шу Пуэр',
        description: 'Пуэрные комочки, плотный сладковатый вкус. Выдержка 8 лет.',
        price: 3500
    },
    { 
        id: nanoid(6),
        title: 'Шен Пуэр "И У"', 
        category: 'Шен Пуэр',
        description: 'Классический регион, выдержанный, с оттенками сухофруктов. 2010 год.',
        price: 4200
    },
    { 
        id: nanoid(6),
        title: 'Шу Пуэр "Мэнхай"', 
        category: 'Шу Пуэр',
        description: 'Знаменитая фабрика, классический вкус, шоколадно-ореховый.',
        price: 2800
    },
    { 
        id: nanoid(6),
        title: 'Шен Пуэр "Си Шуан Бань На"', 
        category: 'Шен Пуэр',
        description: 'Дикие деревья, яркий фруктовый аромат, долгое послевкусие.',
        price: 5500
    },
    { 
        id: nanoid(6),
        title: 'Пуэр в мандарине', 
        category: 'Шу Пуэр',
        description: 'Пуэр, прессованный в кожуре мандарина, цитрусовый аромат.',
        price: 900
    },
    { 
        id: nanoid(6),
        title: 'Мини-точа "Утренняя роса"', 
        category: 'Шу Пуэр',
        description: 'Удобные гнезда для одной заварки, мягкий вкус.',
        price: 600
    },
    { 
        id: nanoid(6),
        title: 'Шен Пуэр "Горы Цзиньма"', 
        category: 'Шен Пуэр',
        description: 'Элитный пуэр из старых деревьев, цветочный аромат.',
        price: 6800
    }
];

// ============================================
// SWAGGER CONFIGURATION
// ============================================

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '🍵 API Чайной лавки с аутентификацией',
            version: '1.0.0',
            description: 'API для управления пользователями и товарами (пуэр)',
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
                User: {
                    type: 'object',
                    required: ['email', 'first_name', 'last_name', 'password'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Уникальный ID пользователя'
                        },
                        email: {
                            type: 'string',
                            description: 'Email пользователя (логин)'
                        },
                        first_name: {
                            type: 'string',
                            description: 'Имя'
                        },
                        last_name: {
                            type: 'string',
                            description: 'Фамилия'
                        }
                    }
                },
                Product: {
                    type: 'object',
                    required: ['title', 'category', 'price'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Уникальный ID товара'
                        },
                        title: {
                            type: 'string',
                            description: 'Название пуэра'
                        },
                        category: {
                            type: 'string',
                            description: 'Категория пуэра',
                            enum: ['Шу Пуэр', 'Шен Пуэр', 'Белый Пуэр']
                        },
                        description: {
                            type: 'string',
                            description: 'Описание товара'
                        },
                        price: {
                            type: 'number',
                            description: 'Цена в рублях'
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
                name: 'Auth',
                description: 'Регистрация и авторизация'
            },
            {
                name: 'Products',
                description: 'Управление товарами (пуэр)'
            }
        ]
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Чайная лавка - API документация'
}));

// ============================================
// ФУНКЦИИ-ПОМОЩНИКИ
// ============================================

function findUserByEmail(email, res) {
    const user = users.find(u => u.email === email);
    if (!user) {
        if (res) res.status(404).json({ error: "Пользователь не найден" });
        return null;
    }
    return user;
}

function findProductOr404(id, res) {
    const product = puerProducts.find(p => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Товар не найден" });
        return null;
    }
    return product;
}

// ============================================
// МАРШРУТЫ ДЛЯ АУТЕНТИФИКАЦИИ
// ============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               first_name:
 *                 type: string
 *                 example: Иван
 *               last_name:
 *                 type: string
 *                 example: Иванов
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *       400:
 *         description: Ошибка валидации или email уже существует
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/auth/register", async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    // Проверка обязательных полей
    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({ 
            error: "email, first_name, last_name and password are required" 
        });
    }

    // Проверка, существует ли уже пользователь с таким email
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
    }

    // Хешируем пароль и создаем пользователя
    const hashedPassword = await hashPassword(password);
    const newUser = {
        id: nanoid(6),
        email: email,
        first_name: first_name,
        last_name: last_name,
        hashedPassword: hashedPassword
    };

    users.push(newUser);
    
    // Не возвращаем хеш пароля в ответе
    const userResponse = {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name
    };
    
    res.status(201).json(userResponse);
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *       400:
 *         description: Отсутствуют обязательные поля
 *       401:
 *         description: Неверный пароль
 *       404:
 *         description: Пользователь не найден
 */
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    const user = findUserByEmail(email, res);
    if (!user) return;

    const isAuthenticated = await verifyPassword(password, user.hashedPassword);
    
    if (isAuthenticated) {
        // Не возвращаем хеш пароля
        const userResponse = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        };
        res.status(200).json({ 
            login: true,
            user: userResponse
        });
    } else {
        res.status(401).json({ error: "Invalid password" });
    }
});

// ============================================
// CRUD ОПЕРАЦИИ ДЛЯ ТОВАРОВ
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
 *               - title
 *               - category
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 */
app.post('/api/products', (req, res) => {
    try {
        const { title, category, description, price } = req.body;
        
        if (!title || !category || !price) {
            return res.status(400).json({ 
                error: 'Не все поля заполнены. Требуются: title, category, price' 
            });
        }
        
        const newProduct = {
            id: nanoid(6),
            title: title.trim(),
            category,
            description: description || '',
            price: Number(price)
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
 *   put:
 *     summary: Полностью обновить товар
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
 *             required:
 *               - title
 *               - category
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Товар обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.put('/api/products/:id', (req, res) => {
    try {
        const id = req.params.id;
        const index = puerProducts.findIndex(p => p.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: "Товар не найден" });
        }
        
        const { title, category, description, price } = req.body;
        
        if (!title || !category || !price) {
            return res.status(400).json({ 
                error: 'Не все поля заполнены. Требуются: title, category, price' 
            });
        }
        
        puerProducts[index] = {
            id: id,
            title: title.trim(),
            category,
            description: description || '',
            price: Number(price)
        };
        
        res.json(puerProducts[index]);
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
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
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
    console.log('   POST   /api/auth/register  - регистрация');
    console.log('   POST   /api/auth/login     - вход');
    console.log('   GET    /api/products       - все товары');
    console.log('   GET    /api/products/:id   - товар по ID');
    console.log('   POST   /api/products       - создать товар');
    console.log('   PUT    /api/products/:id   - обновить товар');
    console.log('   DELETE /api/products/:id   - удалить товар');
});