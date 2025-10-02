import { useEffect, useState } from "react";
import api from "../../services/api";

export default function PaginaListaOncologos() {
    const [oncologos, setOncologos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // controla cuántos por página

    const fetchOncologos = async (pagina = 1, limit = itemsPerPage) => {
        try {
            // USAR backticks para interpolar
            const res = await api.get(`/administrador/lista-oncologos?page=${pagina}&limit=${limit}`);
            setOncologos(res.data.oncologos || []);
            setTotalPages(res.data.total_pages || 1);
            setPage(res.data.page || 1);
        } catch (err) {
            console.error(err);
            alert("Error cargando oncólogos");
        }
    };

    useEffect(() => {
        fetchOncologos(page, itemsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, itemsPerPage]);

    // funciones seguras para cambiar página
    const goToPage = (n) => {
        if (n < 1) n = 1;
        if (n > totalPages) n = totalPages;
        setPage(n);
    };

    // render (resumido)
    return (

        <div className="card col-12 col-md-11 shadow-lg d-flex flex-column justify-content-between" id="card-datos-perfil">
            <h1 className="text-center texto-azul m-5">{"Oncologos registrados"}</h1>


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
                        {oncologos.map((o) => (
                            <tr key={o.id_usuario}>
                                <td>{o.nombre} {o.apellido}</td>
                                <td className="d-none d-sm-table-cell">{o.correo_electronico}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm">Ver detalles</button>
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
