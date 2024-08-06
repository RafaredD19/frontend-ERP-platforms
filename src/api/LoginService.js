import axiosInstance from '@/config/http.config';


const baseURL = process.env.VUE_APP_BASE_URL;



export function authLoginApi(data) {
    console.log(data)
    return axiosInstance.post(`${baseURL}/auth/login/web`, data)
}