from fastapi import APIRouter, Depends, HTTPException, Query, Response, Request, status, Cookie
from sqlalchemy.orm import Session
from modelosDAO import OncologoDAO, PacienteDAO, RefrescarTokenDAO
from schemas import schema_oncologo
from modelos.Oncologo import Oncologo
from modelos.Usuario import Usuario
from modelos.RefrescarToken import RefrescarToken
from validaciones import validaciones_tokens
from fastapi.security import OAuth2PasswordBearer
from database import SessionLocal
from jose import JWTError, jwt
from correos import verificar_correo
from validaciones import modelo_aes
from correos import correo_restablecer_contrasenia
from database import get_db
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials





#Definimos la URL del frontend
FRONTEND_URL = "http://localhost:3000"





# Le asignamos el prefijo de oncologo para la peticiones que solo son del oncologo
router = APIRouter(prefix="/oncologo", tags=["oncologo"])





# Definimos el esquema de OAuth2 para que extraiga el token del header autorización
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="oncologo/login")





#Definimos la seguridad de la sesion
seguridad_sesion = HTTPBearer()





# DEfinimos las configuraciones para las cookies
COOKIE_NOMBRE_REFRESCAR = "refrescar_token"
COOKIE_SEGURIDAD = True  
COOKIE_HTTPONLY = True
COOKIE_SAMESITE = "lax"





#Peticion para registrar un nuevo oncologo 
@router.post("/register")
#Debemos de recibir los datos para registar el oncologo, y la sesion la cual la obtenemos
def registrar_oncologo(datos_oncologo: schema_oncologo.OncologoCreate, db: Session = Depends(get_db)): 


    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_usuario = OncologoDAO.read_usuario_por_correo(db, datos_oncologo.correo_electronico) 
    
    #Debemos de verificar que el correo que se ingreso no este registrado previamente
    if validacion_usuario:
        #Si el correo ya esta registrado, entonces mandamos el mensaje de que ya existe este usuario
        raise HTTPException(status_code=400, detail="El correo ha sido registrado previamente.") 
    
    #Si no esta registrado, entonces creamos el nuevo oncologo, mandamos la db y los datos del formulario
    oncologo_creado = OncologoDAO.creat_oncologo(db, datos_oncologo) 

    #Una vez creado entonces hacemos el proceso de validación de cuenta, creamos el token a partir del correo electronico
    token_verificar_correo = validaciones_tokens.crear_token_verificar_correo(str(oncologo_creado.id_usuario)) 
    
    try:
        #Enviamos el correo con el link para la verificación del correo enviado el correo y el token
        verificar_correo.enviar_correo_verificacion(oncologo_creado.correo_electronico, token_verificar_correo)
    except Exception as error:
        #En caso de que no se logre enviar el correo, mandamos un mensaje de que ocurrio un error interno
        raise HTTPException(status_code=500, detail={"Error al enviar email: " + error}) 

    #Si todo esta correcto, regresamos el mensaje de exito
    return {"msg": "Cuenta creada correctamente. Revisa tu correo para verificar la cuenta."} 






#Peticion para reenviar el correo de verificacion de cuenta
@router.post("/reenviar-verificacion")
#Debemos el correo del oncologo, y la sesion la cual la obtenemos
def reenviar_verificacion_cuenta(datos_oncologo: schema_oncologo.OncologoCorreo, db: Session = Depends(get_db)): 
    
    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_usuario = OncologoDAO.read_usuario_por_correo(db, datos_oncologo.correo_electronico) 
    
    #Debemos de verificar que el correo que se ingreso exista
    if validacion_usuario:
        #Si el correo existe, entonces debemos de enviar el token otra vez, pero uno nuevo
        token_verificar_correo = validaciones_tokens.crear_token_verificar_correo(str(validacion_usuario.id_usuario)) 
        try:
            #Enviamos el correo con el link para la verificación del correo enviado el correo y el token
            verificar_correo.enviar_correo_verificacion(validacion_usuario.correo_electronico, token_verificar_correo)
        except Exception as error:
            #En caso de que no se logre enviar el correo, mandamos un mensaje de que ocurrio un error interno
            raise HTTPException(status_code=500, detail={"Error al enviar email: " + error}) 

        #Si todo esta correcto, regresamos el mensaje de exito
        return {"msg": "Revisa tu correo para verificar tu cuenta, enviaremos un enlace para la verificación."} 
    





