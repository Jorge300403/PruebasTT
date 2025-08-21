import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function PaginaLogin() {
    //Definios los parametros que vamos a recibir del formulario
    const [correo_electronico, setCorreoElectronico] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            //Enviamos la peticion con los parametos
            const res = await api.post("/oncologo/login", { correo_electronico, contrasenia });
            localStorage.setItem("token", res.data.access_token);
            alert("Login exitoso");
            navigate("/lista_pacientes");
        } catch (error) {
            if (error.response.status === 403 && error.response.data.detail === "Correo no verificado"){
                navigate("/correo-no-verificado", { state: { correo_electronico: correo_electronico } });
            } else if(error.response) {
                // Backend responde con el error que haya ocurrido
                alert(error.response.data.detail);
            } else {
                // Error de red o algo inesperado
                alert("Error de conexión con el servidor");
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input placeholder="Correo" value={correo_electronico} onChange={(e) => setCorreoElectronico(e.target.value)} /> <br />
                <input type="password" placeholder="Contraseña" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} /> <br />
                <button type="submit">Entrar</button>
            </form>  
            <br/>        
            <p>No tienes cuenta? <Link to="/registro_oncologo">Regístrate</Link></p>
        </div>
    );
}
