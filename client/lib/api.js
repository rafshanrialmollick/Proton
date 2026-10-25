import axios from "axios";
import Cookies from "js-cookie";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({ baseURL: BASE, withCredentials: false });

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = Cookies.get("refreshToken");
        if (!refresh) throw new Error("No refresh token");
        const { data } = await axios.post(`${BASE}/auth/refresh`, { refreshToken: refresh });
        Cookies.set("accessToken", data.data.accessToken, { expires: 1 / 96 });
        Cookies.set("refreshToken", data.data.refreshToken, { expires: 7 });
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const authApi = {
  register: (body) => api.post("/auth/register", body),
  login: (body) => api.post("/auth/login", body),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.patch(`/auth/reset-password/${token}`, { password }),
  changePassword: (body) => api.patch("/auth/change-password", body),
  sendOtp: () => api.post("/auth/send-otp"),
  verifyEmail: (otp) => api.post("/auth/verify-email", { otp }),
};

export const userApi = {
  getMe: () => api.get("/users/me"),
  updateMe: (body) => api.patch("/users/me", body),
  getCart: () => api.get("/users/me/cart"),
  addToCart: (body) => api.post("/users/me/cart", body),
  removeFromCart: (itemId) => api.delete(`/users/me/cart/${itemId}`),
  clearCart: () => api.delete("/users/me/cart"),
  getWishlist: () => api.get("/users/me/wishlist"),
  addToWishlist: (productId) => api.post("/users/me/wishlist", { productId }),
  removeFromWishlist: (productId) => api.delete(`/users/me/wishlist/${productId}`),
  getAddresses: () => api.get("/users/me/addresses"),
  addAddress: (body) => api.post("/users/me/addresses", body),
  removeAddress: (id) => api.delete(`/users/me/addresses/${id}`),
  getAllUsers: (params) => api.get("/users", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  adminUpdateUser: (id, body) => api.patch(`/users/${id}`, body),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const productApi = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  create: (body) => api.post("/products", body),
  update: (id, body) => api.patch(`/products/${id}`, body),
  delete: (id) => api.delete(`/products/${id}`),
};

export const reviewApi = {
  getForProduct: (productId, params) => api.get(`/products/${productId}/reviews`, { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (productId, body) => api.post(`/products/${productId}/reviews`, body),
  update: (id, body) => api.patch(`/reviews/${id}`, body),
  delete: (id) => api.delete(`/reviews/${id}`),
  vote: (id, vote) => api.post(`/reviews/${id}/vote`, { vote }),
  getPending: (params) => api.get("/reviews/pending", { params }),
  approve: (id) => api.patch(`/reviews/${id}/approve`),
  reject: (id, note) => api.patch(`/reviews/${id}/reject`, { note }),
};

export const contactApi = {
  create: (body) => api.post("/contact", body),
  getAll: (params) => api.get("/contact", { params }),
  getMy: (params) => api.get("/contact/my", { params }),
  getById: (id) => api.get(`/contact/${id}`),
  reply: (id, message) => api.post(`/contact/${id}/reply`, { message }),
  rate: (id, score) => api.post(`/contact/${id}/rate`, { score }),
};
