from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request

async def validacion_datos(request: Request, exc: RequestValidationError):
    errores = []
    for e in exc.errors():
        campo = e["loc"][-1] 
        mensaje = ""

        # Mensajes de cada uno de los campos
        if campo == "nombre":
            mensaje = "Solo letras, máximo 100 caracteres."
        elif campo == "apellido":
            mensaje = "Solo letras, máximo 100 caracteres."
        elif campo == "correo_electronico":
            mensaje = "Formato de correo inválido."
        elif campo == "contrasenia":
            mensaje = "Mínimo 8 caracteres, una mayúscula, un número y un símbolo."
        elif campo == "institucion":
            mensaje = "Solo letras, máximo 100 caracteres."
        elif campo == "telefono":
            mensaje = "El número debe ser de 10 dígitos."
        else:
            mensaje = e["msg"]

        errores.append({
            "campo": campo,
            "mensaje": mensaje
        })

    return JSONResponse(
        status_code=400,
        content={"errores": errores},
    )
