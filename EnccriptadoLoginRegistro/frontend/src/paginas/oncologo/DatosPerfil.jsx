import api from "../../services/api";
import usuarioGenericoImg from "../../imagenes/usuario-generico.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaginaDatosPerfil() {
    const [modoEdicion, setModoEdicion] = useState(false);

    // Estados separados
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [institucion, setInstitucion] = useState("");
    const [correo, setCorreo] = useState("");
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    const regex = {
        nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        apellido: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        telefono: /^\d{10}$/,
        institucion: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
    };

    const mensajesVerificacion = (name, value) => {
        let message = "";
        switch (name) {
            case "nombre":
                if (!regex.nombre.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "apellido":
                if (!regex.apellido.test(value)) message = "Solo letras, máximo 100 caracteres.";
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
            apellido &&
            telefono &&
            institucion &&
            !Object.values(errores).some(err => err !== "")
        );
    };

    // Obtener perfil
    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/oncologo/perfil", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setNombre(res.data.nombre);
                setApellido(res.data.apellido);
                setTelefono(res.data.telefono.toString());
                setInstitucion(res.data.institucion);
                setCorreo(res.data.correo_electronico);
            })
            .catch(() => {
                alert("Sesion caducada");
                localStorage.removeItem("token");
                navigate("/")
            });
    }, []);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Función para actualizar datos
    const handleActualizar = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.put("/oncologo/editar", {
                nombre,
                apellido,
                institucion,
                telefono: telefono.toString()
            },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            alert(res.data.msg);
            setModoEdicion(false);
            setErrores({});
        } catch (err) {
            console.log(err.response?.data); // Para ver el detalle exacto del error
            alert("Error al actualizar");
        }
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
                            <h1 className="mt-4">¡Bienvenido {nombre}!</h1>
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
                                onClick={() => navigate("/oncologo/lista-pacientes")}
                                className="link-card-menu d-flex align-items-center mb-4"
                            >
                                <i
                                    className="bi bi-list"
                                    style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}
                                ></i>
                                <h5 className="mb-0 label-editar-oncologo">Ver pacientes</h5>
                            </div>

                            <div className="link-card-menu d-flex align-items-center mb-3">
                                <i
                                    className="bi bi-plus-circle"
                                    style={{ color: "white", fontSize: "2rem", marginRight: "8px" }}
                                ></i>
                                <h5 className="mb-0 label-editar-oncologo">Hacer análisis</h5>
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




            {/* Card derecha */}
            <div className="col-12 col-md-9 d-flex align-items-center justify-content-center p-5">
                <div className="card text-white w-100 shadow-lg" id="card-form-datos-oncologo">
                    <div className="card-body">
                        <form className="row g-3 w-100">
                            {/* Nombre */}
                            <div className="col-12 col-md-6 px-5 py-4">
                                <label className="label-editar-oncologo">Nombre</label>
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
                                <label className="label-editar-oncologo">Apellido</label>
                                <input
                                    type="text"
                                    className={`form-control input-editar-oncologo ${errores.apellido ? "is-invalid" : ""}`}
                                    value={apellido}
                                    disabled={!modoEdicion}
                                    onChange={(e) => {
                                        setApellido(e.target.value);
                                        mensajesVerificacion("apellido", e.target.value);
                                    }}
                                />
                                {errores.apellido && <div className="invalid-feedback">{errores.apellido}</div>}
                            </div>

                            {/* Telefono */}
                            <div className="col-12 col-md-6 px-5 py-4">
                                <label className="label-editar-oncologo">Teléfono</label>
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
                                <label className="label-editar-oncologo">Institución</label>
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
                                <label className="label-editar-oncologo">Correo</label>
                                <input type="email" className="form-control input-editar-oncologo" value={correo} disabled />
                            </div>

                            {/* Contraseña (no editable) */}
                            <div className="col-12 col-md-6 px-5 py-4">
                                <label className="label-editar-oncologo">Contraseña</label>
                                <input type="password" className="form-control input-editar-oncologo" value="password" disabled />
                            </div>

                            {/* Botones */}
                            <div className="col-12 d-flex justify-content-between mt-3">
                                {modoEdicion && (
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setModoEdicion(false);
                                            setErrores({});
                                            const token = localStorage.getItem("token");
                                            api.get("/oncologo/perfil", { headers: { Authorization: `Bearer ${token}` } })
                                                .then(res => {
                                                    setNombre(res.data.nombre);
                                                    setApellido(res.data.apellido);
                                                    setTelefono(res.data.telefono.toString());
                                                    setInstitucion(res.data.institucion);
                                                });
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-success ms-auto"
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
                </div>
            </div>
        </div>
    );
}
