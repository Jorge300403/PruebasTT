from pydantic import BaseModel, Field, EmailStr, model_validator


class OncologoCreate(BaseModel):
    correo_electronico: EmailStr = Field(
        ...,
        description="Correo electrónico válido del oncólogo"
    )
    contrasenia: str = Field(
        ...,
        min_length=8,
        description="Contraseña del oncólogo"
    )
    nombre: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Nombre del oncólogo"
    )
    apellido_paterno: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Apellido del oncólogo"
    )
    apellido_materno: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Apellido del oncólogo"
    )
    institucion: str = Field(
        ...,
        min_length=2,
        description="Institución médica donde labora"
    )
    telefono: str = Field(
        ...,
        min_length=10,
        max_length=15,
        description="Teléfono de contacto"
    )

    @model_validator(mode="after")
    def validar_contrasenia(cls, values):
        contrasenia = values.contrasenia

        if not any(c.isupper() for c in contrasenia):
            raise ValueError("La contraseña debe contener al menos una letra mayúscula.")
        if not any(c.isdigit() for c in contrasenia):
            raise ValueError("La contraseña debe contener al menos un número.")
        if not any(c in "!@#$%^&*.-_" for c in contrasenia):
            raise ValueError("La contraseña debe contener al menos un símbolo (!@#$%^&*.-_).")

        return values


class OncologoUpdate(BaseModel):
    nombre: str
    apellido_paterno: str
    apellido_materno: str
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
    apellido_paterno: str
    apellido_materno: str
    institucion: str
    telefono: str

    class Config:
        orm_mode = True



class OncologoGetList(BaseModel):
    id_usuario: int
    correo_electronico: str
    nombre: str
    apellido_paterno: str
    apellido_materno: str

    class Config:
        from_attributes = True 