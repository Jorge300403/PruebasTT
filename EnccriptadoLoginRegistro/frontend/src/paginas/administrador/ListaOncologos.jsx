import api from "../../services/api";
import usuarioGenericoImg from "../../imagenes/usuario-generico.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaginaListaOncologos() {
    const [oncologos, setOncologos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [oncologoSeleccionado, setOncologoSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    //Funcion para paginar
    const fetchOncologos = async (pagina) => {
        try {
            const res = await api.get("/administrador/lista-oncologos?page=${pagina}&limit=5");
            setOncologos(res.data.oncologos);
            setTotalPages(res.data.total_pages);
            setPage(res.data.page);
        } catch (err) {
            alert("Error cargando oncólogos");
        }
    };

    const fetchDetalles = async (id_usuario) => {
        try {
            const res = await api.get(`/administrador/detalles-oncologo/${id_usuario}`);
            setOncologoSeleccionado(res.data);
        } catch {
            alert("Error obteniendo detalles del oncólogo");
        }
    };

    useEffect(() => {
        fetchOncologos(page);
    }, [page]);


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
                                onClick={() => navigate("/administrador/cargar-datos-entrenamiento")}
                                className="link-card-menu d-flex align-items-center mb-4"
                            >
                                <i
                                    className="bi bi-plus-circle"
                                    style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}
                                ></i>
                                <h5 className="mb-0 label-editar-oncologo">Cargar datos entrenamiento</h5>
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
                        Lista Oncologos
                        <div className="container mt-5">
                            <h2>Lista de Oncólogos</h2>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Datos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {oncologos && oncologos.map((oncologo) => (
                                        <tr key={oncologo.id_usuario}>
                                            <td>{oncologo.nombre} {oncologo.apellido}</td>
                                            <td>{oncologo.correo_electronico}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={async () => {
                                                        await fetchDetalles(oncologo.id_usuario);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    Ver detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginación Bootstrap */}
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                                    </li>
                                </ul>
                            </nav>

                            {/* Modal detalles */}
                            {showModal && (
                                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Detalles del Oncólogo</h5>
                                                <button
                                                    className="btn-close"
                                                    onClick={() => setShowModal(false)}
                                                    aria-label="Close"
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                {oncologoSeleccionado ? (
                                                    <>
                                                        <p><strong>Nombre:</strong> {oncologoSeleccionado.nombre} {oncologoSeleccionado.apellido}</p>
                                                        <p><strong>Correo:</strong> {oncologoSeleccionado.correo_electronico}</p>
                                                        <p><strong>Teléfono:</strong> {oncologoSeleccionado.telefono}</p>
                                                        <p><strong>Institución:</strong> {oncologoSeleccionado.institucion}</p>
                                                        <p><strong>Verificado:</strong> {oncologoSeleccionado.verificado ? "Sí" : "No"}</p>
                                                    </>
                                                ) : (
                                                    <p>Cargando...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-backdrop fade show"></div>
                                </div>
                            )}




                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
