import api from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaginaListaPacientes() {
    //Definimos los campos que vamos a usar, en este caso debemeosde obtener el perfil del usuario logueado
    const [PerfilOncologo, setPerfilOncologo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        //OBtenemos el token que en este caso es el id del usuario logueado
        const token = localStorage.getItem("token");
        api.get("/oncologo/perfil", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setPerfilOncologo(res.data))
            .catch(() => alert("No autorizado"));
    }, []);

    const handleLogout = () => {
        //Cunado cerramos sesión debemos de eliminar ese token, asi ya no tendra acceso a la recuperacion de los datos
        localStorage.removeItem("token");

        // Redirigir al login
        navigate("/");
    };

    return (
        <div>
            {PerfilOncologo ? (
                <div>
                    <p>ID: {PerfilOncologo.id_usuario}</p>
                    <p>Correo: {PerfilOncologo.correo_electronico}</p>
                    <p>Nombre: {PerfilOncologo.nombre} {PerfilOncologo.apellido}</p>
                    <p>Institución: {PerfilOncologo.institucion}</p>
                    <p>Teléfono: {PerfilOncologo.telefono}</p>
                    <p>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Cerrar sesión
                        </button>
                    </p>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}
