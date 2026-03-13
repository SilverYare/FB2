
### Это итоговая работа по практическим занятиям 1-5! Нужно собрать всё воедино.

## ✅ **Чек-лист для сдачи:**

###  **Проверить работоспособность приложения**
- [ ] Сервер запускается (порт 3003)
- [ ] React запускается (порт 3000)
- [ ] API работает (`http://localhost:3003/api/products`)
- [ ] Swagger документация доступна (`http://localhost:3003/api-docs`)
- [ ] Фронтенд загружает товары с сервера
- [ ] Можно создавать/редактировать/удалять товары


```markdown
# 🍵 Интернет-магазин пуэра

Полноценное веб-приложение с React фронтендом и Express бэкендом.

## 📁 Структура проекта

```
fb2/
├── server/              # Бэкенд на Express
│   ├── server.js        # API с Swagger документацией
│   └── package.json
└── client/              # Фронтенд на React
    ├── src/
    │   ├── api/         # API клиент
    │   ├── components/  # React компоненты
    │   └── pages/       # Страницы
    └── package.json
```

## 🚀 Технологии

- **Frontend**: React, Axios, SCSS
- **Backend**: Node.js, Express, nanoid, CORS
- **Документация API**: Swagger UI, swagger-jsdoc

## 📦 Установка и запуск

### Требования
- Node.js
- npm

### Бэкенд
```bash
cd server
npm install
npm start
```
Сервер будет доступен на `http://localhost:3003`
Swagger документация: `http://localhost:3003/api-docs`

### Фронтенд
```bash
cd client
npm install
npm start
```
Приложение откроется на `http://localhost:3000`

## ✨ Функционал

- **Просмотр товаров** - список всех видов пуэра
- **Добавление товара** - создание нового пуэра
- **Редактирование** - изменение информации о товаре
- **Удаление** - удаление товара из коллекции
- **Фильтрация** - просмотр товаров по категориям

## 📊 API Эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/products` | Получить все товары |
| GET | `/api/products/:id` | Получить товар по ID |
| POST | `/api/products` | Создать новый товар |
| PATCH | `/api/products/:id` | Обновить товар |
| DELETE | `/api/products/:id` | Удалить товар |
| GET | `/api/products/category/:category` | Товары по категории |

## 🎯 Выполненные практические работы

- **ПР №1**: CSS-препроцессоры (SCSS в React)
- **ПР №2**: Создание API для товаров
- **ПР №3**: Тестирование API в Postman
- **ПР №4**: Связка React + Express (CRUD)
- **ПР №5**: Swagger документация API
- **ПР №6**: Подготовка к контрольной работе







```bash
cd C:\Users\User\Desktop\fb2
git init
git add .
git remote add origin https://github.com/SilverYare/FB2.git
git branch -M main
git push -u origin main
```

