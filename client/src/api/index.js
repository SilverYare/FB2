import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
    baseURL: 'http://localhost:3003/api',
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

// Перехватчик запросов - добавляем токен автоматически
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Перехватчик ответов - обрабатываем истекший токен
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Если ошибка 401 и это не повторный запрос
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refreshToken');
            const accessToken = localStorage.getItem('accessToken');
            
            // Если нет токенов - перенаправляем на логин
            if (!accessToken || !refreshToken) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }
            
            try {
                // Пытаемся обновить токены
                const response = await axios.post('http://localhost:3003/api/auth/refresh', {
                    refreshToken
                });
                
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
                
                // Сохраняем новые токены
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                
                // Повторяем исходный запрос с новым токеном
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
                
            } catch (refreshError) {
                // Если не удалось обновить токен - чистим хранилище и редирект
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// Функции для работы с API
export const api = {
    // Аутентификация
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: (refreshToken) => apiClient.post('/auth/logout', { refreshToken }),
    getCurrentUser: () => apiClient.get('/auth/me'),
    
    // Товары
    getProducts: () => apiClient.get('/products'),
    getProduct: (id) => apiClient.get(`/products/${id}`),
    createProduct: (product) => apiClient.post('/products', product),
    updateProduct: (id, product) => apiClient.put(`/products/${id}`, product),
    deleteProduct: (id) => apiClient.delete(`/products/${id}`)
};

export default apiClient;