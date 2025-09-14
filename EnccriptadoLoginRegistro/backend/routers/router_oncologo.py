from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from modelosDAO import OncologoDAO
from schemas import schema_oncologo
from modelos.Oncologo import Oncologo
from modelos.Usuario import Usuario
from validaciones import autentificacion_password
from fastapi.security import OAuth2PasswordBearer
from database import SessionLocal
from jose import JWTError, jwt
from correos import verificar_correo
from validaciones import encriptar_aes
from correos import correo_restablecer_contrasenia
from database import get_db
from fastapi.responses import RedirectResponse


FRONTEND_URL = "http://localhost:3000"


# Le asignamos el prefijo de oncologo para la peticiones que solo son del oncologo
router = APIRouter(prefix="/oncologo", tags=["oncologo"])



# Definimos el esquema de OAuth2 para que extraiga el token del header autorización
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="oncologo/login")



#Peticion para registrar un nuevo oncologo 
@router.post("/register")
#Debemos de recibir los datos para registar el oncologo, y la sesion la cual la obtenemos
def register(datos_oncologo: schema_oncologo.OncologoCreate, db: Session = Depends(get_db)): 

    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_usuario = OncologoDAO.obtener_usuario_por_coreo(db, datos_oncologo.correo_electronico) 

    #Debemos de verificar que el correo que se ingreso no este registrado previamente
    if validacion_usuario:
        #Si el correo ya esta registrado, entonces mandamos el mensaje de que ya existe este usuario
        raise HTTPException(status_code=400, detail="El correo ha sido registrado previamente") 
    #Si no esta registrado, entonces creamos el nuevo oncologo, mandamos la db y los datos del formulario
    OncologoDAO.crear_oncologo(db, datos_oncologo) 

    #Una vez creado entonces hacemos el proceso de validación de cuenta, creamos el token a partir del correo electronico
    token = autentificacion_password.crear_token_verificar_correo(datos_oncologo.correo_electronico.strip()) 
    try:
        #Enviamos el correo con el link para la verificación del correo enviado el correo y el token
        verificar_correo.enviar_correo_verificacion(datos_oncologo.correo_electronico.strip(), token)
    except Exception as e:
        #En caso de que no se logre enviar el correo, mandamos un mensaje de que ocurrio un error interno
        print("Error enviando email:", e)

    #Si todo esta correcto, regresamos el mensaje de exito
    return {"msg": "Cuenta creada correctamente. Revisa tu correo para verificar la cuenta."} 





#Peticion para reenviar el correo de verificacion de cuenta
@router.post("/reenviar-verificacion")
#Debemos el correo del oncologo, y la sesion la cual la obtenemos
def reenviar_verificacion_cuenta(datos_oncologo: schema_oncologo.OncologoCorreo, db: Session = Depends(get_db)): 
    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_usuario = OncologoDAO.obtener_usuario_por_coreo(db, datos_oncologo.correo_electronico) 
    
    #Debemos de verificar que el correo que se ingreso no este registrado previamente
    if validacion_usuario:
        #Si el correo existe, entonces debemos de enviar el token otra vez, pero uno nuevo
        token = autentificacion_password.crear_token_verificar_correo(encriptar_aes.desencriptar(validacion_usuario.correo_electronico).strip()) 
        try:
            #Enviamos el correo con el link para la verificación del correo enviado el correo y el token
            verificar_correo.enviar_correo_verificacion(datos_oncologo.correo_electronico.strip(), token)
        except Exception as e:
            #En caso de que no se logre enviar el correo, mandamos un mensaje de que ocurrio un error interno
            print("Error enviando email:", e)

        #Si todo esta correcto, regresamos el mensaje de exito
        return {"msg": "Si el correo existe hemos enviado el enlace para verificar cuenta. Revisa tu correo para verificar la cuenta."} 





#Peticion para hacer el login
@router.post("/login")
#Debemos de recibir el correo y contraseña del oncologo y la db
def login(datos_oncologo: schema_oncologo.OncologoLogin, db: Session = Depends(get_db)): 

    #Primero hacemos la verificación si es que esta registrado este usuario a partir de su correo
    validacion_usuario = OncologoDAO.obtener_usuario_por_coreo(db, datos_oncologo.correo_electronico)
   
    if not validacion_usuario:
        #Si el correo no existe entonces mostramos un mensaje 
        raise HTTPException(status_code=401, detail="El correo ingresado no está registrado")
    
    if not autentificacion_password.verificar_contrasenia(datos_oncologo.contrasenia, validacion_usuario.contrasenia):
        #Verificamos la contraseña, si es incorrecta entoncces mostramos mensaje, 
        raise HTTPException(status_code=401, detail="La contraseña es incorrecta")
    
    if not validacion_usuario.es_verificado:
        #Si el correo aun no esta verificado entonces mostramos mensaje
        raise HTTPException(status_code=403, detail="Correo no verificado")
    
    #Si no hay errores, creamos el token de acceso donde guardamos el id del correo
    token = autentificacion_password.crear_token_acceso(str(validacion_usuario.id_usuario))

    #Si todo salio bien entones regresamos el token y el tipo de token
    return {"access_token": token, "token_type": "bearer"}





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





