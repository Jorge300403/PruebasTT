from sqlalchemy.orm import Session
from modelos.Usuario import Usuario
from validaciones import modelo_aes
from schemas import schema_administrador
from validaciones import validaciones_tokens
from sqlalchemy.exc import SQLAlchemyError


# Creamos la funcion para obtener un usuario a partir de su correo electronico
def read_usuario_por_coreo(db: Session, correo_electronico: str):
    try:
        lista_usuarios = db.query(Usuario).all()
        for usuario in lista_usuarios:
            try:
                #Desencriptamos como vayamos leyendo para poder comparar
                if modelo_aes.desencriptar(usuario.correo_electronico) == correo_electronico:
                    return usuario
            except:
                continue
        return None
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





# Creamos la funcion para crear un nuevo administrador
def creat_administrador(db: Session, datos_administrador: schema_administrador.AdministradorCreate):
    try:
        hashed_contrasenia = validaciones_tokens.hash_contrasenia(datos_administrador.contrasenia)
        nuevo_usuario = Usuario(
            correo_electronico=modelo_aes.encriptar(datos_administrador.correo_electronico),
            contrasenia=hashed_contrasenia,
            tipo_usuario=1,
            es_verificado = True
        )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)

        return nuevo_usuario
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise


