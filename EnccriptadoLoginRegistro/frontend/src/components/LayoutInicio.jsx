import { Outlet } from "react-router-dom";

export default function LayoutInicio() {
    return (
        <div className="d-flex flex-column contenedor-pantalla">

            {/* Header fijo */}
            <header
                className="w-100 text-white d-flex justify-content-center align-items-center"  >
                <h1 className="texto-blanco">SR-DTCM</h1>
            </header>

            {/* Contenedor scrollable */}
            <div className="contenedor-scrollable">
                <main className="d-flex contenedor-main">
                
                    <Outlet />
                </main>

                {/* Footer (se ve al hacer scroll) */}
                <footer className="w-100 bg-dark text-white py-2 text-center"                >
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
