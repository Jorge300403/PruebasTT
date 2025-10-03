import api from "../../services/api";
import usuarioGenericoImg from "../../imagenes/usuario-generico.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaginaListaPacientes() {
    // Estados separados    
    const [pacientes, setPacientes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const navigate = useNavigate();



    const obtenerPacientes = async (pagina = 1, limit = itemsPerPage) => {
        try {

            const token = localStorage.getItem("token");
            // USAR backticks para interpolar
            const res = await api.get(`/oncologo/lista-pacientes?page=${pagina}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
            setPacientes(res.data.pacientes || []);
            setTotalPages(res.data.total_pages || 1);
            setPage(res.data.page || 1);
        } catch (err) {
            console.error(err);
            alert("Error cargando pacientes");
        }
    };




    // Obtener perfil
    useEffect(() => {
        obtenerPacientes(page, itemsPerPage);
    }, [page, itemsPerPage]);



    // funciones seguras para cambiar página
    const goToPage = (n) => {
        if (n < 1) n = 1;
        if (n > totalPages) n = totalPages;
        setPage(n);
    };



    const handleVerPaciente = (paciente) => {
        sessionStorage.setItem("pacienteSeleccionado", paciente.id_paciente);

        if (paciente.estado_milestone === 0) {
            navigate("/oncologo/cargar-datos-paciente");
        } else if (paciente.estado_milestone === 2) {
            navigate("/onocologo/resultados-paciente");
        } else {
        }
    };

    return (

        <div className="card col-12 col-md-11 shadow-lg d-flex flex-column justify-content-between" id="card-datos-perfil">
            <h1 className="text-center texto-azul m-5">{"Pacientes registrados"}</h1>

            {/* Selector para items por página */}
            <div className="mb-3">
                <label>Mostrar</label>
                <select className="form-select w-auto d-inline-block ms-2"
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th className="d-none d-sm-table-cell">Correo</th> {/* ocultar en xs */}
                            <th>Datos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.map((paciente) => (
                            <tr key={paciente.id_paciente}>
                                <td>{paciente.nombre} {paciente.apellido}</td>
                                <td className="d-none d-sm-table-cell">{paciente.correo_electronico}</td>
                                <td>
                                    <button type="button" class="btn boton-azul" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-gear"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li className="btn boton-azul" onClick={() => handleVerPaciente(paciente)}>
                                            Ver resultados
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <nav>
                <ul className="pagination">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(page - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(page + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
