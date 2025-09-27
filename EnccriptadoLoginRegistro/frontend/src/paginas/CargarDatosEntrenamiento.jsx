import api from "../services/api";
import usuarioGenericoImg from "../imagenes/usuario-generico.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaginaCargarDatosEntrenamiento() {
    // Estados separados
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();






    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };






    return (
        <div className="container-fluid row w-100" style={{ height: "90vh" }}>
            {/* Card izquierda */}
            <div className="col-12 col-md-3 d-flex p-5">
                <div
                    className="card text-white flex-fill shadow-lg"
                    id="card-menu-datos"
                    style={{ height: "100%", overflowX: "hidden" }}
                >
                    <div className="card-body d-flex flex-column justify-content-between">
                        {/* Parte superior */}
                        <div className="text-center">
                            <h1 className="mt-4">¡Bienvenido Administrador!</h1>
                            <img
                                src={usuarioGenericoImg}
                                alt="Usuario Genérico"
                                className="img-fluid mt-4"
                                style={{ maxWidth: "50%" }}
                            />
                            <h5>Editar</h5>
                        </div>

                        {/* Links de navegación */}
                        <div className="ms-4 mb-4">
                            <div
                                onClick={() => navigate("/administrador/lista-oncologos")}
                                className="link-card-menu d-flex align-items-center mb-4"
                            >
                                <i
                                    className="bi bi-list"
                                    style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}
                                ></i>
                                <h5 className="mb-0 label-editar-oncologo">Lista oncologos</h5>
                            </div>
                        </div>

                        {/* Botón logout */}
                        <div className="text-center mb-4">
                            <button className="btn btn-light mb-2" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>




            {/* Card de la derecha */}
            <div className="col-12 col-md-9 d-flex align-items-center justify-content-center p-5">
                <div className="card text-white w-100 shadow-lg" id="card-form-datos-oncologo">
                    <div className="card-body">
                        Cargar datos de entrenamiento
                    </div>
                </div>
            </div>
        </div>

    );
}
