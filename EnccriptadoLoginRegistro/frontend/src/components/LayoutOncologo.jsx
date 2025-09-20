import React from "react";
import { Outlet } from "react-router-dom";

export default function LayoutOncologo() {
    return (
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>

            {/* Header fijo */}
            <header className="w-100 bg-primary text-white py-3 text-center" style={{ flex: "0 0 60px" }}>
                <h1>SR-DTCM</h1>
            </header>

            {/* Contenido dinámico (se ajusta para no quedar debajo del header) */}
            <main className="flex-grow-1" style={{ backgroundColor: "red" }}>
                <Outlet />
                <footer
                    className="w-100 bg-dark text-white py-2 text-center"
                    style={{
                        flex: "0 0 40px",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "500px",
                    }}
                >
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                    <p>© 2025 - Tu Proyecto</p>
                </footer>
            </main>

            {/* Footer (puedes personalizarlo más adelante) */}

        </div>
    );
}
