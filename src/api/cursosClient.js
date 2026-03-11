import axios from "axios";

// En dev: las peticiones pasan por el proxy de Vite → sin CORS
// En prod: apunta directamente al microservicio
const cursosClient = axios.create({
  baseURL: "/api/cursos",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de request: agrega token si existe
cursosClient.interceptors.request.use(
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
cursosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default cursosClient;
