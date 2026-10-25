import { create } from "zustand";
import Cookies from "js-cookie";
import { authApi, userApi } from "@/lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: Cookies.get("accessToken") || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    const { data } = await authApi.login({ email, password });
    Cookies.set("accessToken", data.data.accessToken, { expires: 1 / 96 });
    Cookies.set("refreshToken", data.data.refreshToken, { expires: 7 });
    set({ user: data.data.user, accessToken: data.data.accessToken, loading: false });
  },

  register: async (body) => {
    set({ loading: true });
    await authApi.register(body);
    set({ loading: false });
  },

  logout: async () => {
    const refresh = Cookies.get("refreshToken");
    if (refresh) await authApi.logout(refresh).catch(() => {});
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({ user: null, accessToken: null });
  },

  fetchMe: async () => {
    if (!Cookies.get("accessToken")) return;
    try {
      const { data } = await userApi.getMe();
      set({ user: data.data });
    } catch {
      set({ user: null });
    }
  },

  setUser: (u) => set({ user: u }),
}));