#Peticion para hacer el login
@router.post("/login")
#Debemos de recibir el correo y contraseña del oncologo y la db
def login(datos_oncologo: schema_oncologo.OncologoLogin, response: Response, db: Session = Depends(get_db)): 
  
    #Primero hacemos la verificación si es que esta registrado este usuario a partir de su correo
    validacion_usuario = OncologoDAO.read_usuario_por_correo(db, datos_oncologo.correo_electronico)

    if not validacion_usuario:
        #Si el correo no existe entonces mostramos un mensaje 
        raise HTTPException(status_code=400, detail="El correo ingresado no está registrado")

    if not validaciones_tokens.verificar_contrasenia(datos_oncologo.contrasenia, validacion_usuario.contrasenia):
        #Verificamos la contraseña, si es incorrecta entoncces mostramos mensaje, 
        raise HTTPException(status_code=400, detail="La contraseña es incorrecta.")
    
    if not validacion_usuario.es_verificado:
        #Si el correo aun no esta verificado entonces mostramos mensaje
        raise HTTPException(status_code=403, detail="Correo no verificado.")
    
    
    #Si no hay errores, creamos el token de acceso donde guardamos el id del correo
    token_acceso = validaciones_tokens.crear_token_acceso(str(validacion_usuario.id_usuario))

    #Creamos el token para refrescar y el jt
    token_refrescar, jti = validaciones_tokens.crear_token_refrescar(str(validacion_usuario.id_usuario))

    #Guardamos el token refrescar en la bd
    RefrescarTokenDAO.creat_token_refrescar(db, jti, validacion_usuario.id_usuario)

    # Poner refresh token como cookie httpOnly
    response.set_cookie(
        key=COOKIE_NOMBRE_REFRESCAR,
        value=token_refrescar,
        httponly=COOKIE_HTTPONLY,
        secure=COOKIE_SEGURIDAD,
        samesite=COOKIE_SAMESITE,
        max_age= 60 * 60 * 24 * 7  # 7 dias (en segundos)
    )

    #Si todo salio bien entones regresamos el token y el tipo de token, y el tipo de usuario
    return {"access_token": token_acceso, "token_type": "bearer", "tipo_usuario": validacion_usuario.tipo_usuario}
 





# Peticion para hacer el refresh
@router.post("/refrescar-token")
#Debemos de recibir la respuesta y la peticion, asi como la sesion
def refrescar_token(request: Request, response: Response, db: Session = Depends(get_db)):
    
    #Obtenemos el token a partir de la llave
    token_en_cookie = request.cookies.get(COOKIE_NOMBRE_REFRESCAR)
    if not token_en_cookie:
        #Si no hay ningun token, entonces regresamos el mensaje de error
        raise HTTPException(status_code=401, detail="No token refrecar")

    try:
        token_refrescar_decodificado = validaciones_tokens.decodificar_token(token_en_cookie)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refrescar token expirado")
    except Exception:
        raise HTTPException(status_code=401, detail="Refrescar token inválido")

    if token_refrescar_decodificado.get("purpose") != "crear_token_refrescar":
        raise HTTPException(status_code=401, detail="Tipo de token incorrecto")
    
    jti = token_refrescar_decodificado.get("jti")
    id_usuario = token_refrescar_decodificado.get("sub")

    # Verificar en BD si no fue revocado
    es_revocado = RefrescarTokenDAO.read_token_revocado(db, jti)

    if es_revocado:
        raise HTTPException(status_code=401, detail="Token refrescar es revocado o inválido")

    #Creamos el nuevo token de acceso
    nuevo_token_acceso = validaciones_tokens.crear_token_acceso(str(id_usuario))

    return {"access_token": nuevo_token_acceso, "token_type": "bearer"}







