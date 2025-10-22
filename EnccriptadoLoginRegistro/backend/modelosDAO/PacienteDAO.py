from sqlalchemy.orm import Session
from validaciones import validaciones_tokens
from modelos.Paciente import Paciente
from validaciones import modelo_aes
from schemas import schema_paciente
from sqlalchemy.exc import SQLAlchemyError





#Funcion para crear un paciente
def creat_paciente(db: Session, datos_paciente: schema_paciente.PacienteCreate):
    try:
        nuevo_paciente = Paciente(
            nombre = modelo_aes.encriptar(datos_paciente.nombre),
            apellido_paterno = modelo_aes.encriptar(datos_paciente.apellido_paterno),
            apellido_materno = modelo_aes.encriptar(datos_paciente.apellido_materno),
            correo_electronico = modelo_aes.encriptar(datos_paciente.correo_electronico),
            edad = modelo_aes.encriptar(datos_paciente.edad),
            sexo = datos_paciente.sexo,
            id_usuario = datos_paciente.id_usuario,
            estado_milestone = 0
        )
        
        db.add(nuevo_paciente)
        db.commit()
        db.refresh(nuevo_paciente)
        
        return nuevo_paciente
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





#Funcion para actualizar los datos del perfil del paciente
def update_datos_perfil_paciente(db: Session, nuevos_datos_paciente: schema_paciente.PacienteUpdate):
    try:
        paciente = db.query(Paciente).filter(Paciente.id_paciente == nuevos_datos_paciente.id_paciente).first()
        
        paciente.nombre = modelo_aes.encriptar(nuevos_datos_paciente.nombre)
        paciente.apellido_paterno = modelo_aes.encriptar(nuevos_datos_paciente.apellido_paterno)
        paciente.apellido_materno = modelo_aes.encriptar(nuevos_datos_paciente.apellido_materno)
        paciente.correo_electronico = modelo_aes.encriptar(nuevos_datos_paciente.correo_electronico)
        paciente.edad = modelo_aes.encriptar(nuevos_datos_paciente.edad)
        paciente.sexo = nuevos_datos_paciente.sexo

        db.commit()
        db.refresh(paciente)
        return paciente
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





#Funcion para cargar los datos clinicos del paciente
def update_datos_clinicos(db: Session, datos_clinicos: schema_paciente.PacienteArchivoClinico, id_paciente: int):
    try:
        paciente = db.query(Paciente).filter(Paciente.id_paciente == id_paciente).first()
        if not paciente:
            return None


        paciente.estado_tumor = modelo_aes.encriptar(datos_clinicos.estado_tumor) if datos_clinicos.estado_tumor is not None else None
        paciente.er_estado = modelo_aes.encriptar(datos_clinicos.er_estado) if datos_clinicos.er_estado is not None else None
        paciente.pr_estado = modelo_aes.encriptar(datos_clinicos.pr_estado) if datos_clinicos.pr_estado is not None else None
        paciente.her2_estado = modelo_aes.encriptar(datos_clinicos.her2_estado) if datos_clinicos.her2_estado is not None else None
        paciente.supervivencia_meses = modelo_aes.encriptar(datos_clinicos.supervivencia_meses) if datos_clinicos.supervivencia_meses is not None else None
        paciente.evento_recaida = modelo_aes.encriptar(datos_clinicos.evento_recaida) if datos_clinicos.evento_recaida is not None else None

        db.commit()
        db.refresh(paciente)
        return paciente
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





# Funcio para obtener un paciente por correo electornico
def read_paciente_por_coreo(db: Session, correo_electronico: str):
    try: 
        lista_pacientes = db.query(Paciente).all()
        for paciente in lista_pacientes:
            try:
                if modelo_aes.desencriptar(paciente.correo_electronico) == correo_electronico:
                    return paciente
            except:
                continue
        return None
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise




#Funcion apra obtener paciente por id
def read_paciente_por_id(db: Session, id_paciente: int):
    try:
        return db.query(Paciente).filter(Paciente.id_paciente == id_paciente).first()
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





# Funcio para obtener ver que un medico no haya registrado un paciente
def read_verificar_relacion_oncologo_paciente(db: Session, correo_electronico: str, id_usuario: int):
    try: 
        lista_pacientes = db.query(Paciente).all()
        for paciente in lista_pacientes:
            try:
                if modelo_aes.desencriptar(paciente.correo_electronico) == correo_electronico and paciente.id_usuario == id_usuario:
                    return paciente
            except:
                continue
        return None
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





#Funcion para contar el numero de pacientes de un oncologo 
def read_contar_pacientes(db: Session, id_usuario: int): 
    try:
        numero_pacientes = db.query(Paciente).filter(Paciente.id_usuario == id_usuario).count()
        return numero_pacientes
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





#Funcuon para obtener los pacientes paginados
def read_lista_pacientes_paginados(db: Session, skip: int = 0, limit: int = 10, id_usuario: int = None): 
    try: 
        # Traemos los datos crudos de la BD 
        lista_pacientes = ( 
            db.query( 
                Paciente.id_paciente, 
                Paciente.correo_electronico, 
                Paciente.nombre, 
                Paciente.apellido_paterno,
                Paciente.apellido_materno,
                Paciente.estado_milestone
                ).filter(Paciente.id_usuario == id_usuario)
                .offset(skip)
                .limit(limit)
                .all() ) 
        
        # Transformamos cada tupla en una instancia del esquema 
        resultado = [] 
        for paciente in lista_pacientes: 
            paciente_schema = schema_paciente.PacienteGetList( 
                id_paciente = paciente.id_paciente,
                correo_electronico = modelo_aes.desencriptar(paciente.correo_electronico),
                nombre = modelo_aes.desencriptar(paciente.nombre),
                apellido_paterno = modelo_aes.desencriptar(paciente.apellido_paterno),
                apellido_materno = modelo_aes.desencriptar(paciente.apellido_materno),
                estado_milestone = paciente.estado_milestone
            )
            resultado.append(paciente_schema) 
        return resultado
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise





#Funcion para eliminar un paciente por su ID
def delete_paciente(db: Session, id_paciente: int):
    try:
        paciente = db.query(Paciente).filter(Paciente.id_paciente == id_paciente).first()
        if not paciente:
            return False

        db.delete(paciente)
        db.commit()
        return True
    except SQLAlchemyError as e:
        # Error interno en la bd, lo regresamos al router
        print(f"Error en la base de datos: {e}")
        raise