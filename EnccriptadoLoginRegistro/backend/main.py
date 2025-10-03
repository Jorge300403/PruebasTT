from fastapi import FastAPI
from modelos import Usuario, Oncologo, Paciente
from database import engine
from routers.router_oncologo import router as router_oncologo
from routers.router_administrador import router as router_administrador
from routers.router_paciente import router as router_paciente
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Crear tablas
Usuario.Base.metadata.create_all(bind=engine)
Oncologo.Base.metadata.create_all(bind=engine)
Paciente.Base.metadata.create_all(bind=engine)



# Configuración CORS (permitir acceso desde React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar por el dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(router_oncologo)
app.include_router(router_administrador)
app.include_router(router_paciente)