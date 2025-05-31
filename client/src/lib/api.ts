const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // This is important for handling cookies/sessions
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: any) => fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data: any) => fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    logout: () => fetchApi('/auth/logout', {
      method: 'POST',
    }),
    getCurrentUser: () => fetchApi('/auth/user'),
  },
}; 