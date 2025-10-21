from fastapi import Depends, HTTPException, APIRouter, Query, File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from modelosDAO import PacienteDAO
from validaciones import validaciones_tokens
from schemas import schema_paciente
from jose import JWTError, jwt
from validaciones import modelo_aes
from fastapi.security import OAuth2PasswordBearer
from modelosDAO import OncologoDAO
from modelos.Usuario import Usuario
from modelos.Paciente import Paciente
from validaciones import validaciones_archivos
import os
import pandas as pd
import base64





#Definimos la url del front
FRONTEND_URL = "http://localhost:3000"





# Le asignamos el prefijo de oncologo para la peticiones que solo son del oncologo
router = APIRouter(prefix="/paciente", tags=["paciente"])




# Definimos el esquema de OAuth2 para que extraiga el token del header autorización
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="oncologo/login")





# Peticion para validar el token de login y obtener al usuario actual, recibimos el token que esta en la sesion
def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)): 
    
    try:
        #Decodificamos el token para obtener el id del usuario
        id_usuario_en_token = validaciones_tokens.decodificar_token(token)
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





#Peticion para crear un nuevo paciente
@router.post("/registrar")
#Debemos de recibir los datos para registar el paciente, y la sesion la cual la obtenemos
def registrar_paciente(datos_paciente: schema_paciente.PacienteCreate, db: Session = Depends(get_db), usuario_en_token: Usuario = Depends(obtener_usuario_actual)): 

    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_paciente = PacienteDAO.verificar_relacion_oncologo_paciente(db, datos_paciente.correo_electronico, usuario_en_token.id_usuario) 

    #Debemos de verificar que el correo que se ingreso no este registrado previamente
    if validacion_paciente:
        #Si el correo ya esta registrado, entonces mandamos el mensaje de que ya existe este paciente
        raise HTTPException(status_code=400, detail="Esta paciente ya lo has registrado") 
    
    
    #Si no esta registrado, entonces creamos el nuevo paciente, mandamos la db y los datos del formulario
    datos_paciente.id_usuario = usuario_en_token.id_usuario
    paciente_creado = PacienteDAO.crear_paciente(db, datos_paciente) 

    #Si todo esta correcto, regresamos el mensaje de exito
    return {"msg": "Paciente registrado correctamente, ahora te rediregiremos para cargues su datos transcriptomicos", "id_paciente": paciente_creado.id_paciente} 





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
        nombre=modelo_aes.desencriptar(paciente_seleccionado.nombre),
        apellido=modelo_aes.desencriptar(paciente_seleccionado.apellido),
        correo_electronico=modelo_aes.desencriptar(paciente_seleccionado.correo_electronico),
        edad=modelo_aes.desencriptar(paciente_seleccionado.edad),
        sexo=paciente_seleccionado.sexo,
        estado_tumor = modelo_aes.desencriptar(paciente_seleccionado.estado_tumor),
        er_estado = modelo_aes.desencriptar(paciente_seleccionado.er_estado),
        pr_estado = modelo_aes.desencriptar(paciente_seleccionado.pr_estado),
        her2_estado = modelo_aes.desencriptar(paciente_seleccionado.her2_estado),
        supervivencia_meses = modelo_aes.desencriptar(paciente_seleccionado.supervivencia_meses),
        evento_recaida = modelo_aes.desencriptar(paciente_seleccionado.evento_recaida)
    )





# Peticion para editar los datos del perfil del paciente
@router.put("/editar")
# Debe recibir los parametros que se van a editar, asi como la sesion activa
def editar_datos_paciente(datos_actualizados: schema_paciente.PacienteUpdate, db: Session = Depends(get_db)):
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





# Peticion para eliminar un pacieente
@router.delete("/eliminar/{id_paciente}")
#Recibimos el id del paciente que deseamos eliminar 
def eliminar_paciente(id_paciente: int, db: Session = Depends(get_db)):

    #Hacamos la peticion de DAO para poder eliminarlo
    validacion_eliminacion = PacienteDAO.eliminar_paciente(db, id_paciente)
    if not validacion_eliminacion:
        # No existe el paciente
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    return {"msg": "Paciente eliminado correctamente"}