# Peticion para validar el token de login y obtener al usuario actual, recibimos el token que esta en la sesion
def obtener_usuario_actual(credenciales: HTTPAuthorizationCredentials = Depends(seguridad_sesion), db: Session = Depends(get_db)): 
    
    token = credenciales.credentials
    try:
        #Decodificamos el token para obtener el id del usuario
        token_acceso_decodificado = validaciones_tokens.decodificar_token(token)
        id_usuario_en_token = token_acceso_decodificado.get("sub")
    except JWTError:
        #Si no es valido entonces mostramos el error
        raise HTTPException(status_code=401, detail="Token inválido o expirados")


    #Si es valido obtenemos el suario completo que corresponde con el id que se guardo en el token
    usuario_en_token = OncologoDAO.read_usuario_por_id(db, id_usuario_en_token)

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
    oncologo_en_token = OncologoDAO.read_oncologo_por_id(db, usuario_en_token.id_usuario)

    if not oncologo_en_token:    
        # Si no se encontro entonces marcamos el error
        raise HTTPException(status_code=404, detail="Oncólogo no encontrado")


    #Si todo esta bien y se encontro, entonces le asignamos los valores al schema dado que eso es lo que debemos de regresar
    return schema_oncologo.OncologoResponsePerfil(
        id_usuario = usuario_en_token.id_usuario,
        correo_electronico = modelo_aes.desencriptar(usuario_en_token.correo_electronico),
        nombre = modelo_aes.desencriptar(oncologo_en_token.nombre),
        apellido_paterno = modelo_aes.desencriptar(oncologo_en_token.apellido_paterno),
        apellido_materno= modelo_aes.desencriptar(oncologo_en_token.apellido_materno),
        institucion = modelo_aes.desencriptar(oncologo_en_token.institucion),
        telefono = modelo_aes.desencriptar(oncologo_en_token.telefono)
    )
   





# Petición para hacer la verificación del correo
@router.get("/verificar-correo")
#Debemos de recibir el token el cual obtenemos el enlace y la sesion
def verificar_email(token: str = Query(...), db: Session = Depends(get_db)): 
    
    try: 
        # Decodificamos el token para obtener el id del usuario
        token_correo_decodificado = validaciones_tokens.decodificar_token(token)
        id_usuario_en_token = token_correo_decodificado.get("sub")
    except JWTError:
        #Si hay un error entonces redirigimos a la pagina de token expirado
        return RedirectResponse(url = f"{FRONTEND_URL}/token-correo-expirado")


    #Obtenemos el usuario correspondiente segun el correo que esta en el token 
    usuario_en_token = OncologoDAO.read_usuario_por_id(db, id_usuario_en_token) 

    if not usuario_en_token:
        #Si no existe el usuario entonces mandamos mensaje de error
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if usuario_en_token.es_verificado:
        #Si el correo ya esta verificado mostramos la pantalla
        return RedirectResponse(url = f"{FRONTEND_URL}/correo-verificado-exito")

    #Si no estaba verificado entonces lo hacemos, y cambiaos el estado a true y actualizamos en la bd
    OncologoDAO.update_verificar_correo(db, usuario_en_token)

    #Si se hizo exitosamente la verifcacion del correo, mostramos la pantalla de verificación exitosa
    return RedirectResponse(url = f"{FRONTEND_URL}/correo-verificado-exito")






#Funcio por si olvido la contraseña
@router.post("/olvido-contrasenia")
#Recibimos el correo del usuario
def restablecer_contrasenia(datos_usuario: schema_oncologo.OncologoCorreo, db: Session = Depends(get_db)): #Recibimos el correo del oncologo
    
    #Obtenemos el usuario por correo
    validacion_usuario = OncologoDAO.read_usuario_por_correo(db, datos_usuario.correo_electronico) # Obtenemos el usuario que se haya encontrado a partir de sus correo electronico
   
    #Si existen entonces debemos de mandar el correo electronico para restablecer la contraseña
    if validacion_usuario:
        #Creamos token para enviar correo y restablecer contrasenia
        token = validaciones_tokens.crear_token_restablecer_contrasenia(str(validacion_usuario.id_usuario)) 
        try:
            #Enviamos el correo, con el link del token 
            correo_restablecer_contrasenia.enviar_correo_restablecer_contrasenia(validacion_usuario.correo_electronico, token) 
        except Exception as e:
            print("Error enviando email:", e)

        return {"msg": "Si el correo existe, recibirás un enlace para restablecer tu contraseña."} 
    else:        
        raise HTTPException(status_code=400, detail="Correo no existente")
    




