from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for e in exc.errors():
        field = e["loc"][-1]  # Campo con error
        message = ""

        # Mensajes personalizados según el campo
        if field == "nombre":
            message = "Solo letras, máximo 100 caracteres."
        elif field == "apellido":
            message = "Solo letras, máximo 100 caracteres."
        elif field == "correo_electronico":
            message = "Formato de correo inválido."
        elif field == "contrasenia":
            message = "Mínimo 8 caracteres, una mayúscula, un número y un símbolo."
        elif field == "institucion":
            message = "Solo letras, máximo 100 caracteres."
        elif field == "telefono":
            message = "El número debe ser de 10 dígitos."
        else:
            message = e["msg"]

        errors.append({
            "campo": field,
            "mensaje": message
        })

    return JSONResponse(
        status_code=400,
        content={"errores": errors},
    )
