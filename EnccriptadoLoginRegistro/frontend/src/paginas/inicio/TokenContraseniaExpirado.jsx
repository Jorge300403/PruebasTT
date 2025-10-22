import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import timepoExpiradoImg from '../../imagenes/tiempo-expirado.jpg'
import Swal from "sweetalert2";
import revisarCorreoImg from "../../imagenes/revisar-correo.jpg"

export default function PaginaTokenContraseniaExpirado() {
    const navigate = useNavigate();

    return (
        <div className="container-fluid row contenedor-prinipal d-flex justify-content-center align-items-center">

            {/*Contenedor central */}
            <div className="card col-12 col-md-3 shadow-lg d-flex flex-column justify-content-between ">
                <div className="text-center">
                    <img
                        src={timepoExpiradoImg}
                        alt="Imagen tiempo expirado"
                        className="img-fluid mt-4"
                        style={{ maxWidth: "50%" }}
                    />

                    <h1 className=" texto-azul m-5">¡Lo sentimos! <br />Este token ya no es valido.</h1>

                </div>

                <div className="text-center my-4">
                    <p className="text-center fs-5">
                        <span className="link-primary texto-azul" style={{ cursor: "pointer" }} onClick={() => navigate("/olvido-contrasenia")}>
                            Restablecer contraseña
                        </span>
                    </p>
                    <div className="d-flex align-items-center justify-content-center my-2 mx-5">
                        <hr className="flex-grow-1" />
                        <span className="mx-2 texto-negro">o</span>
                        <hr className="flex-grow-1" />
                    </div>
                    <p className="text-center fs-5">
                        <span className="link-primary texto-azul" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                            Volver inicio de sesión
                        </span>
                    </p>
                </div>F
            </div>
        </div>
    );
}
