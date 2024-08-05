import axiosInstance from '@/config/http.config';
import axios from 'axios';

const baseURL = process.env.VUE_APP_BASE_URL;



export function authLoginApi(data) {
    return axios.post(`${baseURL}/auth/login`, data)
}