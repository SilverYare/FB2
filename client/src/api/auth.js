/**
 * Вспомогательные функции для работы с аутентификацией
 */

// Сохранение токенов и данных пользователя
export const saveAuthData = (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
};

// Очистка данных при выходе
export const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

// Получение access-токена
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

// Получение refresh-токена
export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

// Получение данных пользователя
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Проверка, авторизован ли пользователь
export const isAuthenticated = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    return !!(accessToken && refreshToken);
};

// Обновление access-токена (для использования в перехватчиках)
export const updateAccessToken = (newAccessToken) => {
    localStorage.setItem('accessToken', newAccessToken);
};

// Обновление refresh-токена
export const updateRefreshToken = (newRefreshToken) => {
    localStorage.setItem('refreshToken', newRefreshToken);
};

// Обновление обоих токенов
export const updateTokens = (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

// Проверка, истёк ли токен (упрощённая)
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        // Декодируем payload токена (без проверки подписи)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        // Проверяем время истечения
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
    } catch (e) {
        console.error('Ошибка при проверке токена:', e);
        return true;
    }
};

// Получение заголовка авторизации для запросов
export const getAuthHeader = () => {
    const token = getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Проверка и перенаправление на логин (для компонентов)
export const requireAuth = (navigate) => {
    if (!isAuthenticated()) {
        navigate('/login');
        return false;
    }
    return true;
};