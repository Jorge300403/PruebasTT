from sqlalchemy.orm import Session
from modelos.Usuario import Usuario
from modelos.Oncologo import Oncologo
from schemas import schema_oncologo
from validaciones import autentificacion_password


# Creamos la funcion para obtener un usuario a partir de su correo electronico
def obtener_usuario_por_coreo(db: Session, correo_electronico: str):
    return db.query(Usuario).filter(Usuario.correo_electronico == correo_electronico).first()


# Creamos la funcion para crear un nuevo oncologo
def crear_oncologo(db: Session, datos_oncologo: schema_oncologo.OncologoCreate):
    hashed_contrasenia = autentificacion_password.hash_contrasenia(datos_oncologo.contrasenia)
    nuevo_usuario = Usuario(
        correo_electronico=datos_oncologo.correo_electronico,
        contrasenia=hashed_contrasenia,
        tipo_usuario=0,
        es_verificado = False
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    nuevo_oncologo = Oncologo(
        id_usuario=nuevo_usuario.id_usuario,
        nombre=datos_oncologo.nombre,
        apellido=datos_oncologo.apellido,
        institucion=datos_oncologo.institucion,
        telefono=datos_oncologo.telefono
    )
    db.add(nuevo_oncologo)
    db.commit()
    db.refresh(nuevo_oncologo)

    return nuevo_usuario