from fastapi import FastAPI
from modelos import Usuario
from modelos import Oncologo
from database import engine
from routers.router_oncologo import router as router_oncologo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Crear tablas
Usuario.Base.metadata.create_all(bind=engine)
Oncologo.Base.metadata.create_all(bind=engine)


# Configuración CORS (permitir acceso desde React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cambia por el dominio de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(router_oncologo)
print("LLegamos al main")