# Peticion para obeter datos perfil del oncologo, debemos de regresar la infromacion del schema de corresponde al perfil del oncologo
@router.get("/perfil", response_model=schema_oncologo.OncologoResponsePerfil) 

#Primero debemos de obtener el usuario con el que se inicio sesion, para ello accedemos al token que tiene sesion activa
def get_oncologo_perfil(usuario_en_token: Usuario = Depends(obtener_usuario_actual), db: Session = Depends(get_db)):
    
    #Obteneos los datos del oncologo a partir del usario en token que regresa
    oncologo_en_token = OncologoDAO.obtener_oncologo_por_id(db, usuario_en_token.id_usuario)
    
    if not oncologo_en_token:    
        # Si no se encontro entonces marcamos el error
        raise HTTPException(status_code=404, detail="Oncólogo no encontrado")


    #Si todo esta bien y se encontro, entonces le asignamos los valores al schema dado que eso es lo que debemos de regresar
    return schema_oncologo.OncologoResponsePerfil(
        id_usuario = usuario_en_token.id_usuario,
        correo_electronico = encriptar_aes.desencriptar(usuario_en_token.correo_electronico),
        nombre = encriptar_aes.desencriptar(oncologo_en_token.nombre),
        apellido = encriptar_aes.desencriptar(oncologo_en_token.apellido),
        institucion = encriptar_aes.desencriptar(oncologo_en_token.institucion),
        telefono = encriptar_aes.desencriptar(oncologo_en_token.telefono)
    )





# Petición para hacer la verificación del correo
@router.get("/verificar-correo")
#Debemos de recibir el token el cual obtenemos el enlace y la sesion
def verificar_email(token: str = Query(...), db: Session = Depends(get_db)): 
    
    try: 
        # Decodificamos el token para obtener el correo
        correo_electronico_decodificado = autentificacion_password.decodificar_token_verificar_correo(token)
    except JWTError:
        #Si hay un error entonces regresamos el mensaje de token invalido o expirado
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    #Obtenemos el usuario correspondiente segun el correo que esta en el token 
    usuario_en_token = OncologoDAO.obtener_usuario_por_coreo(db, correo_electronico_decodificado) 
    
    if not usuario_en_token:
        #Si no existe el usuario entonces mandamos mensaje de error
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if usuario_en_token.es_verificado:
        #Si el correo ya esta verificado mostramos la pantalla
        return RedirectResponse(url = f"{FRONTEND_URL}/correo-verificado")

    #Si no estaba verificado entonces lo hacemos, y cambiaos el estadi a true y actualizamos en la bd
    OncologoDAO.verificar_correo(db, usuario_en_token)
    #Si se hizo exitosamente la verifcacion del correo, mostramos la pantalla de verificación exitosa
    return RedirectResponse(url = f"{FRONTEND_URL}/correo-verificado")


@router.post("/olvido-contrasenia")
def restablecer_contrasenia(datos_usuario: schema_oncologo.OncologoCorreo, db: Session = Depends(get_db)): #Recibimos el correo del oncologo
    validacion_usuario = OncologoDAO.obtener_usuario_por_coreo(db, datos_usuario.correo_electronico) # Obtenemos el usuario que se haya encontrado a partir de sus correo electronico
    
    #Si existen entonces debemos de mandar el correo electronico para restablecer la contraseña
    if validacion_usuario:
        token = autentificacion_password.crear_token_restablecer_contrasenia(str(validacion_usuario.id_usuario)) #Creamos token para enviar correo y restablecer contrasenia
        print("token generado: " + token)
        try:
            correo_restablecer_contrasenia.enviar_correo_restablecer_contrasenia(validacion_usuario.correo_electronico, token) #Enviamos el correo, con el link del token 
        except Exception as e:
            print("Error enviando email:", e)

        return {"msg": "Usuario registrado. Revisa tu correo para restablecer contraseña."} 
    else:        
        raise HTTPException(status_code=401, detail="Correo no existente")
    

@router.post("/restablecer-contrasenia")
def restablecer_contrasenia(datos_usuario: schema_oncologo.OncologoUpdatePassword , db: Session = Depends(get_db)):
    # Decodificamos el correo en el token
    try:
        id_usuario_en_token = autentificacion_password.decodificar_token_restablecer_contrasenia(datos_usuario.token)
    except JWTError:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")
    
    usuario_en_token = OncologoDAO.obtener_usuario_por_id(db, id_usuario_en_token)
    if not usuario_en_token:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    OncologoDAO.actualizar_contrasenia(db, usuario_en_token, datos_usuario.contrasenia)
    
    return {"msg": "Contraseña restablecida correctamente"}
    