from pydantic import BaseModel

class AdministradorCreate(BaseModel):
    correo_electronico: str
    contrasenia: str