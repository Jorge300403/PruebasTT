import axios from "axios";
import { navigate } from "react-router-dom";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  withCredentials: true // importante para enviar cookies httpOnly (refresh token)
});

// Flag para evitar múltiples refresh simultáneos
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  })
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    // Si no hay respuesta o no es 401, rechaza
    if (!err.response || err.response.status !== 401) {
      return Promise.reject(err);
    }

    // Alert: access token expirado
    alert(" Access token expirado, intentando refrescar...");

    // Evitar loop infinito con la ruta /refresh-token
    if (originalRequest.url.includes("/refrescar-token")) {
      // Falló el refresh -> forzar logout
      alert("Refresh token inválido o expirado, cerrando sesión...");
      localStorage.removeItem("access_token");
      window.location.href = "/sesion-caducada";
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return axios(originalRequest);
      }).catch(e => Promise.reject(e));
    }

    isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        // Alert: haciendo refresh token
        alert(" Haciendo refresh del token...");

        const rs = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/oncologo/refrescar-token`,
          {},
          { withCredentials: true }
        );

        const newToken = rs.data.access_token;

        // Alert: refresh exitoso
        alert("Token refrescado correctamente");

        localStorage.setItem("access_token", newToken);
        api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        processQueue(null, newToken);
        resolve(api(originalRequest));
      } catch (e) {
        processQueue(e, null);
        alert(" No se pudo refrescar el token, cerrando sesión...");
        localStorage.removeItem("access_token");
        window.location.href = "/sesion-caducada";
        reject(e);
      } finally {
        isRefreshing = false;
      }
    });
  }
);

// Agregar interceptor para poner Authorization según lo guardado
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export default api;
