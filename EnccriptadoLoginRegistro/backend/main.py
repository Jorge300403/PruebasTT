from fastapi import FastAPI
from modelos import Usuario, Oncologo, Paciente, RefrescarToken, Gen, ExpresionGenica
from modelosDAO import GenDAO
from database import engine
from routers.router_oncologo import router as router_oncologo
from routers.router_administrador import router as router_administrador
from routers.router_paciente import router as router_paciente
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from validaciones.validaciones_datos import validacion_datos

app = FastAPI()

# Crear tablas
Usuario.Base.metadata.create_all(bind=engine)
Oncologo.Base.metadata.create_all(bind=engine)
Paciente.Base.metadata.create_all(bind=engine)
RefrescarToken.Base.metadata.create_all(bind=engine)
Gen.Base.metadata.create_all(bind=engine)
ExpresionGenica.Base.metadata.create_all(bind=engine)

#Mandamos llenar la bd de los genes
GenDAO.creat_llenar_diccionario_genes()




# Registramos el manejador de validaciones personalizados
app.add_exception_handler(RequestValidationError, validacion_datos)



# Configuración CORS para permitir el acceso desde el front de react
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # dominio del front
    allow_credentials=True,                  # permite enviar cookies
    allow_methods=["*"],
    allow_headers=["*"],
)



# Routers
app.include_router(router_oncologo)
app.include_router(router_administrador)
app.include_router(router_paciente)