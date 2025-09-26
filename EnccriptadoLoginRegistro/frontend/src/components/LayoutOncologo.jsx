import React from "react";
import { Outlet } from "react-router-dom";

export default function LayoutOncologo() {
    return (
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>

            {/* Header fijo */}
            <header
                className="w-100 bg-primary text-white d-flex justify-content-center align-items-center"
                id="header-oncologo"
                style={{
                    height: "10vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                }}
            >
                <h1>SR-DTCM</h1>
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
