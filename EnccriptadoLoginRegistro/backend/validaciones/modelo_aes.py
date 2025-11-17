from Crypto.Cipher import AES
import base64
import os
import bcrypt

# Cremos la funcion para hash la contraseña, recibiendo el str de la contrasenia
def hash_contrasenia(contrasenia: str) -> str:
    #Regresamos la contraseña hash con utf-8
    return bcrypt.hashpw(contrasenia.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")





# Creamos la funcion para verificar la contraseña, recibiendo la conrtraseña ingresa str y la hash
def verificar_contrasenia(contrasenia_ingresada: str, contrasenia_hash: str) -> bool:
    #Si estas coiciden entonces regresamos la validacion
    return bcrypt.checkpw(contrasenia_ingresada.encode("utf-8"), contrasenia_hash.encode("utf-8"))





# Clave secreta de 32 bytes (guardar en .env)
LLAVE_SECRETA = os.getenv("LLAVE_SECRETA", "clave_super_segura_de_32bytes!!!").encode("utf-8")

# DEfinimos la función para rellenar dado que tenemos AES necesitmos múltiplos de 16
def pad(data: str) -> bytes:
    return data.encode("utf-8") + b"\0" * (16 - len(data.encode("utf-8")) % 16)

def unpad(data: bytes) -> str:
    return data.rstrip(b"\0").decode("utf-8")



# DEfinimos la funcion para encriptar con AES
def encriptar(dato: str) -> str:
    if dato is None:
        return None
    
   
    vector_inicializacion = os.urandom(16)  #Definimos el vecot de inicializacion 
    cifrado = AES.new(LLAVE_SECRETA, AES.MODE_CBC, vector_inicializacion) #Hacemos el cifrado
    dato_encriptado = cifrado.encrypt(pad(dato)) #Encriptamos el dato que haya llegado
    return base64.b64encode(vector_inicializacion + dato_encriptado).decode("utf-8") #Lo hacemos base 64



# DEfinimos la funcion apra desecriptar el AES
def desencriptar(dato_encriptado: str) -> str:
    if dato_encriptado is None:
        return None
    

    filas = base64.b64decode(dato_encriptado) #Definimos las filas
    vector_inicializacion = filas[:16] #Declaramos donde esta el vector de inicializacion
    cifrado = AES.new(LLAVE_SECRETA, AES.MODE_CBC, vector_inicializacion) #Definimos el cifrado
    dato_desencriptado = cifrado.decrypt(filas[16:]) #Desencriptamos el dato
    return unpad(dato_desencriptado)
