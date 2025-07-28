// API client utility for Digi Notes frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
    this.refreshPromise = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication token
  getToken() {
    return this.token || localStorage.getItem('authToken');
  }

  // Clear authentication
  clearAuth() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  // Check if token is expired (basic JWT parsing)
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  // Auto-logout if token is expired
  checkTokenValidity() {
    if (this.isTokenExpired()) {
      this.clearAuth();
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
      return false;
    }
    return true;
  }

  // Make HTTP request with proper error handling
  async request(endpoint, options = {}) {
    // Check token validity before making request
    if (this.getToken() && !this.checkTokenValidity()) {
      throw new Error('Session expired. Please log in again.');
    }

    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.clearAuth();
          window.location.href = '/';
          throw new Error('Authentication required. Please log in again.');
        }

        // Handle other HTTP errors
        const errorMessage = data?.message || data || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.setToken(response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response;
  }

  async register(username, email, password) {
    const response = await this.post('/auth/register', { username, email, password });
    if (response.token) {
      this.setToken(response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response;
  }

  async logout() {
    this.clearAuth();
  }

  // Notes methods
  async getNotes() {
    const response = await this.get('/notes');
    return response.data.notes;
  }

  async getNoteById(id) {
    const response = await this.get(`/notes/${id}`);
    return response.data.note;
  }

  async createNote(noteData) {
    const response = await this.post('/notes', noteData);
    return response.data.note;
  }

  async updateNote(id, noteData) {
    const response = await this.patch(`/notes/${id}`, noteData);
    return response.data.note;
  }

  async deleteNote(id) {
    await this.delete(`/notes/${id}`);
  }

  async togglePinNote(id) {
    const response = await this.patch(`/notes/${id}/pin`);
    return response.data.note;
  }

  async toggleArchiveNote(id) {
    const response = await this.patch(`/notes/${id}/archive`);
    return response.data.note;
  }

  // Folders methods
  async getFolders() {
    const response = await this.get('/folders');
    return response.data.folders;
  }

  async getFolderById(id) {
    const response = await this.get(`/folders/${id}`);
    return response.data.folder;
  }

  async createFolder(folderData) {
    const response = await this.post('/folders', folderData);
    return response.data.folder;
  }

  async updateFolder(id, folderData) {
    const response = await this.patch(`/folders/${id}`, folderData);
    return response.data.folder;
  }

  async deleteFolder(id) {
    await this.delete(`/folders/${id}`);
  }

  // Tags methods
  async getTags() {
    const response = await this.get('/tags');
    return response.data.tags;
  }

  async getPopularTags(limit = 10) {
    const response = await this.get(`/tags/popular?limit=${limit}`);
    return response.data.tags;
  }

  async getTagById(id) {
    const response = await this.get(`/tags/${id}`);
    return response.data.tag;
  }

  async createTag(tagData) {
    const response = await this.post('/tags', tagData);
    return response.data.tag;
  }

  async deleteTag(id) {
    await this.delete(`/tags/${id}`);
  }

  // Users methods
  async getCurrentUser() {
    const response = await this.get('/users/me');
    return response.data.user;
  }

  async updateProfile(userData) {
    const response = await this.patch('/users/me', userData);
    return response.data.user;
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote,
  toggleArchiveNote,
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  getTags,
  getPopularTags,
  getTagById,
  createTag,
  deleteTag,
  getCurrentUser,
  updateProfile,
  healthCheck,
} = apiClient;