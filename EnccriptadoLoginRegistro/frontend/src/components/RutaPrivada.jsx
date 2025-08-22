import { Navigate } from "react-router-dom";

export default function PaginaRutaPrivada({ children }) {
    //Primero debemos de obtener el token para verificar que haya uno
    const token = localStorage.getItem("token");

    if (!token) {
        // Si no hay token, mostrar mensaje y mandar al login
        alert("Sesión caducada. Por favor, inicia sesión de nuevo.");
        return <Navigate to="/" />;
    }

    return children;
}
