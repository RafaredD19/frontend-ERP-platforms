import axios from "axios";

const axiosInstance = axios.create({
  // Aquí puedes agregar cualquier configuración adicional que necesites
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
