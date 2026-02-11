const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  const data = await safeJson(response);

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

export { API_URL };
