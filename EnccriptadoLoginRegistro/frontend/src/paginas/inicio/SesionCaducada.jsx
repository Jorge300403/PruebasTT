
import { useNavigate } from "react-router-dom";

export default function PaginaSesionCaducada() {

    const navigate = useNavigate();

    const handleIrLogin = () => {
        navigate("/");
    };

    return (
        <div>
            <h2>Sesión caducasdffgdfda</h2>
            <p>Tu sesión ha terminado. Por favor inicia sesión de nuevo.</p>
            <button onClick={handleIrLogin}>Ir a login</button>
        </div>
    );
}
