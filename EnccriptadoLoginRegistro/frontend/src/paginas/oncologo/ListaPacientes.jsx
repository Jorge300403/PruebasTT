import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import revisarCorreoImg from "../../imagenes/revisar-correo.jpg"

export default function PaginaListaPacientes() {
    // Estados separados    
    const [pacientes, setPacientes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const navigate = useNavigate();



    const obtenerPacientes = async (pagina = 1, limit = itemsPerPage) => {
        try {
            // USAR backticks para interpolar
            const res = await api.get(`/oncologo/lista-pacientes?page=${pagina}&limit=${limit}`);
            setPacientes(res.data.pacientes || []);
            setTotalPages(res.data.total_pages || 1);
            setPage(res.data.page || 1);
        } catch (err) {
            console.error(err);
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


    const handleEliminarPaciente = async (id_paciente_eliminar) => {
        try {
            const respuesta_back = await api.delete(`/paciente/eliminar/${id_paciente_eliminar}`)


            Swal.fire({
                imageUrl: revisarCorreoImg,
                title: "¡Exitoso!",
                text: respuesta_back.data.msg,
                confirmButtonText: "Aceptar",
                customClass: {
                    image: "imagen-swal",
                    title: "texto-azul",
                    text: "texto-azul",
                    confirmButton: "btn-lg boton-azul"
                }
            }).then(() => {
                obtenerPacientes();
            })

        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.response?.data?.detail || "Ocurrió un error inesperado",
                icon: "error",
                confirmButtonColor: "#B3261E"
            });

        }

    }

    return (

        <div className="card col-12 col-md-11 shadow-lg d-flex flex-column justify-content-between" id="card-datos-perfil">
            <h1 className="text-center texto-azul m-5">{"Pacientes registrados"}</h1>


            <div className="table-responsive px-5">
                <table className="table table-striped texto-negro " >
                    <thead>
                        <tr className="fs-2">
                            <th>Nombre</th>
                            <th className="d-none d-sm-table-cell">Correo</th> {/* ocultar en xs */}
                            <th className="text-center">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="fs-5">
                        {pacientes.map((paciente) => (
                            <tr key={paciente.id_paciente}>
                                <td>{paciente.nombre} {paciente.apellido}</td>
                                <td className="d-none d-sm-table-cell">{paciente.correo_electronico}</td>
                                <td className="text-center">
                                    <button type="button" className="btn boton-azul" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-gear"></i>
                                    </button>
                                    <ul class="dropdown-menu" style={{ border: "none" }}>
                                        <li className="btn boton-azul my-1" style={{ width: "100%", height: "100%" }} onClick={() => handleVerPaciente(paciente)}>
                                            Ver resultados
                                        </li>
                                        <li className="btn boton-rojo" style={{ width: "100%", height: "100%" }} onClick={() => handleEliminarPaciente(paciente.id_paciente)}>
                                            Eliminar
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <nav className="px-5">
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
