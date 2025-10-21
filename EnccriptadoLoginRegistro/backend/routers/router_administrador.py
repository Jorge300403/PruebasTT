from fastapi import Depends, HTTPException, APIRouter, Query
from sqlalchemy.orm import Session
from database import get_db
from modelosDAO import AdministradorDAO
from validaciones import validaciones_tokens
from schemas import schema_administrador, schema_oncologo
from modelos.Usuario import Usuario
from modelosDAO import OncologoDAO
from validaciones import modelo_aes

FRONTEND_URL = "http://localhost:3000"


# Le asignamos el prefijo de oncologo para la peticiones que solo son del oncologo
router = APIRouter(prefix="/administrador", tags=["administrador"])





#Funcion para verificar si un usuario es administrador
def verificar_si_es_admin(usuario: Usuario, db: Session):

    if usuario.tipo_usuario == 1:

        #Si es administrador, entonces regresamos los datos del admin
        return True  

    return False  





@router.post("/register")
#Debemos de recibir los datos para registar el oncologo, y la sesion la cual la obtenemos
def register(datos_administrador: schema_administrador.AdministradorCreate, db: Session = Depends(get_db)): 

    #Debemos de obtener los datos que se ingresan en el formulario del front
    validacion_usuario = AdministradorDAO.obtener_usuario_por_coreo(db, datos_administrador.correo_electronico) 

    #Debemos de verificar que el correo que se ingreso no este registrado previamente
    if validacion_usuario:
        #Si el correo ya esta registrado, entonces mandamos el mensaje de que ya existe este usuario
        raise HTTPException(status_code=400, detail="El correo ha sido registrado previamente") 
    #Si no esta registrado, entonces creamos el nuevo oncologo, mandamos la db y los datos del formulario
    AdministradorDAO.crear_administrador(db, datos_administrador) 

    #Si todo esta correcto, regresamos el mensaje de exito
    return {"msg": "Cuenta creada correctamente."} 






#Funcion obtener lista de oncólogos con paginación
@router.get("/lista-oncologos")
def listar_oncologos(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    if page < 1:
        page = 1
    if limit < 1:
        limit = 10

    skip = (page - 1) * limit
    oncologos = OncologoDAO.obtener_oncologos_paginados(db, skip, limit)
    total = OncologoDAO.contar_oncologos(db)
    total_pages = (total + limit - 1) // limit

    return {
        "oncologos": oncologos,
        "page": page,
        "per_page": limit,
        "total": total,
        "total_pages": total_pages
    }





#Funcion para obtener los detalles de un oncologo
@router.get("/detalles-oncologo/{id_usuario}", response_model=schema_oncologo.OncologoResponsePerfil)
def obtener_detalle_oncologo(id_usuario: int, db: Session = Depends(get_db)):
    usuario_seleccionado = OncologoDAO.obtener_usuario_por_id(db, id_usuario)
    oncologo_seleccionado = OncologoDAO.obtener_oncologo_por_id(db, id_usuario)

    if not usuario_seleccionado:
        raise HTTPException(status_code=404, detail="Oncólogo no encontrado")
    
    # Desencriptar los datos antes de enviarlos al frontend
    return schema_oncologo.OncologoResponsePerfil(
        id_usuario=usuario_seleccionado.id_usuario,
        correo_electronico=modelo_aes.desencriptar(usuario_seleccionado.correo_electronico),
        nombre=modelo_aes.desencriptar(oncologo_seleccionado.nombre),
        apellido=modelo_aes.desencriptar(oncologo_seleccionado.apellido),
        telefono=modelo_aes.desencriptar(oncologo_seleccionado.telefono),
        institucion=modelo_aes.desencriptar(oncologo_seleccionado.institucion)
    )