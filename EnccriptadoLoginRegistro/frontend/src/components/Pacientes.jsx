import api from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaginaListaPacientes() {
    const [PerfilOncologo, setPerfilOncologo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/oncologo/perfil", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setPerfilOncologo(res.data))
            .catch(() => alert("No autorizado"));
    }, []);

    return (
        <div>
            {PerfilOncologo ? (
                <div>
                    <p>ID: {PerfilOncologo.id_usuario}</p>
                    <p>Correo: {PerfilOncologo.correo_electronico}</p>
                    <p>Nombre: {PerfilOncologo.nombre} {PerfilOncologo.apellido}</p>
                    <p>Institución: {PerfilOncologo.institucion}</p>
                    <p>Teléfono: {PerfilOncologo.telefono}</p>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}
