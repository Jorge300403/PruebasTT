import api from "../../services/api";
import usuarioGenericoImg from "../../imagenes/usuario-generico.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaginaListaPacientes() {
    // Estados separados
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();





    // Obtener perfil
    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/oncologo/perfil", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setNombre(res.data.nombre);
            })
            .catch(() => {
                alert("Sesion caducada");
                localStorage.removeItem("token");
                navigate("/")
            });
    }, []);





    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };






    return (
        <div className="card col-12 col-md-11 shadow-lg d-flex flex-column justify-content-between" id="card-datos-perfil">
        Aqui va a ir la lista de los pacientes
        </div>
    );
}
