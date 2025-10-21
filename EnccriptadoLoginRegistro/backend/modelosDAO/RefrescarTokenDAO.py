from sqlalchemy.orm import Session
from modelos.RefrescarToken import RefrescarToken
from validaciones import modelo_aes
from schemas import schema_refrescar_token
from datetime import datetime, timedelta





#Funcion para guardar el token refrescar
def creat_token_refrescar (db: Session, jti_token: str, id_usuario: int):
    #Creamos el token
    nuevo_token_refrescar = RefrescarToken(
        jti = jti_token,
        usuario_id = id_usuario,
        expires_at = datetime.utcnow() + timedelta(minutes=15),
        revoked=False
    )
    
    #Agreamos el token a la bd y actualizamo sla bd
    db.add(nuevo_token_refrescar)
    db.commit()
    db.refresh(nuevo_token_refrescar)

    #Regresamos el token creado
    return nuevo_token_refrescar




#Funcion para verifciar que el no haya sido revocado
def read_token_revocado (db: Session, jti_token):
    #Obtenemos el token a partir del jti
    token_refrescar = db.query(RefrescarToken).filter(RefrescarToken.jti == jti_token).first()
    if not token_refrescar:
        #Si no existe el token, entonces regresamos un false
        return True
    if token_refrescar.revoked:
        #Si existe pero esta revocado, regresamos un false
        return True
    
    #Si existe y no esta revocado regresamos un true
    return False





#Funcion para revocar el token
def update_revocar_token(db: Session, jti_token):
    #Obtenemos el token por su jti
    token_refrescar = db.query(RefrescarToken).filter(RefrescarToken.jti == jti_token).first()
    
    if token_refrescar:
        #Si existe el token buscado entonces lo revocamos
        token_refrescar.revoked = True

        #Actailizamos la bd
        db.add(token_refrescar)
        db.commit() 
        db.refresh(token_refrescar)

    #Regresmoa el token actualizado
    return token_refrescar