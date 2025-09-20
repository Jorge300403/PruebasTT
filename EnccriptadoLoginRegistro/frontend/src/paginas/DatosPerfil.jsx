import api from "../services/api";
import usuarioGenericoImg from "../imagenes/usuario-generico.jpg";
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
            .catch(() => alert("No autorizado"));
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
        <div className="container-fluid d-flex py-3">
            <div className="row flex-grow-1 w-100 flex-wrap">
                {/* Card izquierda */}
                <div className="col-12 col-md-4 mb-3">
                    <div className="card h-100 text-center text-white" style={{ backgroundColor: "blue" }}>
                        <div className="card-body d-flex flex-column justify-content-between align-items-center">
                            <img src={usuarioGenericoImg} alt="Usuario Genérico" className="img-fluid mb-3" style={{ maxWidth: "50%" }} />
                            <p className="mb-3">{nombre} {apellido}</p>
                            <button className="btn btn-light mb-2" onClick={handleLogout}>Cerrar sesión</button>
                            <button className="btn btn-light">Ver perfil</button>
                        </div>
                    </div>
                </div>

                {/* Card derecha */}
                <div className="col-12 col-md-8 mb-3">
                    <div className="card h-100 text-white" style={{ backgroundColor: "blue" }}>
                        <div className="card-body">
                            <form className="row g-3 w-100">
                                {/* Nombre */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
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
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Apellido</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errores.apellido ? "is-invalid" : ""}`}
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
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errores.telefono ? "is-invalid" : ""}`}
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
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Institución</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errores.institucion ? "is-invalid" : ""}`}
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
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Correo</label>
                                    <input type="email" className="form-control" value={correo} disabled />
                                </div>

                                {/* Contraseña (no editable) */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" value="password" disabled />
                                </div>

                                {/* Botones */}
                                <div className="col-12 d-flex justify-content-between mt-3">
                                    {modoEdicion && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
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
                                        className="btn btn-primary ms-auto"
                                        onClick={() => {
                                            if (!modoEdicion) setModoEdicion(true);
                                            else handleActualizar();
                                        }}
                                        disabled={modoEdicion && !validarErrores()}
                                    >
                                        {modoEdicion ? "Guardar" : "Editar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
