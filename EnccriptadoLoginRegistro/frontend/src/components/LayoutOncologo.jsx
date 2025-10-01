import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import usuarioGenericoImg from "../imagenes/usuario-generico.jpg";


export default function LayoutOncologo() {

    const [isMobile, setIsMobile] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Función para actualizar el estado según el ancho de pantalla
        const handleResize = () => setIsMobile(window.innerWidth <= 768); // ejemplo: menor o igual a 768px = móvil
        handleResize(); // inicializa el estado al montar

        window.addEventListener("resize", handleResize); // escucha cambios de tamaño
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="d-flex flex-column contenedor-pantalla">

            {/* Header fijo */}
            <header
                className="w-100 text-white d-flex justify-content-center align-items-center"  >
                {isMobile ? (
                    <h1 className="texto-blanco">SR-DTCM - Mobile</h1>
                ) : (
                    <h1 className="texto-blanco">SR-DTCM</h1>
                )}
            </header>

            {/* Contenedor scrollable */}
            <div className="contenedor-scrollable">

                {/* Main (80% de viewport) */}
                <main className="d-flex contenedor-main">
                    <div className="container-fluid row contenedor-prinipal">
                        {/* Card izquierda */}
                        <div className="col-12 col-md-3 d-none d-md-flex  contenedor-columna d-flex justify-content-center align-items-center">
                            <div className="card col-12 col-md-10 shadow-lg d-flex flex-column justify-content-between" id="card-menu">

                                {/* Parte superior */}
                                <div className="text-center">
                                    <h1 className="text-center texto-blanco m-5">¡Bienvenido! !</h1>
                                    <img
                                        src={usuarioGenericoImg}
                                        alt="Usuario Genérico"
                                        className="img-fluid mt-4"
                                        style={{ maxWidth: "50%" }}
                                    />
                                    <h5 className="texto-blanco">Editar</h5>
                                </div>

                                {/* Links de navegación */}
                                <div className="mx-4 mb-4">
                                    <div
                                        onClick={() => navigate("/oncologo/datos-perfil")}
                                        className="link-card-menu d-flex align-items-center mb-4"
                                    >
                                        <i
                                            className="bi bi-person"
                                            style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}
                                        ></i>
                                        <p className="mb-0 label-editar-oncologo texto-blanco fs-5">Ver perfil</p>
                                    </div>
                                    <div
                                        onClick={() => navigate("/oncologo/lista-pacientes")}
                                        className="link-card-menu d-flex align-items-center mb-4"
                                    >
                                        <i
                                            className="bi bi-list"
                                            style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}
                                        ></i>
                                        <p className="mb-0 label-editar-oncologo texto-blanco fs-5">Ver pacientes</p>
                                    </div>

                                    <div className="link-card-menu d-flex align-items-center mb-3">
                                        <i
                                            className="bi bi-plus-circle"
                                            style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}
                                        ></i>
                                        <p className="mb-0 label-editar-oncologo texto-blanco fs-5">Hacer análisis</p>
                                    </div>
                                </div>

                                {/* Botón logout */}
                                <div className="text-center my-4">
                                    <button type="submit" className="btn btn-lg mt-3 boton-blanco" onClick={handleLogout}>Cerrar sesión</button>
                                </div>
                            </div>
                        </div>



                        {/*Card de la derecha */}
                        <div className="col-12 col-md-9 contenedor-columna d-flex justify-content-center align-items-center">
                            <Outlet />
                        </div>
                    </div>
                </main>

                {/* Footer (se ve al hacer scroll) */}
                <footer className="w-100 bg-dark text-white py-2 text-center"                >
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                </footer>
            </div>
        </div>
    );
}
