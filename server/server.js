const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3003;

// ============================================
// JWT CONFIGURATION
// ============================================
const JWT_SECRET = "your-secret-key-change-this-in-production";
const REFRESH_SECRET = "your-refresh-secret-key-change-this-in-production"; // <-- НОВОЕ
const ACCESS_EXPIRES_IN = "15m"; // 15 минут
const REFRESH_EXPIRES_IN = "7d";  // 7 дней <-- НОВОЕ

// Хранилище активных refresh-токенов (в реальном проекте используй БД) <-- НОВОЕ
let refreshTokens = new Set();

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
// ФУНКЦИИ ДЛЯ ГЕНЕРАЦИИ ТОКЕНОВ (ОБНОВЛЕНО)
// ============================================
function generateAccessToken(user) {
    return jwt.sign(
        { 
            sub: user.id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { 
            sub: user.id,
            email: user.email
        },
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES_IN }
    );
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
function authMiddleware(req, res, next) {
    const header = req.headers.authorization || "";
    
    const [scheme, token] = header.split(" ");
    
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ 
            error: "Missing or invalid Authorization header" 
        });
    }
    
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ 
            error: "Invalid or expired token" 
        });
    }
}

// ============================================
// ФУНКЦИИ ДЛЯ ХЕШИРОВАНИЯ ПАРОЛЕЙ
// ============================================
async function hashPassword(password) {
    const rounds = 10;
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
            title: '🍵 API Чайной лавки с Refresh токенами',
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
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['email', 'first_name', 'last_name', 'password'],
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' }
                    }
                },
                Product: {
                    type: 'object',
                    required: ['title', 'category', 'price'],
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        category: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' }
                    }
                },
                AuthResponse: {  // <-- НОВОЕ
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        },
        tags: [
            { name: 'Auth', description: 'Регистрация и авторизация' },
            { name: 'Products', description: 'Управление товарами (пуэр)' }
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
    if (!user && res) {
        res.status(404).json({ error: "Пользователь не найден" });
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
// МАРШРУТЫ ДЛЯ АУТЕНТИФИКАЦИИ (ОБНОВЛЕНО)
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
 *               email: { type: string, example: user@example.com }
 *               first_name: { type: string, example: Иван }
 *               last_name: { type: string, example: Иванов }
 *               password: { type: string, example: qwerty123 }
 *     responses:
 *       201: { description: Пользователь успешно создан }
 *       400: { description: Ошибка валидации }
 */
app.post("/api/auth/register", async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({ 
            error: "email, first_name, last_name and password are required" 
        });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
        id: nanoid(6),
        email: email,
        first_name: first_name,
        last_name: last_name,
        hashedPassword: hashedPassword
    };

    users.push(newUser);
    
    res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name
    });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему (получение пары токенов)
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
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: qwerty123 }
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401: { description: Неверные учетные данные }
 */
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    const user = findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await verifyPassword(password, user.hashedPassword);
    
    if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Генерируем оба токена
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Сохраняем refresh токен
    refreshTokens.add(refreshToken);
    
    const userResponse = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    };
    
    res.status(200).json({ 
        accessToken,
        refreshToken,  // <-- НОВОЕ
        user: userResponse
    });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновление пары токенов
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Новая пара токенов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *                 refreshToken: { type: string }
 *       401: { description: Невалидный refresh токен }
 */
app.post("/api/auth/refresh", (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(400).json({ error: "refreshToken is required" });
    }
    
    // Проверяем, есть ли токен в хранилище
    if (!refreshTokens.has(refreshToken)) {
        return res.status(401).json({ error: "Invalid refresh token" });
    }
    
    try {
        // Верифицируем refresh токен
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        
        // Находим пользователя
        const user = users.find(u => u.id === payload.sub);
        
        if (!user) {
            refreshTokens.delete(refreshToken);
            return res.status(401).json({ error: "User not found" });
        }
        
        // Ротация токенов: удаляем старый refresh, создаём новые
        refreshTokens.delete(refreshToken);
        
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        
        refreshTokens.add(newRefreshToken);
        
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
        
    } catch (err) {
        // Если токен невалидный, удаляем его из хранилища
        refreshTokens.delete(refreshToken);
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход из системы (инвалидация refresh токена)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Успешный выход }
 */
app.post("/api/auth/logout", (req, res) => {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
        refreshTokens.delete(refreshToken);
    }
    
    res.json({ message: "Logged out successfully" });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401: { description: Не авторизован }
 */
app.get("/api/auth/me", authMiddleware, (req, res) => {
    const userId = req.user.sub;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    });
});

// ============================================
// CRUD ОПЕРАЦИИ ДЛЯ ТОВАРОВ
// ============================================

// ... (все маршруты для товаров остаются без изменений) ...

app.get('/api/products', (req, res) => {
    res.json(puerProducts);
});

app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    res.json(product);
});

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
    console.log('   POST   /api/auth/login     - вход (получение пары токенов)');
    console.log('   POST   /api/auth/refresh   - обновление пары токенов');
    console.log('   POST   /api/auth/logout    - выход');
    console.log('   GET    /api/auth/me        - данные текущего пользователя');
    console.log('   GET    /api/products       - все товары');
    console.log('   GET    /api/products/:id   - товар по ID');
    console.log('   POST   /api/products       - создать товар');
    console.log('   PUT    /api/products/:id   - обновить товар');
    console.log('   DELETE /api/products/:id   - удалить товар');
});