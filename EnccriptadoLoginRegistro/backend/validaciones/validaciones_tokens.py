from datetime import datetime, timedelta
from jose import JWTError, ExpiredSignatureError, jwt
from typing import Optional
import uuid
import bcrypt
from fastapi import HTTPException

# Definimos la contraseña y el algoritmo que vamos a implementar para los token
LLAVE_HASH = "srtcdmbd"
ALGORITMO_HASH = "HS256"





# Definimos los timepos de expiración de cada uno de los token 
TIEMPO_EXPIRACION_TOKEN_ACCESO = 5 # 15 minutos
TIEMPO_EXPIRACION_TOKEN_REFRESH = 15 # 7 dias
TIEMPO_EXPIRACION_TOKEN_VERIFICACION_CORREO = 1 # 1 dia
TIEMPO_EXPIRACION_TOKEN_RESTABLCER_CONTRASENIA = 60 # 60 minutos





# Cremos la funcion para hash la contraseña, recibiendo el str de la contrasenia
def hash_contrasenia(contrasenia: str) -> str:
    #Regresamos la contraseña hash con utf-8
    return bcrypt.hashpw(contrasenia.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")





# Creamos la funcion para verificar la contraseña, recibiendo la conrtraseña ingresa str y la hash
def verificar_contrasenia(contrasenia_ingresada: str, contrasenia_hash: str) -> bool:
    #Si estas coiciden entonces regresamos la validacion
    return bcrypt.checkpw(contrasenia_ingresada.encode("utf-8"), contrasenia_hash.encode("utf-8"))





# Creamos la funcion apra crear el token del login, este solo durara 15 min
def crear_token_acceso(id_usuario: str) -> str:
    codificar_token = {
        #Lo que guardamos en este token es el id del usario que intenta iniciar sesion
        "sub": id_usuario,
        "purpose": "crear_token_acceso",
        #Le damos un tiempo de expiracion de 15 min, este se refrescara
        "exp": datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_TOKEN_ACCESO),
    }
    return jwt.encode(codificar_token, LLAVE_HASH, algorithm=ALGORITMO_HASH)





#Creamos la funcion para crear el toke refresh, este durara 7 dias
def crear_token_refrescar(id_usuario: str, jti: Optional[str] = None) -> tuple[str, str]:
    #Recibimos el identificador del token si no tiene, entonces creamos uno de manera aleatoria
    if not jti:
        jti = str(uuid.uuid4())
    codificar_token = {
        #Guardamos el id del usuario
        "sub": id_usuario,
        "purpose": "crear_token_refrescar",
        #Le damos un tiempo de expiracion de 7 dias
        "exp": datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_TOKEN_REFRESH),
        "jti": jti
    }
    token = jwt.encode(codificar_token, LLAVE_HASH, algorithm=ALGORITMO_HASH)
    #Devolvemoss un tupla del token con el identificador del token
    return token, jti





# Funcion para crear el token de verificación de correo
def crear_token_verificar_correo(id_usuario: str) -> str:
    codificar_token = {
        "sub": id_usuario,
        "purpose": "verificar_correo",
        "exp": datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_TOKEN_VERIFICACION_CORREO),
    }
    return jwt.encode(codificar_token, LLAVE_HASH, algorithm=ALGORITMO_HASH)





#Funcion para crear el token de restabelcer contraseña
def crear_token_restablecer_contrasenia(id_usuario: str) -> str:
    codificar_token = {
        "sub": id_usuario,
        "purpose": "restablecer_contrasenia",
        "exp": datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_TOKEN_RESTABLCER_CONTRASENIA),
    }
    return jwt.encode(codificar_token, LLAVE_HASH, algorithm=ALGORITMO_HASH)





# Función para decodificar los token
def decodificar_token(token: str):
    try:
        return jwt.decode(token, LLAVE_HASH, algorithms=[ALGORITMO_HASH])
    except ExpiredSignatureError:
        # Token expirado
        raise HTTPException(status_code=401, detail="Token expirado")
    except JWTError:
        # Otro error de token
        raise HTTPException(status_code=401, detail="Token inválido")