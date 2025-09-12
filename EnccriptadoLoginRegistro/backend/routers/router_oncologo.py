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


# Le asignamos el prefijo de oncologo para la peticiones que solo son del oncologo
router = APIRouter(prefix="/oncologo", tags=["oncologo"])



# Definimos el esquema de OAuth2 para que extraiga el token del header autorización
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="oncologo/login")



# Creamos la sesion con la bd
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# Peticion para registrar un nuevo oncologo
@router.post("/register")
def register(datos_oncologo: schema_oncologo.OncologoCreate, db: Session = Depends(get_db)): #Recibimos el schema con los datos del formulario de registro del oncologo
    validacion_usuario = OncologoDAO.obtener_usuario_por_coreo(db, datos_oncologo.correo_electronico) # Obtenemos el usuario que se haya encontrado a partir de sus correo electronico
    if validacion_usuario:
        raise HTTPException(status_code=400, detail="El correo ya está registrado") #Si devuleve algo es pq ya esta registrado ese correo, entonces por eso mandamos el error
    OncologoDAO.crear_oncologo(db, datos_oncologo) #Si no devuelve nada, entonces creamos al oncologo


    #Una vez creado entonces hacemos el proceso de validación de cuenta
    token = autentificacion_password.crear_token_verificar_correo(datos_oncologo.correo_electronico.strip()) #Creamos token para verificar el correo
    try:
        verificar_correo.enviar_correo_verificacion(datos_oncologo.correo_electronico.strip(), token) #Enviamos el correo, con el link del token para que verifique la cuenta, con solo dar clic ya se verifica
    except Exception as e:
        print("Error enviando email:", e)

    return {"msg": "Registro exitoso. Revisa tu correo para verificar la cuenta."} 



# Peticion para hacer el login
@router.post("/login")
def login(datos_oncologo: schema_oncologo.OncologoLogin, db: Session = Depends(get_db)): #Recibimos el schema con los datos del formulario del login del oncologo
    validacion_usuario = OncologoDAO.obtener_usuario_por_coreo(db, datos_oncologo.correo_electronico) #Buscamos en la bd el usuario a partir del correo que ingreso en el formulario del login
   
    
    #Si existen errores, entonces mostramos los mensajes
    if not validacion_usuario:
        raise HTTPException(status_code=401, detail="Correo no existente")
    
    if not autentificacion_password.verificar_contrasenia(datos_oncologo.contrasenia, validacion_usuario.contrasenia):
        raise HTTPException(status_code=401, detail="Credenciales invalidas")
    
    if not validacion_usuario.es_verificado:
        raise HTTPException(status_code=403, detail="Correo no verificado")

    
    #Si no hay errores, creamos el token de acceso donde guardamos el id del correo
    token = autentificacion_password.crear_token_acceso(str(validacion_usuario.id_usuario))
    return {"access_token": token, "token_type": "bearer"}



# Peticion para validar el token de login y obtener al usuario actual
def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)): #Recibimos el token que se esta moviendo en el front
    

    #Si es valido entonces debemos obtener el usuario actual
    try:
        datos_decodificados = jwt.decode(token, autentificacion_password.LLAVE_HASH, algorithms=[autentificacion_password.ALGORITMO_HASH]) #Decodificamos el token que envía el front
        id_usuario_en_token: str = datos_decodificados.get("sub") #Obtenemos el id del usuario que se logueo
        if id_usuario_en_token is None:
            raise HTTPException(status_code=401, detail="Token inválido o expirados", headers={"WWW-Authenticate": "Bearer"})
    except JWTError:
            raise HTTPException(status_code=401, detail="Token inválido o expirados", headers={"WWW-Authenticate": "Bearer"})

    #Si es valido obtenemos el suario completo que corresponde con el id que se guardo en el token
    usuario_en_token = db.query(Usuario).filter(Usuario.id_usuario == int(id_usuario_en_token)).first()


    #Si no se encuentra el usario entonces volvemos a marcar un error
    if usuario_en_token is None:
            raise HTTPException(status_code=401, detail="Token inválido o expirados", headers={"WWW-Authenticate": "Bearer"})
    
    
    #Debemos de regresar el usuario encontrado
    return usuario_en_token


# Peticion para obeter datos perfil del oncologo
@router.get("/perfil", response_model=schema_oncologo.OncologoResponsePerfil) #Debemos de regresar la infromacion del schema de corresponde al perfil del oncologo
def get_oncologo_perfil(usuario_en_token: Usuario = Depends(obtener_usuario_actual), db: Session = Depends(get_db)):
    oncologo_en_token = db.query(Oncologo).filter(Oncologo.id_usuario == usuario_en_token.id_usuario).first() #Obtenemos el oncologoq ue corresponda con el id que esta guardado en el token
    
    
    # Si no se encontro entonces marcamos el error
    if not oncologo_en_token:
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
def verify_email(token: str = Query(...), db: Session = Depends(get_db)): #Recibimos el token en forma stringquery
    
    
    # Decodificamos el correo en el token
    try:
        correo_electronico_decodificado = autentificacion_password.decodificar_token_verificar_correo(token)
    except JWTError:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")


    usuario_en_token = OncologoDAO.obtener_usuario_por_coreo(db, correo_electronico_decodificado) #Obtenemos el usuario correpsondinte al correo que viene en el token
    
    
    if not usuario_en_token:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if usuario_en_token.es_verificado:
        return {"msg": "El correo ya estaba verificado"} #Debemos de mostrar una pagina de exito de verificación

    
    usuario_en_token.es_verificado = True #Cambaimos el estado de verificadoa true
    db.add(usuario_en_token)
    db.commit()


    return {"msg": "Correo verificado correctamente"} #Debemos de mostrar una pagina de exito de verificación


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
    
    usuario_en_token = db.query(Usuario).filter(Usuario.id_usuario == id_usuario_en_token).first()
    if not usuario_en_token:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    OncologoDAO.actualizar_contrasenia(db, usuario_en_token, datos_usuario.contrasenia)
    
    return {"msg": "Contraseña restablecida correctamente"}
    