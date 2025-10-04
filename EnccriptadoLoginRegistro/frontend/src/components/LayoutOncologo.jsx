import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import usuarioGenericoImg from "../imagenes/usuario-generico.jpg";

export default function LayoutOncologo() {
    //Definimos las varibale spara navegacion
    const navigate = useNavigate();
    const location = useLocation();

    //Definimos la varibales 
    const [esCelular, setEsCelular] = useState(false);

    //Definimos la funcion para obtener el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => setEsCelular(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    //Funcion para ver cerrar sesion
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const esActivo = (path) => location.pathname === path ? "activo" : "";

    return (
        <div className="d-flex flex-column contenedor-pantalla">

            {/* Header fijo */}
            <header className="w-100 d-flex justify-content-between align-items-center p-3">
                <h1 className="texto-blanco">SR-DTCM</h1>
                {esCelular && (
                    <button
                        className="btn boton-azul"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#menuOffcanvas"
                        aria-controls="menuOffcanvas"
                    >
                        <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
                    </button>
                )}
            </header>

            {/* Contenedor scrollable */}
            <div className="contenedor-scrollable">
                <main className="d-flex contenedor-main">
                    <div className="container-fluid row contenedor-prinipal">

                        {/* Card izquierda (solo desktop) */}
                        <div className="col-12 col-md-3 d-none d-md-flex contenedor-columna justify-content-center align-items-center">
                            <div className="card col-12 col-md-10 shadow-lg d-flex flex-column justify-content-between" id="card-menu">
                                {/* Parte superior */}
                                <div className="text-center">
                                    <h1 className="text-center texto-blanco m-5">¡Bienvenido!</h1>
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
                                        className={`link-card-menu d-flex align-items-center mb-4 ${esActivo("/oncologo/datos-perfil")}`}
                                    >
                                        <i className="bi bi-person" style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}></i>
                                        <p className="mb-0 label-editar-oncologo texto-blanco fs-5">Ver perfil</p>
                                    </div>

                                    <div
                                        onClick={() => navigate("/oncologo/lista-pacientes")}
                                        className={`link-card-menu d-flex align-items-center mb-4 ${esActivo("/oncologo/lista-pacientes")}`}
                                    >
                                        <i className="bi bi-list" style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}></i>
                                        <p className="mb-0 label-editar-oncologo texto-blanco fs-5">Ver pacientes</p>
                                    </div>

                                    <div
                                        onClick={() => navigate("/oncologo/registrar-paciente")}
                                        className={`link-card-menu d-flex align-items-center mb-4 ${esActivo("/oncologo/registrar-paciente")}`}
                                    >
                                        <i className="bi bi-plus-circle" style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}></i>
                                        <p className="mb-0 label-editar-oncologo texto-blanco fs-5">Hacer análisis</p>
                                    </div>
                                </div>

                                {/* Botón logout */}
                                <div className="text-center my-4">
                                    <button type="submit" className="btn btn-lg mt-3 boton-blanco" onClick={handleLogout}>Cerrar sesión</button>
                                </div>
                            </div>
                        </div>

                        {/* Offcanvas para móvil */}
                        <div
                            className="offcanvas offcanvas-start text-white offcanvas-azul"
                            tabIndex="-1"
                            id="menuOffcanvas"
                            aria-labelledby="menuOffcanvasLabel"
                            data-bs-backdrop="static"
                        >
                            <div className="offcanvas-header">
                                <button
                                    type="button text-white"
                                    className="btn-close btn-close-white"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="offcanvas-body d-flex flex-column justify-content-between">
                                {/* Parte superior */}
                                <div className="text-center">
                                    <h1 className="text-center texto-blanco m-3">¡Bienvenido!</h1>
                                    <img
                                        src={usuarioGenericoImg}
                                        alt="Usuario Genérico"
                                        className="img-fluid mt-3"
                                        style={{ maxWidth: "40%" }}
                                    />
                                    <h5 className="texto-blanco">Editar</h5>
                                </div>

                                {/* Links */}
                                <div className="mx-2 my-4">
                                    <div
                                        onClick={() => navigate("/oncologo/datos-perfil")}
                                        data-bs-dismiss="offcanvas"
                                        className={`link-card-menu d-flex align-items-center mb-4 ${esActivo("/oncologo/datos-perfil")}`}
                                    >
                                        <i className="bi bi-person me-2" style={{ fontSize: "1.5rem" }}></i>
                                        <p className="mb-0 texto-blanco fs-5">Ver perfil</p>
                                    </div>
                                    <div
                                        onClick={() => navigate("/oncologo/lista-pacientes")}
                                        data-bs-dismiss="offcanvas"
                                        className={`link-card-menu d-flex align-items-center mb-4 ${esActivo("/oncologo/lista-pacientes")}`}
                                    >
                                        <i className="bi bi-list me-2" style={{ fontSize: "1.5rem" }}></i>
                                        <p className="mb-0 texto-blanco fs-5">Ver pacientes</p>
                                    </div>
                                    <div
                                        onClick={() => navigate("/oncologo/registrar-paciente")}
                                        data-bs-dismiss="offcanvas"
                                        className={`link-card-menu d-flex align-items-center mb-4 ${esActivo("/oncologo/registrar-paciente")}`}
                                    >
                                        <i className="bi bi-plus-circle me-2" style={{ fontSize: "1.5rem" }}></i>
                                        <p className="mb-0 texto-blanco fs-5">Hacer análisis</p>
                                    </div>
                                </div>

                                {/* Logout */}
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-lg boton-blanco mt-3"
                                        onClick={handleLogout}
                                        data-bs-dismiss="offcanvas"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/*Card derecha */}
                        <div className="col-12 col-md-9 contenedor-columna d-flex justify-content-center align-items-center">
                            <Outlet />
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-100 bg-dark text-white py-2 text-center">
                    <p>© 2025 - Tu Proyecto</p>
                </footer>
            </div>
        </div>
    );
}
