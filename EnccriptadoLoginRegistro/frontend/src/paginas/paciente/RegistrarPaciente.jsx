import api from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import revisarCorreoImg from "../../imagenes/revisar-correo.jpg"

export default function PaginaRegistroPaciente() {
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

    const navigate = useNavigate();

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

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validarErrores()) {
            Swal.fire({
                title: "Error",
                text: "Por favor corrige los errores antes de enviar.",
                icon: "error",
                confirmButtonColor: "#B3261E"
            });
            return;
        }

        try {
            const respuesta_back = await api.post("/paciente/registrar", {
                nombre,
                apellido_paterno,
                apellido_materno,
                correo_electronico,
                edad,
                sexo,
                estado_tumor: estado_tumor || null,
                er_estado: er_estado || null,
                pr_estado: pr_estado || null,
                her2_estado: her2_estado || null,
                supervivencia_meses: supervivencia_meses || null,
                evento_recaida: evento_recaida || null,
                id_usuario: "0"
            });

            Swal.fire({
                imageUrl: revisarCorreoImg,
                title: "¡Registro exitoso!",
                text: respuesta_back.data.msg,
                confirmButtonText: "Aceptar",
                customClass: {
                    image: "imagen-swal",
                    title: "texto-azul",
                    text: "texto-azul",
                    confirmButton: "btn-lg boton-azul"
                }
            }).then(() => {
                sessionStorage.setItem("pacienteSeleccionado", respuesta_back.data.id_paciente);

                navigate("/oncologo/cargar-datos-paciente")
            });

        } catch (err) {
            Swal.fire({
                title: "Error en el registro",
                text: err.response?.data?.detail || "Ocurrió un error inesperado",
                icon: "error",
                confirmButtonColor: "#B3261E"
            });
        }
    };

    return (
        <div className="card col-12 col-md-11 shadow-lg" id="card-datos-perfil">
            <h1 className="text-center texto-azul m-5">Registrar paciente</h1>
            <form onSubmit={handleRegister} className="row g-3 px-5">

                {/* Nombre */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Nombre *</label>
                    <input
                        type="text"
                        className={`form-control fs-5 texto-negro ${errores.nombre ? "is-invalid" : ""}`}
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            mensajesVerificacion("nombre", e.target.value);
                        }}
                        placeholder="Ingresa nombre paciente"
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                {/* Apellido */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Apellido paterno *</label>
                    <input
                        type="text"
                        className={`form-control fs-5 texto-negro ${errores.apellido_paterno ? "is-invalid" : ""}`}
                        value={apellido_paterno}
                        onChange={(e) => {
                            setApellidoPaterno(e.target.value);
                            mensajesVerificacion("apellido_paterno", e.target.value);
                        }}
                        placeholder="Ingresa apellido paterno del paciente"
                    />
                    {errores.apellido_paterno && <div className="invalid-feedback">{errores.apellido_paterno}</div>}
                </div>

                {/* Apellido */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Apellido materno *</label>
                    <input
                        type="text"
                        className={`form-control fs-5 texto-negro ${errores.apellido_materno ? "is-invalid" : ""}`}
                        value={apellido_materno}
                        onChange={(e) => {
                            setApellidoMaterno(e.target.value);
                            mensajesVerificacion("apellido_materno", e.target.value);
                        }}
                        placeholder="Ingresa apellido materno del paciente"
                    />
                    {errores.apellido_materno && <div className="invalid-feedback">{errores.apellido_materno}</div>}
                </div>

                {/* Correo */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Correo electrónico *</label>
                    <input
                        type="email"
                        className={`form-control fs-5 texto-negro ${errores.correo ? "is-invalid" : ""}`}
                        value={correo_electronico}
                        onChange={(e) => {
                            setCorreoElectronico(e.target.value);
                            mensajesVerificacion("correo", e.target.value);
                        }}
                        placeholder="Ingresa correo electrónico paciente"
                    />
                    {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>

                {/* Edad */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Edad *</label>
                    <input
                        type="number"
                        className={`form-control fs-5 texto-negro ${errores.edad ? "is-invalid" : ""}`}
                        value={edad}
                        onChange={(e) => {
                            setEdad(e.target.value);
                            mensajesVerificacion("edad", e.target.value);
                        }}
                        placeholder="Ingresa edad paciente"
                    />
                    {errores.edad && <div className="invalid-feedback">{errores.edad}</div>}
                </div>

                {/* Sexo */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Sexo *</label>
                    <select
                        className="form-control fs-5 texto-negro"
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value)}
                    >
                        <option value="">Seleccione sexo</option>
                        <option value="0">Mujer</option>
                        <option value="1">Hombre</option>
                    </select>
                </div>

                {/* Botón */}
                <div className="text-center my-4">
                    <button type="submit" className="btn boton-verde" disabled={!validarErrores()}>
                        Registrar paciente
                    </button>
                </div>
            </form>
        </div>
    );
}
