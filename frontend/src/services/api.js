import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

export const studentAPI = {
    getDashboard: () => api.get('/student/dashboard'),
    getBooks: () => api.get('/student/books'),
    getBorrowings: () => api.get('/student/borrowings'),
    getAttendance: () => api.get('/student/attendance'),
    borrowBook: (bookId) => api.post('/student/borrow', { bookId }),
    returnBook: (borrowingId) => api.post('/student/return', { borrowingId })
};

export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getStudents: () => api.get('/admin/students'),
    addBook: (bookData) => api.post('/admin/books', bookData),
    updateBook: (id, bookData) => api.put(`/admin/books/${id}`, bookData),
    deleteBook: (id) => api.delete(`/admin/books/${id}`),
    getBorrowings: () => api.get('/admin/borrowings'),
    getReports: () => api.get('/admin/reports')
};

export default api;