# Funcion para cargar archivo datos clinicos, recibimos el id del paciente y el archivo
@router.post("/cargar-archivo-clinico/{id_paciente}")
def cargar_archivo_paciente(id_paciente: int, archivo_subido: UploadFile = File(...), db: Session = Depends(get_db)):

    #Primero debemos de verificar que se un archivo con extension valida, y la recibimos
    extension = validaciones_archivos.validar_tipo_archivo(archivo_subido)
    if not extension:
        #Si no regresa nada es que la extension no es valida entonces marcamos el error y mostramos el mensaje
        raise HTTPException(status_code=400, detail="El archivo debe ser Excel o CSV.")
    
    #Ahora debemos de validar el formato del contenido del archivo
    validacion_formato = validaciones_archivos.validar_archivo_clinico(archivo_subido, extension)
    if isinstance(validacion_formato, dict) and validacion_formato.get("msg"):
        #Si contiene algun error, entonces mandamos el mensaje
        raise HTTPException(status_code=400, detail=validacion_formato["msg"])

    #Si no hay errores, entonce debemos de leer los valores de ese archivo
    try:
        #Generamos la lista recorriendo fila por fila y generando el diccionario con su valor
        campos_archivo_leido = {row["dato"].lower(): row["valor"] for _, row in validacion_formato.iterrows()}

        #Los valores vacios los declaramos
        for i, j in campos_archivo_leido.items():
            if pd.isna(j):
                #Si esta vacion entonces declaramos el None si no dara error
                campos_archivo_leido[i] = None
            else:
                #Si no, entonces generamos el str del valor
                campos_archivo_leido[i] = str(j)

    except Exception as error:
        #Si tenemos un error para leer el archivo, entocnes regresamos el mensaje de error
        raise HTTPException(status_code=400, detail=f"Formato inesperado en dataframe: {str(error)}")

    #Buscamos que exista el paciente que recibimos su id
    paciente = PacienteDAO.obtener_paciente_por_id(db, id_paciente)
    if not paciente:
        #Si no existe el paciente, regresamos el mensaje del error
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    #Creamos el schema para actualizar la bd con los datos leidos
    valores_campos = schema_paciente.PacienteArchivoClinico(
        estado_tumor = campos_archivo_leido.get("estado_tumor"),
        er_estado = campos_archivo_leido.get("er_estado"),
        pr_estado = campos_archivo_leido.get("pr_estado"),
        her2_estado = campos_archivo_leido.get("her2_estado"),
        supervivencia_meses = campos_archivo_leido.get("supervivencia_meses"),
        evento_recaida = campos_archivo_leido.get("evento_recaida")
    )

    #Actualizamos el paciente en la bd
    try:
        #Mandos la peticion para actualozar su datos, enviando el dato y el id del paciente que debemos de actualizar
        PacienteDAO.cargar_datos_clinicos(db, valores_campos, id_paciente)
    except Exception as error:
        #Si hay algun error al actualizar la bd, entonces regresamos el mensaje de error
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar datos del paciente: {str(error)}")

    #Guardamos el archivo de datos clinicos, definimos la carpeta donde se guardara
    carpeta_destino = "archivosClinicos"
    #Comprobamos la existencia de la carpeta
    os.makedirs(carpeta_destino, exist_ok=True)
    #Generamos el nombre del archivo con el id del paciente y la extension de un a hoja de calculo
    nombre_guardado = f"paciente_{id_paciente}.xlsx"
    #Hacemos la ruta del archivo
    ruta_archivo = os.path.join(carpeta_destino, nombre_guardado)
    #Regemos el puntero al inicio
    archivo_subido.file.seek(0)
    #Abrimos el archivo  creado
    with open(ruta_archivo, "wb") as archivo_creado:
        #Dentro del archivo creado escribimos lo que leamos del archivo subido
        archivo_creado.write(archivo_subido.file.read())

    #Si todo es correcto, regresamos el mensaje de exito y el nombre del archivo que se creo
    return {
        "msg": "Archivo validado y datos del paciente actualizados correctamente.",
        "archivo_guardado": nombre_guardado
    }





# Funcion para cargar archivo datos transcriptomicos
@router.post("/cargar-archivo-transcriptomico/{id_paciente}")
def cargar_archivo_paciente(id_paciente: int, archivo_subido: UploadFile = File(...), db: Session = Depends(get_db)):
    #Primero debemos de verificar que se un archivo con extension valida
    if not validaciones_archivos.validar_tipo_archivo(archivo_subido):
        #Si la extension no es valida entonces marcamos el error y lo regresamos
        raise HTTPException(status_code=400, detail="El archivo debe ser Excel o CSV.")
    
    #Ahora debemos de validar el formato del contenido del archivo
    validacion_formato = validaciones_archivos.validar_archivo_transcriptomico(archivo_subido)
    if isinstance(validacion_formato, dict) and validacion_formato.get("msg"):
        #Si contiene algun error,. entonces mandamos el mensaje
        raise HTTPException(status_code=400, detail=validacion_formato["msg"])

    #En dado de que no tenga errores, debemos de obtnemos el contendido del archivo
    df = validacion_formato

    #Guardamos el archivo de datos transcriptomicos encriptado
    carpeta_destino = "archivosTranscriptomicos"
    os.makedirs(carpeta_destino, exist_ok=True)
    nombre_guardado = f"paciente_{id_paciente}.xlsx"
    ruta_archivo = os.path.join(carpeta_destino, nombre_guardado)

    archivo_subido.file.seek(0)
    with open(ruta_archivo, "wb") as f:
        f.write(archivo_subido.file.read())

    try:
        #leemos el archivos como bytes
        archivo_subido.file.seek(0)
        archivo_bytes = archivo_subido.file.read()  

        # convertimos los bytes a bse 64
        b64_str = base64.b64encode(archivo_bytes).decode("utf-8")

        # encriptamos todo el archivos
        encrypted_str = modelo_aes.encriptar(b64_str) 

        # Guardamos el string cifrado en disco como bytes
        carpeta_destino = "archivosTranscriptomicos"
        os.makedirs(carpeta_destino, exist_ok=True)
        nombre_guardado = f"paciente_{id_paciente}.bin" 
        ruta_archivo = os.path.join(carpeta_destino, nombre_guardado)

        with open(ruta_archivo, "wb") as f:
            f.write(encrypted_str.encode("utf-8"))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cifrar el archivo: {str(e)}")

    return {
        "msg": "Archivo validado y expresión génica actualizados correctamente.",
        "archivo_guardado": nombre_guardado
    }