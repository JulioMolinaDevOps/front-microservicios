import axios from "axios";

// En dev: las peticiones pasan por el proxy de Vite → sin CORS
// En prod: apunta directamente al microservicio
const usuariosClient = axios.create({
  baseURL: "/api/alumnos",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de request: agrega token si existe
usuariosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de response: manejo global de errores
usuariosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default usuariosClient;
