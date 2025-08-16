from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from database import get_connection
from auth import hash_password, verify_password, create_access_token
from jose import JWTError, jwt

SECRET_KEY = "clave_super_secreta"
ALGORITHM = "HS256"

app = FastAPI()

# Configuración CORS (permitir acceso desde React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cambia por el dominio de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seguridad OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Modelos de datos
class RegistroOncologo(BaseModel):
    correoElectronico: str
    contrasenia: str
    nombreOncologo: str
    apellidoOncologo: str
    institucionOncologo: str
    telefonoOncologo: str

class LoginRequest(BaseModel):
    username: str
    password: str

# ---------------- REGISTRO ----------------
@app.post("/register")
def register(request: RegistroOncologo):
    
    #Establecemos la conexión con la base de datos
    conn = get_connection()

    #Establecemos el cursor de la tabla del diccionario de usuarios
    cursor = conn.cursor(dictionary=True)

    #Primero comprobamos que el correo electronico no esta registrado previamente
    cursor.execute("SELECT * FROM usuario WHERE correo_electronico = %s", (request.correoElectronico,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="El usuario ya existe")


    #Si esta correcto entonces encriptamos la contraseña e insertamos el usuario
    hashed_pass = hash_password(request.contrasenia)
    cursor.execute("INSERT INTO usuario (tipo_usuario, correo_electronico, contrasenia) VALUES (0, %s, %s)", (request.correoElectronico, hashed_pass))
    conn.commit()


    #Una vez insertado el usuario ahora obtenemos su id e incertamos el oncologo
    cursor.execute("SELECT id_usuario FROM usuario WHERE correo_electronico = %s", (request.correoElectronico,))
    usuario = cursor.fetchone()
    #Si no recuperamos el id, entoncesmo cerramos la conexion y mandamos mensaje de error
    if not usuario:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail="Error al recuperar el usuario")

    id_usuario = usuario["id_usuario"]
    # Ahora insertamos el oncologo
    cursor.execute("INSERT INTO oncologo (id_usuario, nombre, apellido, institucion, telefono) VALUES (%s, %s, %s, %s, %s)", (id_usuario, request.nombreOncologo, request.apellidoOncologo, request.institucionOncologo, request.telefonoOncologo))
    conn.commit()

    
    #Cerramos la conexion
    cursor.close()
    conn.close()
    return {"msg": "Usuario registrado correctamente"}




# ---------------- LOGIN ----------------
@app.post("/login")
def login(request: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username = %s", (request.username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token = create_access_token({"sub": user["username"]})
    return {"token": token, "username": user["username"]}

# ---------------- DEPENDENCIA PARA VERIFICAR TOKEN ----------------
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# ---------------- RUTA PROTEGIDA ----------------
@app.get("/perfil")
def perfil(username: str = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, username FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return {"usuario": user}
