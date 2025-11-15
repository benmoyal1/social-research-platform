/**
 * API Service - Base configuration and utilities for API calls
 */

const API_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Get JWT token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Save JWT token to localStorage
 */
export function saveAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

/**
 * Remove JWT token from localStorage
 */
export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loginTime');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Base fetch wrapper with error handling and authentication
 */
async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Get auth token
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add Authorization header if token exists
  if (token) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid - logout user
      removeAuthToken();
      window.location.reload();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check for token expiration warning
    if (response.headers.get('X-Token-Expiring-Soon')) {
      console.warn('Your session will expire soon. Please save your work.');
    }

    // Check if response is JSON or blob
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType && contentType.includes('text/csv')) {
      return await response.blob() as T;
    }

    return response as T;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * GET request
 */
export async function get<T = any>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function post<T = any>(endpoint: string, data?: any): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Download file helper with authentication
 */
export async function downloadFile(
  endpoint: string,
  filename: string,
  method: 'GET' | 'POST' = 'GET',
  data: any = null
): Promise<void> {
  const url = `${API_URL}${endpoint}`;

  const token = getAuthToken();

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add Authorization header
  if (token) {
    (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  if (method === 'POST' && data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      removeAuthToken();
      window.location.reload();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(`Download Error [${endpoint}]:`, error);
    throw error;
  }
}

export default {
  get,
  post,
  downloadFile,
  saveAuthToken,
  removeAuthToken,
  isAuthenticated,
};
