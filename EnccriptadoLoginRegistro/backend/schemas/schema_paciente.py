from pydantic import BaseModel
from typing import Optional

class PacienteCreate(BaseModel):
    nombre: str
    apellido_paterno: str
    apellido_materno: str
    correo_electronico: str
    edad: str 
    sexo: int
    id_usuario: int


class PacienteUpdate(BaseModel):
    id_paciente: int
    nombre: str
    apellido_paterno: str
    apellido_materno: str
    correo_electronico: str
    edad: str 
    sexo: int





class PacienteGetList(BaseModel):
    id_paciente: int
    correo_electronico: str
    nombre: str
    apellido_paterno: str
    apellido_materno: str
    estado_milestone: int



class PacienteGetPerfil(BaseModel):
    nombre: str
    apellido_paterno: str
    apellido_materno: str
    correo_electronico: str
    edad: str 
    sexo: int
    estado_tumor: Optional[str] = None
    er_estado: Optional[str] = None
    pr_estado: Optional[str] = None
    her2_estado: Optional[str] = None
    supervivencia_meses: Optional[str] = None
    evento_recaida: Optional[str] = None




class PacienteArchivoClinico(BaseModel):    
    estado_tumor: Optional[str] = None
    er_estado: Optional[str] = None
    pr_estado: Optional[str] = None
    her2_estado: Optional[str] = None
    supervivencia_meses: Optional[str] = None
    evento_recaida: Optional[str] = None