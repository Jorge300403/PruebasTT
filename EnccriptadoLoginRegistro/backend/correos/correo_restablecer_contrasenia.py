import smtplib
from email.message import EmailMessage
from fastapi import HTTPException
from validaciones import encriptar_aes

# Definimos el host, el puerto, el correo, la contraseña de aplicación para envíar correos y la URL del backend.
SMTP_HOST = "smtp.gmail.com"
SMTP_PUERTO = 587
SMTP_CORREO = "srtcdmbd@gmail.com"
SMTP_CONTRASENIA = "nfuhvucavlpsdksg" 
FRONTEND_URL = "http://localhost:3000"
    

    
def enviar_correo_restablecer_contrasenia(corre_electronico: str, token:str):
    print("correo recibido: " + encriptar_aes.desencriptar(corre_electronico))
    try:
        link_verificacion = f"{FRONTEND_URL}/restablecer-contrasenia?token={token}"

        msg = EmailMessage()
        msg["Subject"] = "Restablecer contraseña"
        msg["From"] = SMTP_CORREO
        msg["To"] = encriptar_aes.desencriptar(corre_electronico)
        msg.set_content(
            f"Hola,\n\nPara restablecer tu contraseña da clic en el siguiente enlace:\n{link_verificacion}\n\n"
            "Si no fuiste tú, ignora este mensaje."
        )

        with smtplib.SMTP(SMTP_HOST, SMTP_PUERTO) as server:
                server.starttls()
                server.login(SMTP_CORREO, SMTP_CONTRASENIA) 
                server.sendmail(SMTP_CORREO, encriptar_aes.desencriptar(corre_electronico), msg.as_string())

    except smtplib.SMTPAuthenticationError:
        raise HTTPException(status_code=500, detail="Error en la contraseña de aplicación")
    except smtplib.SMTPException as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar correo: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado al enviar correo: {str(e)}")   
