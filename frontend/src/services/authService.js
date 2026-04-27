import api from "@/libs/api";

const authRegister = async (data) => {
  const res = await api.post(`auth/register`, data);
  return res.data;
};
const authLogin = async (data) => {
  const res = await api.post(`auth/login`, data);
  return res.data;
};
const authMe = async () => {
  const res = await api.get(`user/me`);
  return res.data.user;
};
const authRefreshToken = async () => {
  const res = await api.post(`auth/refresh-token`);
  return res.data.accessToken;
};
const authLogout = async () => {
  return await api.post(`auth/logout`);
};

const authService = {
  authRegister,
  authLogin,
  authMe,
  authRefreshToken,
  authLogout,
};
export default authService;
