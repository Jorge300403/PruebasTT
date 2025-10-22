import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import actualizadoImg from "../../imagenes/actualizado.jpg";

export default function PaginaDatosPerfil() {
    const [modoEdicion, setModoEdicion] = useState(false);

    // Estados separados
    const [nombre, setNombre] = useState("");
    const [apellido_paterno, setApellidoPaterno] = useState("");
    const [apellido_materno, setApellidoMaterno] = useState("");
    const [telefono, setTelefono] = useState("");
    const [institucion, setInstitucion] = useState("");
    const [correo, setCorreo] = useState("");
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    const regex = {
        nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        apellido_paterno: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        apellido_materno: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        telefono: /^\d{10}$/,
        institucion: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
    };

    const mensajesVerificacion = (name, value) => {
        let message = "";
        switch (name) {
            case "nombre":
                if (!regex.nombre.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "apellido_paterno":
                if (!regex.apellido_paterno.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "apellido_materno":
                if (!regex.apellido_materno.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "telefono":
                if (!regex.telefono.test(value)) message = "El número debe ser de 10 dígitos.";
                break;
            case "institucion":
                if (!regex.institucion.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            default:
                break;
        }
        setErrores(prev => ({ ...prev, [name]: message }));
    };

    const validarErrores = () => {
        return (
            nombre &&
            apellido_paterno &&
            apellido_materno &&
            telefono &&
            institucion &&
            !Object.values(errores).some(err => err !== "")
        );
    };

    // Obtener perfil
    useEffect(() => {
        api.get("/oncologo/perfil")
            .then(res => {
                setNombre(res.data.nombre);
                setApellidoPaterno(res.data.apellido_paterno);
                setApellidoMaterno(res.data.apellido_materno);
                setTelefono(res.data.telefono.toString());
                setInstitucion(res.data.institucion);
                setCorreo(res.data.correo_electronico);
            })
            .catch(error => {
                console.error(error)
            });
    }, []);

    // Función para actualizar datos
    const handleActualizar = async () => {
        try {
            const res = await api.put("/oncologo/editar", {
                nombre,
                apellido_paterno,
                apellido_materno,
                institucion,
                telefono: telefono.toString()
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
            })
        } catch (err) {
            console.error(err.response?.data); // Para ver el detalle exacto del error
            alert("Error al actualizar");
        }
    };

    return (
        <div className="card col-12 col-md-11 shadow-lg d-flex flex-column justify-content-between" id="card-datos-perfil">
            <h1 className="text-center texto-azul m-5">{modoEdicion ? "Editar datos del perfil" : "Datos del perfil"}</h1>
            <form className="row g-3 px-5 contenedor-columna">
                {/* Nombre */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Nombre</label>
                    <input
                        type="text"
                        className={`form-control input-editar-oncologo ${errores.nombre ? "is-invalid" : ""}`}
                        value={nombre}
                        disabled={!modoEdicion}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            mensajesVerificacion("nombre", e.target.value);
                        }}
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                {/* Apellido */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Apellido paterno</label>
                    <input
                        type="text"
                        className={`form-control input-editar-oncologo ${errores.apellido_paterno ? "is-invalid" : ""}`}
                        value={apellido_paterno}
                        disabled={!modoEdicion}
                        onChange={(e) => {
                            setApellidoPaterno(e.target.value);
                            mensajesVerificacion("apellido_paterno", e.target.value);
                        }}
                    />
                    {errores.apellido_paterno && <div className="invalid-feedback">{errores.apellido_paterno}</div>}
                </div>

                 {/* Apellido */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Apellido materno</label>
                    <input
                        type="text"
                        className={`form-control input-editar-oncologo ${errores.apellido_materno ? "is-invalid" : ""}`}
                        value={apellido_materno}
                        disabled={!modoEdicion}
                        onChange={(e) => {
                            setApellidoMaterno(e.target.value);
                            mensajesVerificacion("apellido_materno", e.target.value);
                        }}
                    />
                    {errores.apellido_materno && <div className="invalid-feedback">{errores.apellido_materno}</div>}
                </div>

                {/* Telefono */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Teléfono</label>
                    <input
                        type="text"
                        className={`form-control input-editar-oncologo ${errores.telefono ? "is-invalid" : ""}`}
                        value={telefono}
                        disabled={!modoEdicion}
                        onChange={(e) => {
                            setTelefono(e.target.value);
                            mensajesVerificacion("telefono", e.target.value);
                        }}
                    />
                    {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
                </div>

                {/* Institución */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Institución</label>
                    <input
                        type="text"
                        className={`form-control input-editar-oncologo ${errores.institucion ? "is-invalid" : ""}`}
                        value={institucion}
                        disabled={!modoEdicion}
                        onChange={(e) => {
                            setInstitucion(e.target.value);
                            mensajesVerificacion("institucion", e.target.value);
                        }}
                    />
                    {errores.institucion && <div className="invalid-feedback">{errores.institucion}</div>}
                </div>

                {/* Correo (no editable) */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Correo</label>
                    <input type="email" className="form-control input-editar-oncologo" value={correo} disabled />
                </div>

                {/* Contraseña (no editable) */}
                <div className="col-12 col-md-6 px-5 py-4">
                    <label className="form-label texto-negro fs-5">Contraseña</label>
                    <input type="password" className="form-control input-editar-oncologo" value="password" disabled />
                </div>

                {/* Botones */}
                <div className="col-12 d-flex justify-content-between my-4">
                    {modoEdicion && (
                        <button
                            type="button"
                            className="btn btn-lg boton-rojo"
                            onClick={() => {
                                setModoEdicion(false);
                                setErrores({});
                                api.get("/oncologo/perfil")
                                    .then(res => {
                                        setNombre(res.data.nombre);
                                        setApellidoPaterno(res.data.apellido_paterno);
                                        setApellidoMaterno(res.data.apellido_materno);
                                        setTelefono(res.data.telefono.toString());
                                        setInstitucion(res.data.institucion);
                                        setCorreo(res.data.correo_electronico);
                                    })
                                    .catch(error => {
                                        console.error(error)
                                    });
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-lg boton-verde ms-auto"
                        onClick={() => {
                            if (!modoEdicion) setModoEdicion(true);
                            else handleActualizar();
                        }}
                        disabled={modoEdicion && !validarErrores()}
                    >
                        {modoEdicion ? "Guardar datos" : "Editar datos"}
                    </button>
                </div>
            </form>
        </div>
    );
}
