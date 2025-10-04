import api from "../../services/api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import registroImage from "../../imagenes/cancer-mama-login.jpg";
import revisarCorreoImg from "../../imagenes/revisar-correo.jpg"

export default function PaginaRegistroOncologo() {
    //Definimos todas la variables que vamos a utilizar
    const [correo_electronico, setCorreoElectronico] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [institucion, setInstitucion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();


    //Definimos variables para mostrar o no la contrasenia
    const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);


    //Definimos las expresiones regulares para la validación de los datos
    const regex = {
        nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        apellido: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        contrasenia: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.\-_])[A-Za-z\d!@#$%^&*.\-_]{8,}$/,
        institucion: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        telefono: /^\d{10}$/,
    };


    //Definimos cada uno de los mensajes de verificación
    const mensajesVerificacion = (name, value) => {
        let message = "";
        //Creamos cada uno de los casos, en caso de que no cumpla creamos el mensaje de error
        switch (name) {
            case "nombre":
                if (!regex.nombre.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "apellido":
                if (!regex.apellido.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "correo":
                if (!regex.correo.test(value)) message = "Formato de correo inválido.";
                break;
            case "contrasenia":
                if (!regex.contrasenia.test(value)) message = "Mínimo 8 caracteres, una mayúscula, un número y un símbolo.";
                break;
            case "confirmarContrasenia":
                if (value !== contrasenia) message = "Las contraseñas no coinciden.";
                break;
            case "institucion":
                if (!regex.institucion.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "telefono":
                if (!regex.telefono.test(value)) message = "El número debe de ser de 10 dígitos.";
                break;
            default:
                break;
        }
        //Guardamos la lista de todos los errores y los enviamos
        setErrores((prev) => ({ ...prev, [name]: message }));
    };


    //Definimos función para verificar si hay algun error
    const validarErrores = () => {
        return (
            nombre &&
            apellido &&
            correo_electronico &&
            contrasenia &&
            confirmarContrasenia &&
            institucion &&
            telefono &&
            !Object.values(errores).some((err) => err !== "")
        );
    };


    //Definimos la funcion principal para la petición con el back
    const handleRegister = async (e) => {
        e.preventDefault();

        //Primero debemos de validar que no haya errores en el formulario, si hay mostramos el modal de error
        if (!validarErrores()) {
            Swal.fire({
                title: "Error",
                text: "Por favor corrige los errores antes de enviar.",
                icon: "error",
                confirmButtonColor: "#B3261E"
            });
            return;
        }

        //Ahora hacemos la petición para registrarlo
        try {
            const respuesta_back = await api.post("/oncologo/register", {
                correo_electronico,
                contrasenia,
                nombre,
                apellido,
                institucion,
                telefono
            });

            //Si fue exitoso, mostramos el modal de exito y redirigimos al login
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
                navigate("/login")
            });

        } catch (err) {
            //Si existe algun error entonces mostramos el error que ocurrio
            Swal.fire({
                title: "Error en el registro",
                text: err.response?.data?.detail || "Ocurrió un error inesperado",
                icon: "error",
                confirmButtonColor: "#B3261E"
            });
        }
    };


    return (
        <div className="container-fluid row contenedor-prinipal">
            {/* Izquierda: Imagen */}
            <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center contenedor-derecho-imagen-inicio">
                <img
                    src={registroImage}
                    alt="Imagen login"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "90vh", // la clave: límite al 90% del viewport height
                        objectFit: "cover", // recorta proporcionalmente si sobra
                        borderRadius: "10px" // opcional si quieres bordes suaves
                    }}
                />

            </div>

            {/* Derecha: Formulario */}
            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center contenedor-form-inicio">
                <div className="card col-md-4 col-12 shadow-lg d-flex flex-column justify-content-between">
                    <h1 className="text-center texto-azul m-5">¡Registrate!</h1>
                    <form onSubmit={handleRegister} className="px-5">
                        <div className="mt-4">
                            <label className="form-label texto-negro fs-5">Correo</label>
                            <input
                                type="email"
                                className={`form-control texto-negro fs-5 ${errores.correo ? "is-invalid texto-negro fs-5" : ""}`}
                                value={correo_electronico}
                                onChange={(e) => {
                                    setCorreoElectronico(e.target.value);
                                    mensajesVerificacion("correo", e.target.value);
                                }}
                                placeholder="Ingresa correo"
                            />
                            {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                        </div>

                        <div className="mt-4">
                            <label className="form-label texto-negro  fs-5">Contraseña</label>
                            <div className="input-group">
                                <input
                                    type={mostrarContrasenia ? "text" : "password"}
                                    className={`form-control fs-5 texto-negro ${errores.contrasenia ? "is-invalid" : ""}`}
                                    value={contrasenia}
                                    onChange={(e) => {
                                        setContrasenia(e.target.value);
                                        mensajesVerificacion("contrasenia", e.target.value);
                                    }}
                                    placeholder="Ingresa contraseña"
                                />
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                                >
                                    {mostrarContrasenia ? <i class="bi bi-eye-slash"></i> : <i class="bi bi-eye"></i>}
                                </button>
                                {errores.contrasenia && <div className="invalid-feedback">{errores.contrasenia}</div>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="form-label texto-negro fs-5">Confirmar Contraseña</label>
                            <div className="input-group">
                                <input
                                    type={mostrarConfirmacion ? "text" : "password"}
                                    className={`form-control fs-5 texto-negro ${errores.confirmarContrasenia ? "is-invalid fs-5 texto-negro" : ""}`}
                                    value={confirmarContrasenia}
                                    onChange={(e) => {
                                        setConfirmarContrasenia(e.target.value);
                                        mensajesVerificacion("confirmarContrasenia", e.target.value);
                                    }}
                                    placeholder="Confirma tu contraseña"
                                />
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
                                >
                                    {mostrarConfirmacion ? <i class="bi bi-eye-slash"></i> : <i class="bi bi-eye"></i>}
                                </button>
                                {errores.confirmarContrasenia && <div className="invalid-feedback">{errores.confirmarContrasenia}</div>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="form-label texto-negro fs-5">Nombre</label>
                            <input
                                className={`form-control texto-negro fs-5 ${errores.nombre ? "is-invalid texto-negro fs-5" : ""}`}
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value);
                                    mensajesVerificacion("nombre", e.target.value);
                                }}
                                placeholder="Ingresa tu nombre"
                            />
                            {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                        </div>

                        <div className="mt-4">
                            <label className="form-label texto-negro fs-5">Apellido</label>
                            <input
                                className={`form-control texto-negro fs-5 ${errores.apellido ? "is-invalid texto-negro fs-5" : ""}`}
                                value={apellido}
                                onChange={(e) => {
                                    setApellido(e.target.value);
                                    mensajesVerificacion("apellido", e.target.value);
                                }}
                                placeholder="Ingresa tus apellidos"
                            />
                            {errores.apellido && <div className="invalid-feedback">{errores.apellido}</div>}
                        </div>

                        <div className="mt-4">
                            <label className="form-label texto-negro fs-5">Institución</label>
                            <input
                                className={`form-control texto-negro fs-5 ${errores.institucion ? "is-invalid texto-negro fs-5" : ""}`}
                                value={institucion}
                                onChange={(e) => {
                                    setInstitucion(e.target.value);
                                    mensajesVerificacion("institucion", e.target.value);
                                }}
                                placeholder="Ingresa institución"
                            />
                            {errores.institucion && <div className="invalid-feedback">{errores.institucion}</div>}
                        </div>

                        <div className="mt-4">
                            <label className="form-label texto-negro fs-5">Teléfono</label>
                            <input
                                className={`form-control texto-negro fs-5 ${errores.telefono ? "is-invalid texto-negro fs-5" : ""}`}
                                value={telefono}
                                onChange={(e) => {
                                    setTelefono(e.target.value);
                                    mensajesVerificacion("telefono", e.target.value);
                                }}
                                placeholder="Ingresa télefono"
                            />
                            {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
                        </div>

                        <div className="text-center my-4">
                            <button type="submit" className="btn boton-verde" disabled={!validarErrores()}>
                                Crear cuenta
                            </button>
                        </div>
                    </form>

                    <div className="m-5">
                        <p className="text-center mt-3 texto-negro">
                            ¿Ya tienes cuenta?{" "}
                            <span className="link-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
                                Login
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
