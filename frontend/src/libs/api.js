import axios from "axios";

import { useAuthStore } from "../stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const {accessToken} = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use((res) => res, async(error) =>{
  const originalRequest = error.config;

  if(originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/register') || originalRequest.url.includes('/auth/refresh-token') ){
    return Promise.reject(error)
  }

  originalRequest._retryCount = originalRequest._retryCount || 0

  if(error.response?.status === 403 && originalRequest._retryCount < 4){
    originalRequest._retryCount += 1;
    try{
      const res = await api.post('/auth/refresh-token');
      const newAccessToken = res.data.accessToken;

      useAuthStore.getState.setAccessToken(newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest)
    }catch(refreshError){
      useAuthStore.getState().clearState();
      return Promise.reject(refreshError)
    }
  }

  return Promise.reject(error)
})

export default api;