from sqlalchemy.orm import Session
from modelos.Usuario import Usuario
from modelos.Oncologo import Oncologo
from schemas import schema_oncologo
from validaciones import autentificacion_password
from validaciones import encriptar_aes


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


#Cremoa sla funcion para obtener el usuario a aprtir del id
def obtener_usuario_por_id(db: Session, id_usuario: int):
    return db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()


#Cremoa sla funcion para obtener el oncologo a aprtir del id
def obtener_oncologo_por_id(db: Session, id_usuario: int):
    return db.query(Oncologo).filter(Oncologo.id_usuario == id_usuario).first()


# Creamos la funcion para crear un nuevo oncologo
def crear_oncologo(db: Session, datos_oncologo: schema_oncologo.OncologoCreate):
    hashed_contrasenia = autentificacion_password.hash_contrasenia(datos_oncologo.contrasenia)
    nuevo_usuario = Usuario(
        correo_electronico=encriptar_aes.encriptar(datos_oncologo.correo_electronico),
        contrasenia=hashed_contrasenia,
        tipo_usuario=0,
        es_verificado = False
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    nuevo_oncologo = Oncologo(
        id_usuario=nuevo_usuario.id_usuario,
        nombre=encriptar_aes.encriptar(datos_oncologo.nombre),
        apellido=encriptar_aes.encriptar(datos_oncologo.apellido),
        institucion=encriptar_aes.encriptar(datos_oncologo.institucion),
        telefono=encriptar_aes.encriptar(datos_oncologo.telefono)
    )
    db.add(nuevo_oncologo)
    db.commit()
    db.refresh(nuevo_oncologo)

    return nuevo_usuario

def actualizar_contrasenia(db: Session, usuario_actualizar: Usuario, nueva_contrasenia: str):    
    hashed_contrasenia = autentificacion_password.hash_contrasenia(nueva_contrasenia)
    usuario_actualizar.contrasenia = hashed_contrasenia
    db.commit()
    db.refresh(usuario_actualizar)
    return usuario_actualizar

def actualizar_datos_perfil(db: Session, id_usuario: int, nuevos_datos_oncologo: schema_oncologo.OncologoUpdate):
    oncologo = db.query(Oncologo).filter(Oncologo.id_usuario == id_usuario).first()
    
    oncologo.nombre = encriptar_aes.encriptar(nuevos_datos_oncologo.nombre)
    oncologo.apellido = encriptar_aes.encriptar(nuevos_datos_oncologo.apellido)
    oncologo.telefono = encriptar_aes.encriptar(nuevos_datos_oncologo.telefono)
    oncologo.institucion = encriptar_aes.encriptar(nuevos_datos_oncologo.institucion)

    db.commit()
    db.refresh(oncologo)
    return oncologo


def verificar_correo(db: Session, usuario_actualizar: Usuario):
    usuario_actualizar.es_verificado = True 
    db.add(usuario_actualizar)
    db.commit()
    return usuario_actualizar