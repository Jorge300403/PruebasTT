from sqlalchemy.orm import Session
from validaciones import validaciones_tokens
from modelos.Paciente import Paciente
from validaciones import modelo_aes
from schemas import schema_paciente




def crear_paciente(db: Session, datos_paciente: schema_paciente.PacienteCreate):
    nuevo_paciente = Paciente(
        nombre = modelo_aes.encriptar(datos_paciente.nombre),
        apellido = modelo_aes.encriptar(datos_paciente.apellido),
        correo_electronico = modelo_aes.encriptar(datos_paciente.correo_electronico),
        edad = modelo_aes.encriptar(datos_paciente.edad),
        sexo = datos_paciente.sexo,
        estado_tumor = modelo_aes.encriptar(datos_paciente.estado_tumor),
        er_estado = modelo_aes.encriptar(datos_paciente.er_estado),
        pr_estado = modelo_aes.encriptar(datos_paciente.pr_estado),
        her2_estado = modelo_aes.encriptar(datos_paciente.her2_estado),
        supervivencia_meses = modelo_aes.encriptar(datos_paciente.supervivencia_meses),
        evento_recaida = modelo_aes.encriptar(datos_paciente.evento_recaida),
        id_usuario = datos_paciente.id_usuario,
        estado_milestone = 0
    )

    
    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)
    
    return nuevo_paciente





def actualizar_datos_perfil(db: Session, nuevos_datos_paciente: schema_paciente.PacienteUpdate):
    paciente = db.query(Paciente).filter(Paciente.id_paciente == nuevos_datos_paciente.id_paciente).first()
    
    paciente.nombre = modelo_aes.encriptar(nuevos_datos_paciente.nombre)
    paciente.apellido = modelo_aes.encriptar(nuevos_datos_paciente.apellido)
    paciente.correo_electronico = modelo_aes.encriptar(nuevos_datos_paciente.correo_electronico)
    paciente.edad = modelo_aes.encriptar(nuevos_datos_paciente.edad)
    paciente.sexo = nuevos_datos_paciente.sexo
    paciente.estado_tumor = modelo_aes.encriptar(nuevos_datos_paciente.estado_tumor)
    paciente.er_estado = modelo_aes.encriptar(nuevos_datos_paciente.er_estado)
    paciente.pr_estado = modelo_aes.encriptar(nuevos_datos_paciente.pr_estado)
    paciente.her2_estado = modelo_aes.encriptar(nuevos_datos_paciente.her2_estado)
    paciente.supervivencia_meses = modelo_aes.encriptar(nuevos_datos_paciente.supervivencia_meses)
    paciente.evento_recaida = modelo_aes.encriptar(nuevos_datos_paciente.evento_recaida)

    db.commit()
    db.refresh(paciente)
    return paciente





def cargar_datos_clinicos(db: Session, datos_clinicos: schema_paciente.PacienteArchivoClinico, id_paciente: int):
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






# Funcio para obtener un paciente por correo electornico
def obtener_paciente_por_coreo(db: Session, correo_electronico: str):
    lista_pacientes = db.query(Paciente).all()
    for paciente in lista_pacientes:
        try:
            if modelo_aes.desencriptar(paciente.correo_electronico) == correo_electronico:
                return paciente
        except:
            continue
    return None




#Funcion apra obtener paciente por id
def obtener_paciente_por_id(db: Session, id_paciente: int):
    return db.query(Paciente).filter(Paciente.id_paciente == id_paciente).first()





# Funcio para obtener ver que un medico no haya registrado un paciente
def verificar_relacion_oncologo_paciente(db: Session, correo_electronico: str, id_usuario: int):
    lista_pacientes = db.query(Paciente).all()
    for paciente in lista_pacientes:
        try:
            if modelo_aes.desencriptar(paciente.correo_electronico) == correo_electronico and paciente.id_usuario == id_usuario:
                return paciente
        except:
            continue
    return None




#Funcion para contar el numero de pacientes de un oncologo 
def contar_pacientes(db: Session, id_usuario: int): 
    numero_pacientes = db.query(Paciente).filter(Paciente.id_usuario == id_usuario).count()
    return numero_pacientes

def obtener_pacientes_paginados(db: Session, skip: int = 0, limit: int = 10, id_usuario: int = None): 
    # Traemos los datos crudos de la BD 
    lista_pacientes = ( 
        db.query( 
            Paciente.id_paciente, 
            Paciente.correo_electronico, 
            Paciente.nombre, 
            Paciente.apellido,
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
            apellido = modelo_aes.desencriptar(paciente.apellido),
            estado_milestone = paciente.estado_milestone
        )
        resultado.append(paciente_schema) 
    return resultado





#Funcion para eliminar un paciente por su ID
def eliminar_paciente(db: Session, id_paciente: int):
    paciente = db.query(Paciente).filter(Paciente.id_paciente == id_paciente).first()
    if not paciente:
        return False

    db.delete(paciente)
    db.commit()
    return True