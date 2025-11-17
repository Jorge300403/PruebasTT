import api from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import actualizadoImg from "../../imagenes/actualizado.jpg";

export default function PaginaCargarDatosPaciente() {
    const id_paciente_seleccionado = sessionStorage.getItem("pacienteSeleccionado");

    // Variables de estado
    const [nombre, setNombre] = useState("");
    const [apellido_paterno, setApellidoPaterno] = useState("");
    const [apellido_materno, setApellidoMaterno] = useState("");
    const [correo_electronico, setCorreoElectronico] = useState("");
    const [edad, setEdad] = useState("");
    const [sexo, setSexo] = useState("");
    const [estado_tumor, setEstadoTumor] = useState("");
    const [er_estado, setErEstado] = useState("");
    const [pr_estado, setPrEstado] = useState("");
    const [her2_estado, setHer2Estado] = useState("");
    const [supervivencia_meses, setSupervivenciaMeses] = useState("");
    const [evento_recaida, setRecaida] = useState("");

    // Errores
    const [errores, setErrores] = useState({});

    //Navegacion
    const navigate = useNavigate();

    //Modo edicion
    const [modoEdicion, setModoEdicion] = useState(false);

    // Expresiones regulares
    const regex = {
        nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        apellido_paterno: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        apellido_materno: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        edad: /^(?:[1-9]?[0-9]|100)$/, // 0-100
    };

    // Validaciones solo para los obligatorios
    const mensajesVerificacion = (name, value) => {
        let message = "";
        switch (name) {
            case "nombre":
                if (!regex.nombre.test(value)) message = "Ingresa solo letras, máximo 100 caracteres.";
                break;
            case "apellido_paterno":
                if (!regex.apellido_paterno.test(value)) message = "Ingresa solo letras, máximo 100 caracteres.";
                break;
            case "apellido_materno":
                if (!regex.apellido_materno.test(value)) message = "Ingresa solo letras, máximo 100 caracteres.";
                break;
            case "correo":
                if (!regex.correo.test(value)) message = "Formato de correo inválido.";
                break;
            case "edad":
                if (!regex.edad.test(value)) message = "Ingresa una edad entre 0 y 100 años.";
                break;
            default:
                break;
        }
        setErrores((prev) => ({ ...prev, [name]: message }));
    };

    // Verifica si el formulario es válido
    const validarErrores = () => {
        return (
            nombre &&
            apellido_paterno &&
            apellido_materno &&
            correo_electronico &&
            edad &&
            sexo !== "" &&
            !Object.values(errores).some((err) => err !== "")
        );
    };

    useEffect(() => {
        api.get(`/paciente/perfil/${id_paciente_seleccionado}`)
            .then(res => {
                setNombre(res.data.nombre);
                setApellidoPaterno(res.data.apellido_paterno);
                setApellidoMaterno(res.data.apellido_materno);
                setCorreoElectronico(res.data.correo_electronico);
                setEdad(res.data.edad);
                setSexo(res.data.sexo);
                setEstadoTumor(res.data.estado_tumor);
                setErEstado(res.data.er_estado);
                setPrEstado(res.data.pr_estado);
                setHer2Estado(res.data.her2_estado);
                setSupervivenciaMeses(res.data.supervivencia_meses);
                setRecaida(res.data.evento_recaida);
            })
            .catch(() => {
                alert("Error al cargar los datos");
            });
    }, []);


    const handleCancelar = async () => {
        //cancelamos el modo edicion
        setModoEdicion(false);

        //Borramos los erroes generados
        setErrores({});

        //Restauramos los valores de los input
        api.get(`/paciente/perfil/${id_paciente_seleccionado}`)
            .then(res => {
                setNombre(res.data.nombre);
                setApellidoPaterno(res.data.apellido_paterno);
                setApellidoMaterno(res.data.apellido_materno);
                setCorreoElectronico(res.data.correo_electronico);
                setEdad(res.data.edad);
                setSexo(res.data.sexo);
                setEstadoTumor(res.data.estado_tumor);
                setErEstado(res.data.er_estado);
                setPrEstado(res.data.pr_estado);
                setHer2Estado(res.data.her2_estado);
                setSupervivenciaMeses(res.data.supervivencia_meses);
                setRecaida(res.data.evento_recaida);
            })
            .catch(() => {
                alert("Error al cargar los datos");
            });
    }


    // Función para actualizar datos
    const handleActualizar = async () => {
        try {
            const res = await api.put("/paciente/editar", {
                id_paciente: id_paciente_seleccionado,
                nombre,
                apellido_paterno,
                apellido_materno,
                correo_electronico,
                edad,
                sexo,
            });
            setModoEdicion(false);
            setErrores({});
            //Si fue exitoso, mostramos el modal de exito y redirigimos al login
            Swal.fire({
                imageUrl: actualizadoImg,
                title: "¡Información actualizada!",
                confirmButtonText: "Aceptar",
                customClass: {
                    image: "imagen-swal",
                    title: "texto-azul",
                    text: "texto-azul",
                    confirmButton: "btn-lg boton-azul"
                }
            }).then(() => {
                //Restauramos los valores de los input
                api.get(`/paciente/perfil/${id_paciente_seleccionado}`)
                    .then(res => {
                        setNombre(res.data.nombre);
                        setApellidoPaterno(res.data.apellido_paterno);
                        setApellidoMaterno(res.data.apellido_materno);
                        setCorreoElectronico(res.data.correo_electronico);
                        setEdad(res.data.edad);
                        setSexo(res.data.sexo);
                        setEstadoTumor(res.data.estado_tumor);
                        setErEstado(res.data.er_estado);
                        setPrEstado(res.data.pr_estado);
                        setHer2Estado(res.data.her2_estado);
                        setSupervivenciaMeses(res.data.supervivencia_meses);
                        setRecaida(res.data.evento_recaida);
                    })
                    .catch(() => {
                        alert("Error al cargar los datos");
                    });
                setModoEdicion(false)

            });
        } catch (err) {
            console.log(err.response?.data); // Para ver el detalle exacto del error
            //Si existe algun error entonces mostramos el error que ocurrio
            Swal.fire({
                title: "Error en el registro",
                text: err.response?.data?.detail || "Ocurrió un error inesperado",
                icon: "error",
                confirmButtonColor: "#B3261E"
            });
        }
    };


    //Constante de los archivos
    const [archivoClinico, setArchivoClinico] = useState(null);
    const [archivoTranscriptomico, setArchivoTranscriptomico] = useState(null);

    const handleCambiarArchicoClinico = (e) => {
        setArchivoClinico(e.target.files[0]);
    };

    const handleCambiarArchicoTranscriptomico = (e) => {
        setArchivoTranscriptomico(e.target.files[0]);
    };

    const handleSubirArchivoClinicio = async () => {
        if (!archivoClinico) {
            Swal.fire("Error", "Por favor selecciona un archivo", "error");
            return;
        }

        const formData = new FormData();
        formData.append("archivo_subido", archivoClinico);

        try {
            const res = await api.post(`/paciente/cargar-archivo-clinico/${id_paciente_seleccionado}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                imageUrl: actualizadoImg,
                title: "¡Éxito!",
                text: res.data.msg,
                confirmButtonText: "Aceptar",
                customClass: {
                    title: "texto-azul",
                    text: "texto-azul",
                    confirmButton: "btn-lg boton-azul",
                },
            }).then(() => {
                //Restauramos los valores de los input
                api.get(`/paciente/perfil/${id_paciente_seleccionado}`)
                    .then(res => {
                        setNombre(res.data.nombre);
                        setApellidoPaterno(res.data.apellido_paterno);
                        setApellidoMaterno(res.data.apellido_materno);
                        setCorreoElectronico(res.data.correo_electronico);
                        setEdad(res.data.edad);
                        setSexo(res.data.sexo);
                        setEstadoTumor(res.data.estado_tumor);
                        setErEstado(res.data.er_estado);
                        setPrEstado(res.data.pr_estado);
                        setHer2Estado(res.data.her2_estado);
                        setSupervivenciaMeses(res.data.supervivencia_meses);
                        setRecaida(res.data.evento_recaida);
                    })
                    .catch(() => {
                        alert("Error al cargar los datos");
                    });
            })
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.response?.data?.detail || "Error al subir el archivo",
                icon: "error",
                confirmButtonColor: "#B3261E",
            });
        }
    };


    const handleSubirArchivoTranscriptomico = async () => {
        if (!archivoTranscriptomico) {
            Swal.fire("Error", "Por favor selecciona un archivo", "error");
            return;
        }

        const formData = new FormData();
        formData.append("archivo_subido", archivoTranscriptomico);

        try {
            const res = await api.post(`/paciente/cargar-archivo-transcriptomico/${id_paciente_seleccionado}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                imageUrl: actualizadoImg,
                title: "¡Éxito!",
                text: res.data.msg,
                confirmButtonText: "Aceptar",
                customClass: {
                    title: "texto-azul",
                    text: "texto-azul",
                    confirmButton: "btn-lg boton-azul",
                },
            })
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.response?.data?.detail || "Error al subir el archivo",
                icon: "error",
                confirmButtonColor: "#B3261E",
            });
        }
    };



    //Funcion para obtener el PDF de los resultados
    const handleGenerarPDF = async () => {
        try {
            const res = await api.get(`/paciente/generar-pdf/${id_paciente_seleccionado}`, {
                responseType: "blob", // <- importante
            });

            // Crear un enlace temporal
            const blob = new Blob([res.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `reporte_paciente_${id_paciente_seleccionado}.pdf`; // nombre del archivo
            link.click();

            // Liberar el objeto URL temporal
            window.URL.revokeObjectURL(link.href);

        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.response?.data?.detail || "No se pudo generar el PDF",
                icon: "error",
                confirmButtonColor: "#B3261E",
            });
        }
    };





    return (
        <div className="card col-12 col-md-11 shadow-lg" id="card-datos-perfil">
            {modoEdicion ?
                <form className="row g-3 pb-5 contenedor-columna">

                    <h1 className="text-center texto-azul m-5">Editar datos paciente</h1>
                    {/* Nombre */}
                    <div className="col-12 col-md-6 px-5 py-1">
                        <label className="form-label texto-negro fs-5">Nombre *</label>
                        <input
                            type="text"
                            className={`form-control fs-5 texto-negro ${errores.nombre ? "is-invalid" : ""}`}
                            value={nombre}
                            disabled={!modoEdicion}
                            onChange={(e) => {
                                setNombre(e.target.value);
                                mensajesVerificacion("nombre", e.target.value);
                            }}
                            placeholder="Ingresa nombre paciente"
                        />
                        {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                    </div>

                    {/* Apellido */}
                    <div className="col-12 col-md-6 px-5 py-1">
                        <label className="form-label texto-negro fs-5">Apellido paterno*</label>
                        <input
                            type="text"
                            className={`form-control fs-5 texto-negro ${errores.apellido_paterno ? "is-invalid" : ""}`}
                            value={apellido_paterno}
                            disabled={!modoEdicion}
                            onChange={(e) => {
                                setApellidoPaterno(e.target.value);
                                mensajesVerificacion("apellido_paterno", e.target.value);
                            }}
                            placeholder="Ingresa apellido paterno paciente"
                        />
                        {errores.apellido_paterno && <div className="invalid-feedback">{errores.apellido_paterno}</div>}
                    </div>

                    {/* Apellido */}
                    <div className="col-12 col-md-6 px-5 py-1">
                        <label className="form-label texto-negro fs-5">Apellido materno*</label>
                        <input
                            type="text"
                            className={`form-control fs-5 texto-negro ${errores.apellido_materno ? "is-invalid" : ""}`}
                            value={apellido_materno}
                            disabled={!modoEdicion}
                            onChange={(e) => {
                                setApellidoMaterno(e.target.value);
                                mensajesVerificacion("apellido_materno", e.target.value);
                            }}
                            placeholder="Ingresa apellido paterno paciente"
                        />
                        {errores.apellido_materno && <div className="invalid-feedback">{errores.apellido_materno}</div>}
                    </div>

                    {/* Correo */}
                    <div className="col-12 col-md-6 px-5 py-1">
                        <label className="form-label texto-negro fs-5">Correo electrónico *</label>
                        <input
                            type="email"
                            className={`form-control fs-5 texto-negro ${errores.correo ? "is-invalid" : ""}`}
                            value={correo_electronico}
                            disabled={!modoEdicion}
                            onChange={(e) => {
                                setCorreoElectronico(e.target.value);
                                mensajesVerificacion("correo", e.target.value);
                            }}
                            placeholder="Ingresa correo electrónico paciente"
                        />
                        {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                    </div>

                    {/* Edad */}
                    <div className="col-12 col-md-6 px-5 py-1">
                        <label className="form-label texto-negro fs-5">Edad *</label>
                        <input
                            type="number"
                            className={`form-control fs-5 texto-negro ${errores.edad ? "is-invalid" : ""}`}
                            value={edad}
                            disabled={!modoEdicion}
                            onChange={(e) => {
                                setEdad(e.target.value);
                                mensajesVerificacion("edad", e.target.value);
                            }}
                            placeholder="Ingresa edad paciente"
                        />
                        {errores.edad && <div className="invalid-feedback">{errores.edad}</div>}
                    </div>

                    {/* Sexo */}
                    <div className="col-12 col-md-6 px-5 py-1">
                        <label className="form-label texto-negro fs-5">Sexo *</label>
                        <select
                            className="form-control fs-5 texto-negro"
                            value={sexo}
                            disabled={!modoEdicion}
                            onChange={(e) => setSexo(e.target.value)}
                        >
                            <option value="">Seleccione sexo</option>
                            <option value="0">Mujer</option>
                            <option value="1">Hombre</option>
                        </select>
                    </div>

                    {/* Botón */}
                    <div className="col-12 d-flex justify-content-between my-4 px-5">
                        {modoEdicion && (
                            <button
                                type="button"
                                className="btn btn-lg boton-rojo"
                                onClick={handleCancelar}
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn btn-lg boton-verde ms-auto"
                            onClick={() => { handleActualizar(); }}
                            disabled={modoEdicion && !validarErrores()}
                        >
                            {modoEdicion ? "Guardar datos" : "Editar datos"}
                        </button>
                    </div>
                </form>
                :
                <div>
                    <div className="row g-3 pb-5 contenedor-datos-paciente-carga contenedor-columna">
                        <h1 className="text-center texto-azul p-5">Datos del paciente</h1>
                        <div className="col-12 col-md-6 px-5 py-1">
                            <label className="form-label texto-negro fs-4">Nombre: {nombre} {apellido_paterno} {apellido_materno}</label>
                            <br />
                            <label className="form-label texto-negro fs-4">Correo: {correo_electronico}</label>
                            <br />
                            <label className="form-label texto-negro fs-4">Edad: {edad}</label>
                            <br />
                            <label className="form-label texto-negro fs-4">Sexo: {sexo === 0 ? "Mujer" : "Hombre"}</label>
                            <br />
                            <label className="form-label texto-negro fs-4">Estado tumor: {estado_tumor}</label>
                        </div>

                        <div className="col-12 col-md-6 px-5 py-1">
                            <label className="form-label texto-negro fs-4">Estado ER: {er_estado}</label>
                            <br />
                            <label className="form-label texto-negro fs-4">Estado PR: {pr_estado}</label>
                            <br />
                            <label className="form-label texto-negro fs-4">Estado HER2: {her2_estado}</label>
                            <br />
                            <label className="form-label texto-negro fs-4">Supervivencia: {supervivencia_meses}</label>
                            <br />
                            <label className="form-label texto-negro fs-4">Evento recaida: {evento_recaida}</label>
                        </div>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                className="btn btn-lg boton-verde ms-auto"
                                onClick={() => { setModoEdicion(true); }}
                            >
                                {modoEdicion ? "Guardar datos" : "Editar datos"}
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h1 className="text-center texto-azul m-5">Cargar datos clínicos paciente</h1>
                        <div className=" row g-3 contenedor-columna px-5">
                            <div className="mb-3">
                                <input
                                    type="file"
                                    className="form-control form-control-lg border border-2 rounded-3 shadow-sm"
                                    id="archivo"
                                    onChange={handleCambiarArchicoClinico}
                                />
                            </div>
                            <div className="text-center my-4">
                                <button
                                    type="button"
                                    className="btn btn-lg boton-verde ms-auto"
                                    onClick={handleSubirArchivoClinicio}
                                >
                                    Cargar archivo
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-center texto-azul m-5">Cargar datos ctranscriptómicos</h1>
                        <div className=" row g-3 contenedor-columna px-5">
                            <div className="mb-3">
                                <input
                                    type="file"
                                    className="form-control form-control-lg border border-2 rounded-3 shadow-sm"
                                    id="archivo"
                                    onChange={handleCambiarArchicoTranscriptomico}
                                />
                            </div>
                            <div className="text-center my-4">
                                <button
                                    type="button"
                                    className="btn btn-lg boton-verde ms-auto"
                                    onClick={handleSubirArchivoTranscriptomico}
                                >
                                    Cargar archivo
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleGenerarPDF}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Generar reporte PDF
                        </button>
                    </div>
                </div>
            }
        </div >
    );
}