#Funcion para verificar la validez del token de restablcer contarseña
@router.get("/token-contrasenia")
def abrir_formulario_restablecer(token: str = Query(...)):
    print("Aqui")
    try:
        # Verificamos token
        validaciones_tokens.decodificar_token(token)
        print("Hola")
    except jwt.ExpiredSignatureError:
        #Si es invalido entonces redirigimos a la pantalla de token expirado
        return RedirectResponse(url=f"{FRONTEND_URL}/token-contrasenia-expirado")
    except JWTError:
        return RedirectResponse(url=f"{FRONTEND_URL}/token-contrasenia-expirado")
    
    # Token válido → redirigimos al formulario en frontend pasando el token
    return RedirectResponse(url=f"{FRONTEND_URL}/restablecer-contrasenia?token={token}")

    




@router.post("/restablecer-contrasenia")
#REcibimmos los nuevos datos de la contrasenia
def restablecer_contrasenia(datos_usuario: schema_oncologo.OncologoUpdatePassword , db: Session = Depends(get_db)):
    
    # Decodificamos el correo en el token
    try:
        #Obtenemos el id del usario en token
        token_contrasenia_decodificado = validaciones_tokens.decodificar_token(datos_usuario.token)
        id_usuario_en_token = token_contrasenia_decodificado.get("sub")
    except JWTError:
        #Si no existe el token
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    #Obtenemos el usuario por id
    usuario_en_token = OncologoDAO.read_usuario_por_id(db, id_usuario_en_token)

    if not usuario_en_token:
        #Si no existe entonces regresmoa el mensaje de error de usario no encontrado
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    #Si todo es correcta actualizamos la contraseña en la bd
    OncologoDAO.update_contrasenia(db, usuario_en_token, datos_usuario.contrasenia)
  
    #Regresamos el mensaje de exito
    return {"msg": "Contraseña restablecida correctamente"}






# Peticion para editar los datos del perfil del oncologo
@router.put("/editar")
# Debe recibir los parametros que se van a editar, asi como la sesion activa
def editar_datos_oncologo(datos_actualizados: schema_oncologo.OncologoUpdate, usuario_en_token: Usuario = Depends(obtener_usuario_actual), db: Session = Depends(get_db)):
    
    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_usuario = OncologoDAO.read_oncologo_por_id(db, usuario_en_token.id_usuario)
 
    #Debemos de verificar que exista el usuario
    if not validacion_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    #Actualizamos los datos en la bd
    OncologoDAO.update_datos_perfil(db, usuario_en_token.id_usuario, datos_actualizados)
  
    #Si todo esta correcto, regresamos el mensaje de exito
    return {"msg": "Información actualizada."} 






#Funcion obtener lista de pacientes con paginación
@router.get("/lista-pacientes")
def listar_pacientes(page: int = 1, limit: int = 10, db: Session = Depends(get_db), usuario_en_token: Usuario = Depends(obtener_usuario_actual)):
    
    if page < 1:
        page = 1
    if limit < 1:
        limit = 10

    skip = (page - 1) * limit
    pacientes = PacienteDAO.read_lista_pacientes_paginados(db, skip, limit, usuario_en_token.id_usuario)
    total = PacienteDAO.read_contar_pacientes(db, usuario_en_token.id_usuario)
    total_pages = (total + limit - 1) // limit

    return {
        "pacientes": pacientes,
        "page": page,
        "per_page": limit,
        "total": total,
        "total_pages": total_pages
    }





#Peticion para cerrar sesion
@router.post("/logout")
#Recibimos la peticion y la respuesta
def cerrar_sesion(request: Request, response: Response, db: Session = Depends(get_db)):
    #Obtenemos el token de la cookie por llave
    token_en_cookie = request.cookies.get(COOKIE_NOMBRE_REFRESCAR)
    if token_en_cookie:
        try:
            #Decodificamos el token
            token_refrescar_decodificado = validaciones_tokens.decodificar_token(token_en_cookie)
            #Obtenemos el jti del token
            jti = token_refrescar_decodificado.get("jti")
            #Recovamos el token en la bd
            RefrescarTokenDAO.update_revocar_token(db, jti)
        except Exception:
            pass

    #Borramos la cookie
    response.delete_cookie(COOKIE_NOMBRE_REFRESCAR)
    return {"detail": "Sesión cerrada"}