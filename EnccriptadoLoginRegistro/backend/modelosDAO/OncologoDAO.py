from sqlalchemy.orm import Session
from modelos.Usuario import Usuario
from modelos.Oncologo import Oncologo
from schemas import schema_oncologo
from validaciones import validaciones_tokens
from validaciones import modelo_aes
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError





# Creamos la funcion para obtener un usuario a partir de su correo electronico
def read_usuario_por_correo(db: Session, correo_electronico: str):
    try:
        lista_usuarios = db.query(Usuario).all()
        for usuario in lista_usuarios:
            try:
                #Vamos descenrpitabndo cada uno de lso que vamos leyecno y vamos comparando
                if modelo_aes.desencriptar(usuario.correo_electronico) == correo_electronico:
                    return usuario
            except:
                continue
        return None
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





#Cremoa sla funcion para obtener el usuario a aprtir del id
def read_usuario_por_id(db: Session, id_usuario: int):
    try:
        return db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





#Cremoa sla funcion para obtener el oncologo a aprtir del id
def read_oncologo_por_id(db: Session, id_usuario: int):
    try:
        return db.query(Oncologo).filter(Oncologo.id_usuario == id_usuario).first()
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





# Creamos la funcion para crear un nuevo oncologo
def creat_oncologo(db: Session, datos_oncologo: schema_oncologo.OncologoCreate):
    try:
        #Primero recibimos todos los datos y creamos primero al usuario
        hashed_contrasenia = validaciones_tokens.hash_contrasenia(datos_oncologo.contrasenia)
        nuevo_usuario = Usuario(
            correo_electronico=modelo_aes.encriptar(datos_oncologo.correo_electronico),
            contrasenia=hashed_contrasenia,
            tipo_usuario=0,
            es_verificado = False
        )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)

        #Posteriormente creamos el oncologo dado que tiene como llave foranea el id del usuario
        nuevo_oncologo = Oncologo(
            id_usuario=nuevo_usuario.id_usuario,
            nombre=modelo_aes.encriptar(datos_oncologo.nombre),
            apellido_paterno=modelo_aes.encriptar(datos_oncologo.apellido_paterno),
            apellido_materno=modelo_aes.encriptar(datos_oncologo.apellido_materno),
            institucion=modelo_aes.encriptar(datos_oncologo.institucion),
            telefono=modelo_aes.encriptar(datos_oncologo.telefono)
        )
        db.add(nuevo_oncologo)
        db.commit()
        db.refresh(nuevo_oncologo)

        return nuevo_usuario
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise






#Creamos la funcion para actualizar la contraseña
def update_contrasenia(db: Session, usuario_actualizar: Usuario, nueva_contrasenia: str):  
    try:  
        #Primero debemos de hashar la contraseña
        hashed_contrasenia = validaciones_tokens.hash_contrasenia(nueva_contrasenia)
        usuario_actualizar.contrasenia = hashed_contrasenia
        db.commit()
        db.refresh(usuario_actualizar)
        return usuario_actualizar
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





# Creamos la funcion para actualizar los datos del perfil
def update_datos_perfil(db: Session, id_usuario: int, nuevos_datos_oncologo: schema_oncologo.OncologoUpdate):
    try:   
        #Primero debemos de ontener el oncologo que vamos a actualziar
        oncologo = db.query(Oncologo).filter(Oncologo.id_usuario == id_usuario).first()
        
        #Despues debemos de actualizar sus datos
        oncologo.nombre = modelo_aes.encriptar(nuevos_datos_oncologo.nombre)
        oncologo.apellido_paterno = modelo_aes.encriptar(nuevos_datos_oncologo.apellido_paterno)
        oncologo.apellido_materno = modelo_aes.encriptar(nuevos_datos_oncologo.apellido_materno)
        oncologo.telefono = modelo_aes.encriptar(nuevos_datos_oncologo.telefono)
        oncologo.institucion = modelo_aes.encriptar(nuevos_datos_oncologo.institucion)

        db.commit()
        db.refresh(oncologo)
        return oncologo
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





#Creamos la funcion para verificar el correo
def update_verificar_correo(db: Session, usuario_actualizar: Usuario):
    try:
        usuario_actualizar.es_verificado = True 
        db.add(usuario_actualizar)
        db.commit()
        return usuario_actualizar
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise






#Funcion para contar el numero de oncologos que estan registrados 
def read_contar_oncologos(db: Session): 
    try:
        return db.query(Oncologo).count() 
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise






#creamos la funcion para obtener a los oncologos pero paginados
def read_oncologos_paginados(db: Session, skip: int = 0, limit: int = 10): 
    try:
        # Traemos los datos crudos de la BD 
        lista_oncologos = ( 
            db.query( 
                Usuario.id_usuario, 
                Usuario.correo_electronico, 
                Oncologo.nombre, 
                Oncologo.apellido_paterno,
                Oncologo.apellido_materno
                ) .join(Oncologo, Usuario.id_usuario == Oncologo.id_usuario)
                .filter(Usuario.tipo_usuario == 0)# Solo oncólogos 
                .offset(skip)
                .limit(limit)
                .all() ) 
        
        # Transformamos cada tupla en una instancia del esquema 
        resultado = [] 
        for oncologo in lista_oncologos: 
            oncologo_schema = schema_oncologo.OncologoGetList( 
                id_usuario=oncologo.id_usuario, 
                correo_electronico=modelo_aes.desencriptar(oncologo.correo_electronico), 
                nombre=modelo_aes.desencriptar(oncologo.nombre), 
                apellido_paterno=modelo_aes.desencriptar(oncologo.apellido_paterno),
                apellido_materno=modelo_aes.desencriptar(oncologo.apellido_materno) ) 
        
            resultado.append(oncologo_schema) 
        return resultado
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise