from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt

# Definimos la contraseña y el algoritmo que vamos a implementar para los token
LLAVE_HASH = "srtcdmbd"
ALGORITMO_HASH = "HS256"

# Definimos los timepos de expiración de cada uno de los token
TIEMPO_EXPIRACION_TOKEN_ENTRADA = 60
TIEMPO_EXPIRACION_TOKEN_VERIFICACION_CORREO = 60 * 24
TIEMPO_EXPIRACION_TOKEN_RESTABLCER_CONTRASENIA = 60


# Cremos la funcion para encriptar la contraseña
def hash_contrasenia(contrasenia: str) -> str:
    return bcrypt.hashpw(contrasenia.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

# Creamos la funcion para verificar la contraseña
def verificar_contrasenia(contrasenia_ingresada: str, contrasenia_hash: str) -> bool:
    return bcrypt.checkpw(contrasenia_ingresada.encode("utf-8"), contrasenia_hash.encode("utf-8"))





# Creamos la funcion apra crear el token del login
def crear_token_acceso(id_usuario: str) -> str:
    codificar_token = {
        "sub": id_usuario,
        "purpose": "crear_token_acceso",
        "exp": datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_TOKEN_ENTRADA),
    }
    return jwt.encode(codificar_token, LLAVE_HASH, algorithm=ALGORITMO_HASH)

# Función para decodificar el token y así poder verificar el correo
def decodificar_token_acceso(token: str) -> str:
    datos_decodificados = jwt.decode(token, LLAVE_HASH, algorithms=[ALGORITMO_HASH])
    if datos_decodificados.get("purpose") != "crear_token_acceso":
        raise JWTError("Invalid token purpose")
    id_usuario = datos_decodificados.get("sub")
    if not id_usuario:
        raise JWTError("Invalid token payload")
    return id_usuario





# Funcion para crear el token de verificación de correo
def crear_token_verificar_correo(corre_electronico: str) -> str:
    codificar_token = {
        "sub": corre_electronico,
        "purpose": "verificar_correo",
        "exp": datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_TOKEN_VERIFICACION_CORREO),
    }
    return jwt.encode(codificar_token, LLAVE_HASH, algorithm=ALGORITMO_HASH)

# Función para decodificar el token y así poder verificar el correo
def decodificar_token_verificar_correo(token: str) -> str:
    datos_decodificados = jwt.decode(token, LLAVE_HASH, algorithms=[ALGORITMO_HASH])
    if datos_decodificados.get("purpose") != "verificar_correo":
        raise JWTError("Invalid token purpose")
    correo_electronico = datos_decodificados.get("sub")
    if not correo_electronico:
        raise JWTError("Invalid token payload")
    return correo_electronico





#Funcion para crear el token de restabelcer contraseña
def crear_token_restablecer_contrasenia(id_usuario: str) -> str:
    codificar_token = {
        "sub": id_usuario,
        "purpose": "restablecer_contrasenia",
        "exp": datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_TOKEN_RESTABLCER_CONTRASENIA),
    }
    return jwt.encode(codificar_token, LLAVE_HASH, algorithm=ALGORITMO_HASH)

# Función para decodificar el token y así poder verificar el correo
def decodificar_token_restablecer_contrasenia(token: str) -> str:
    datos_decodificados = jwt.decode(token, LLAVE_HASH, algorithms=[ALGORITMO_HASH])
    if datos_decodificados.get("purpose") != "restablecer_contrasenia":
        raise JWTError("Invalid token purpose")
    id_usuario: str  = datos_decodificados.get("sub")
    if not id_usuario:
        raise JWTError("Invalid token payload")
    return id_usuario