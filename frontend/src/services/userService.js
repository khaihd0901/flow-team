import api from "@/libs/api";

const userForgotPassword = async (data) => {
  const res = await api.post(`user/forgot-password`, data);
  return res.data;
};
const userVerifyOTP = async (data) =>{
  console.log(data)
    const res = await api.post(`user/verify-otp`, data)
    return res.data
}
const userResetPassword = async (data) =>{
    const res = await api.post(`user/reset-password`, data)
    return res.data
}
const userService = {
  userForgotPassword,
  userVerifyOTP,
  userResetPassword
};
export default userService;
