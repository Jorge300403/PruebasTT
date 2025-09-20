import React from "react";
import {useNavigate } from "react-router-dom";

export default function PaginaListaPacientes() { 
  const navigate = useNavigate();

    return (
        <div>
            Lista pacientes            
            <button onClick={() => navigate("/oncologo/datos-perfil")}>
                Ir a perfil
            </button>
        </div>
    );
}
