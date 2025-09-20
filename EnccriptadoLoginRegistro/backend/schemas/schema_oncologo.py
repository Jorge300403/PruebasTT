from pydantic import BaseModel

class OncologoCreate(BaseModel):
    correo_electronico: str
    contrasenia: str
    nombre: str
    apellido: str
    institucion: str
    telefono: str

class OncologoUpdate(BaseModel):
    nombre: str
    apellido: str
    institucion: str
    telefono: str

class OncologoLogin(BaseModel):
    correo_electronico: str
    contrasenia: str

class OncologoUpdatePassword(BaseModel):
    token: str
    contrasenia: str

class OncologoCorreo(BaseModel):
    correo_electronico: str    

class OncologoResponsePerfil(BaseModel):
    id_usuario: int
    correo_electronico: str
    nombre: str
    apellido: str
    institucion: str
    telefono: str

    class Config:
        orm_mode = True