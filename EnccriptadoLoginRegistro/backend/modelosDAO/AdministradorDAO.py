from sqlalchemy.orm import Session
from modelos.Usuario import Usuario
from validaciones import encriptar_aes
from schemas import schema_administrador
from validaciones import autentificacion_password


# Creamos la funcion para obtener un usuario a partir de su correo electronico
def obtener_usuario_por_coreo(db: Session, correo_electronico: str):
    lista_usuarios = db.query(Usuario).all()
    for usuario in lista_usuarios:
        try:
            if encriptar_aes.desencriptar(usuario.correo_electronico) == correo_electronico:
                return usuario
        except:
            continue
    return None





# Creamos la funcion para crear un nuevo administrador
def crear_administrador(db: Session, datos_administrador: schema_administrador.AdministradorCreate):
    hashed_contrasenia = autentificacion_password.hash_contrasenia(datos_administrador.contrasenia)
    nuevo_usuario = Usuario(
        correo_electronico=encriptar_aes.encriptar(datos_administrador.correo_electronico),
        contrasenia=hashed_contrasenia,
        tipo_usuario=1,
        es_verificado = True
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario


