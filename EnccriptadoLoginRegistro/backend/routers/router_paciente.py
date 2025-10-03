from fastapi import Depends, HTTPException, APIRouter, Query
from sqlalchemy.orm import Session
from database import get_db
from modelosDAO import PacienteDAO
from validaciones import autentificacion_password
from schemas import schema_paciente
from jose import JWTError, jwt
from validaciones import encriptar_aes
from fastapi.security import OAuth2PasswordBearer
from modelosDAO import OncologoDAO
from modelos.Usuario import Usuario
from modelos.Paciente import Paciente

FRONTEND_URL = "http://localhost:3000"


# Le asignamos el prefijo de oncologo para la peticiones que solo son del oncologo
router = APIRouter(prefix="/paciente", tags=["paciente"])





# Definimos el esquema de OAuth2 para que extraiga el token del header autorización
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="oncologo/login")





# Peticion para validar el token de login y obtener al usuario actual, recibimos el token que esta en la sesion
def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)): 
    
    try:
        #Decodificamos el token para obtener el id del usuario
        id_usuario_en_token = autentificacion_password.decodificar_token_acceso(token)
    except JWTError:
        #Si no es valido entonces mostramos el error
        raise HTTPException(status_code=401, detail="Token inválido o expirados")

    #Si es valido obtenemos el suario completo que corresponde con el id que se guardo en el token
    usuario_en_token = OncologoDAO.obtener_usuario_por_id(db, id_usuario_en_token)

    if usuario_en_token is None:
        #Si no hay un usario regresamos el error
        raise HTTPException(status_code=401, detail="Token inválido o expirados")
    
    #Debemos de regresar el usuario encontrado
    return usuario_en_token





@router.post("/registrar")
#Debemos de recibir los datos para registar el paciente, y la sesion la cual la obtenemos
def registrar(datos_paciente: schema_paciente.PacienteCreate, db: Session = Depends(get_db), usuario_en_token: Usuario = Depends(obtener_usuario_actual)): 

    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_paciente = PacienteDAO.verificar_relacion_oncologo_paciente(db, datos_paciente.correo_electronico, usuario_en_token.id_usuario) 

    #Debemos de verificar que el correo que se ingreso no este registrado previamente
    if validacion_paciente:
        #Si el correo ya esta registrado, entonces mandamos el mensaje de que ya existe este paciente
        raise HTTPException(status_code=400, detail="Esta paciente ya lo has registrado") 
    
    
    #Si no esta registrado, entonces creamos el nuevo paciente, mandamos la db y los datos del formulario
    datos_paciente.id_usuario = usuario_en_token.id_usuario
    PacienteDAO.crear_paciente(db, datos_paciente) 

    #Si todo esta correcto, regresamos el mensaje de exito
    return {"msg": "Paciente registrado correctamente, ahora te rediregiremos para cargues su datos transcriptomicos"} 





# Peticion para obeter datos perfil del paciente, debemos de regresar la infromacion del schema de corresponde al perfil del paciente
@router.get("/perfil/{id_paciente_seleccionado}", response_model=schema_paciente.PacienteGetPerfil) 

#Primero debemos de obtener el usuario con el que se inicio sesion, para ello accedemos al token que tiene sesion activa
def get_paciente_perfil(id_paciente_seleccionado: int, db: Session = Depends(get_db)):
    
    #Obteneos los datos del oncologo a partir del usario en token que regresa
    paciente_seleccionado = PacienteDAO.obtener_paciente_por_id(db, id_paciente_seleccionado)
    
    if not paciente_seleccionado:    
        # Si no se encontro entonces marcamos el error
        raise HTTPException(status_code=404, detail="Paciente no encontrado")


    #Si todo esta bien y se encontro, entonces le asignamos los valores al schema dado que eso es lo que debemos de regresar
    return schema_paciente.PacienteGetPerfil(
        id_paciente = paciente_seleccionado.id_paciente,
        nombre=encriptar_aes.desencriptar(paciente_seleccionado.nombre),
        apellido=encriptar_aes.desencriptar(paciente_seleccionado.apellido),
        correo_electronico=encriptar_aes.desencriptar(paciente_seleccionado.correo_electronico),
        edad=encriptar_aes.desencriptar(paciente_seleccionado.edad),
        sexo=paciente_seleccionado.sexo,
        estado_tumor = encriptar_aes.desencriptar(paciente_seleccionado.estado_tumor),
        er_estado = encriptar_aes.desencriptar(paciente_seleccionado.er_estado),
        pr_estado = encriptar_aes.desencriptar(paciente_seleccionado.pr_estado),
        her2_estado = encriptar_aes.desencriptar(paciente_seleccionado.her2_estado),
        supervivencia_meses = encriptar_aes.desencriptar(paciente_seleccionado.supervivencia_meses),
        evento_recaida = encriptar_aes.desencriptar(paciente_seleccionado.evento_recaida)
    )





# Peticion para editar los datos del perfil del paciente
@router.put("/editar")
# Debe recibir los parametros que se van a editar, asi como la sesion activa
def editar_datos_oncologo(datos_actualizados: schema_paciente.PacienteUpdate, db: Session = Depends(get_db)):
    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_paciente = PacienteDAO.obtener_paciente_por_id(db, datos_actualizados.id_paciente)

    #Debemos de verificar que exista el usuario
    if not validacion_paciente:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    

    validacion_correo = PacienteDAO.obtener_paciente_por_coreo(db, datos_actualizados.correo_electronico)
    #Ahora debemos de validar el correo
    if validacion_correo and validacion_correo.id_paciente != datos_actualizados.id_paciente:
        #Si el correo ya esta registrado, entonces mandamos el mensaje de que ya existe este paciente
        raise HTTPException(status_code=400, detail="Esta correo de paciente ya lo has registrado") 

    PacienteDAO.actualizar_datos_perfil(db, datos_actualizados)

    #Si todo esta correcto, regresamos el mensaje de exito
    return {"msg": "Información actualizada."} 