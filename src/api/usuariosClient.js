import axios from "axios";

const usuariosClient = axios.create({
  baseURL: " /api/alumnos",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default usuariosClient;