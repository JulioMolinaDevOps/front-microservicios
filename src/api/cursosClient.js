import axios from "axios";

const cursosClient = axios.create({
  baseURL: "/api/cursos",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default cursosClient;