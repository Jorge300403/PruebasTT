import api from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import revisarCorreoImg from "../../imagenes/revisar-correo.jpg"

export default function PaginaResultadosPaciente() {

    return (
        <div className="card col-12 col-md-11 shadow-lg d-flex flex-column justify-content-between" id="card-datos-perfil">
            <h1 className="text-center texto-azul m-5">{"Resultados paciente"}</h1>
        </div>
    );
}
