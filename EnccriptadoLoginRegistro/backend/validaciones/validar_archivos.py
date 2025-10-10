# validar_archivos.py
from fastapi import UploadFile
import pandas as pd
from io import BytesIO

def validar_tipo_archivo(archivo_subido: UploadFile):
    extensiones_validas = ["xlsx", "xls", "csv"]
    extension = archivo_subido.filename.split(".")[-1].lower()
    return extension in extensiones_validas



def validar_archivo_clinico(archivo_subido: UploadFile):    
    extension = archivo_subido.filename.split(".")[-1].lower()

    # Convertir a BytesIO
    archivo_bytes = BytesIO(archivo_subido.file.read())
    archivo_subido.file.seek(0)  # reiniciar el puntero para guardar luego

    try:
        if extension in ["xlsx", "xls"]:
            df = pd.read_excel(archivo_bytes)
        else:
            df = pd.read_csv(archivo_bytes)
    except Exception as e:
        return {"msg": f'Error al leer el archivo: {str(e)}'}

    # Validar columnas
    columnas_esperadas = {"dato", "valor"}
    if not columnas_esperadas.issubset(set(df.columns.str.lower())):
        return {"msg": "El archivo debe contener las columnas 'dato' y 'valor'."}

    # Validar datos requeridos
    datos_requeridos = {
        "estado_tumor", "er_estado", "pr_estado",
        "her2_estado", "supervivencia_meses", "evento_recaida"
    }
    datos_en_archivo = set(df["dato"].str.lower().tolist())
    faltantes = datos_requeridos - datos_en_archivo
    if faltantes:
        return {"msg": f"Faltan los siguientes campos: {', '.join(faltantes)}"}

    return df
