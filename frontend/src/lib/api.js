const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Debug: Log API URL on load
if (typeof window !== 'undefined') {
  console.log('🔗 API URL:', API_URL);
  console.log('🌍 Frontend URL:', window.location.origin);
}

const TOKEN_KEY = "innoventure_token";
const USER_KEY = "innoventure_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const clearUser = () => localStorage.removeItem(USER_KEY);

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const apiRequest = async (path, options = {}) => {
  const {
    method = "GET",
    body,
    token = getToken(),
    headers = {}
  } = options;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const fullUrl = `${API_URL}${path}`;
  console.log(`📡 ${method} ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    });

    const data = await safeJson(response);

    if (!response.ok) {
      const message = data?.message || `Request failed: ${response.status} ${response.statusText}`;
      console.error(`❌ ${method} ${path}:`, message);
      throw new Error(message);
    }

    console.log(`✅ ${method} ${path}:`, data);
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error - backend unreachable
      console.error(`🌐 Network Error - Cannot reach ${API_URL}`);
      throw new Error(`Cannot connect to server. Check if backend is running at ${API_URL}`);
    }
    console.error(`❌ API Error:`, error.message);
    throw error;
  }
};

// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/api/health`, {
      method: 'GET'
    });
    return response.ok;
  } catch {
    return false;
  }
};

export { API_URL };
