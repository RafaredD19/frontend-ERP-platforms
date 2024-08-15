import axiosInstance from '@/config/http.config';


const baseURL = process.env.VUE_APP_BASE_URL;



export function findAllMasters(token) {

    return axiosInstance.get(`${baseURL}/masters`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export function requiredFieldsMasters(token , payload) {

    return axiosInstance.post(`${baseURL}/masters/requiredFields`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export function createMasters(token , payload) {

    return axiosInstance.post(`${baseURL}/masters`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export function deleteMasters(token , _id) {

    return axiosInstance.delete(`${baseURL}/masters/${_id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}




