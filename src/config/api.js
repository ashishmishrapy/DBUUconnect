export const API_BASE_URL = import.meta.env.VITE_API_URI;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    CHECK_AUTH: `${API_BASE_URL}/api/auth/check-auth`,
  },
};
