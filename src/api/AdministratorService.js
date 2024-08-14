import axiosInstance from '@/config/http.config';


const baseURL = process.env.VUE_APP_BASE_URL;



export function findAllMasters(token) {

    return axiosInstance.get(`${baseURL}/masters`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

