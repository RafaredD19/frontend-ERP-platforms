import axiosInstance from '@/config/http.config';


const baseURL = process.env.VUE_APP_BASE_URL;



export function findAllCompanies(token) {

    return axiosInstance.get(`${baseURL}/companies`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}



export function requiredFieldsCompany(token , payload) {

    return axiosInstance.post(`${baseURL}/companies/requiredFields`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

 export function createCompany(token , payload) {

    return axiosInstance.post(`${baseURL}/companies`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
     })
}



export function updateCompany(token ,id, payload) {

    return axiosInstance.patch(`${baseURL}/companies/${id}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
     })
}

export function deleteMasters(token , _id) {

    return axiosInstance.delete(`${baseURL}/companies/${_id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export function findRecourses(token  ) {

    return axiosInstance.get(`${baseURL}/companies/recourses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}






