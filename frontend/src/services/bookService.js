import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const bookService = {
  getAllBooks: async () => {
    const response = await axios.get(`${API_URL}/admin/books`);
    return response.data;
  },

  addBook: async (bookData) => {
    const response = await axios.post(`${API_URL}/admin/books`, bookData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await axios.put(`${API_URL}/admin/books/${id}`, bookData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await axios.delete(`${API_URL}/admin/books/${id}`);
    return response.data;
  }
};

export default bookService;