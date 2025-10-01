import React from "react";
import { Outlet } from "react-router-dom";

export default function LayoutAdministrador() {
    return (
        <div className="d-flex flex-column contenedor-pantalla">

            {/* Header fijo */}
            <header
                className="w-100 text-white d-flex justify-content-center align-items-center"  >
                <h1 className="texto-blanco">SR-DTCM</h1>
            </header>

            {/* Contenedor scrollable */}
            <div style={{ marginTop: "10vh", flex: 1, overflowY: "auto", }}>
                
                {/* Main (80% de viewport) */}
                <main style={{ minHeight: "90vh" }}>
                    <Outlet />
                </main>

                {/* Footer (se ve al hacer scroll) */}
                <footer
                    className="w-100 bg-dark text-white py-2 text-center"
                    style={{ minHeight: "5vh" }}
                >
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                </footer>
            </div>
        </div>
    );
}
