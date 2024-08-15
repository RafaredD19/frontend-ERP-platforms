import axiosInstance from '@/config/http.config';


const baseURL = process.env.VUE_APP_BASE_URL;



export function findAllProjects(token) {

    return axiosInstance.get(`${baseURL}/projects`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

