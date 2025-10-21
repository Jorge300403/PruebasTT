import smtplib
from email.message import EmailMessage
from fastapi import HTTPException
from validaciones import modelo_aes

# Definimos el host, el puerto, el correo, la contraseña de aplicación para envíar correos y la URL del backend.
SMTP_HOST = "smtp.gmail.com"
SMTP_PUERTO = 587
SMTP_CORREO = "srtcdmbd@gmail.com"
SMTP_CONTRASENIA = "nfuhvucavlpsdksg" 
BACKEND_URL = "http://127.0.0.1:8000"

def enviar_correo_verificacion(corre_electronico: str, token: str):
    try:
        link_verificacion = f"{BACKEND_URL}/oncologo/verificar-correo?token={token}"

        msg = EmailMessage()
        msg["Subject"] = "Verifica tu correo"
        msg["From"] = SMTP_CORREO
        msg["To"] = modelo_aes.desencriptar(corre_electronico)
        msg.set_content(
            f"Hola,\n\nPor favor verifica tu correo haciendo clic en el siguiente enlace:\n{link_verificacion}\n\n"
            "Si no fuiste tú, ignora este mensaje."
        )

        with smtplib.SMTP(SMTP_HOST, SMTP_PUERTO) as server:
                server.starttls()
                server.login(SMTP_CORREO, SMTP_CONTRASENIA) 
                server.sendmail(SMTP_CORREO, modelo_aes.desencriptar(corre_electronico), msg.as_string())

    except smtplib.SMTPAuthenticationError:
        raise HTTPException(status_code=500, detail="Error en la contraseña de aplicación")
    except smtplib.SMTPException as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar correo: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado al enviar correo: {str(e)}")
      
