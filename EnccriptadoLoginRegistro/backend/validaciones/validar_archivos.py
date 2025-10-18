from fastapi import UploadFile
import pandas as pd
from io import BytesIO
import os





#Funcion para validar que el archivo sea una hoja de calculo, recibimos el archivo
def validar_tipo_archivo(archivo_subido: UploadFile):

    #Declaramos las extensiones que son validas
    extensiones_validas = ["xlsx", "xls", "csv"]

    #Obtenemos la extension del archivo que recibimos
    extension = archivo_subido.filename.split(".")[-1].lower()

    #Si la extension del archivo esta dentro de las validas, entonces regresamos la extension
    if extension in extensiones_validas:
        return extension
    else:
        return None





#Funcion para validar los formatos dentro del archivo de datos clinicos, recibimos el archivo y su extension
def validar_archivo_clinico(archivo_subido: UploadFile, extension: str):    

    #Convertimos el archivo a bytes
    archivo_bytes = BytesIO(archivo_subido.file.read())
    #Reiniciamos el puntero para guardar luego
    archivo_subido.file.seek(0) 

    #Leemos el archivo con la funcion indicada segun la extension del archivo subido
    try:
        print(extension)
        if extension in ["xlsx", "xls"]:
            print(extension)
            #Los leemos con excel si es extension xlsx o xls
            archivo_leido = pd.read_excel(archivo_bytes)
        else:
            #Los leemos con csv si es extension csv
            archivo_leido = pd.read_csv(archivo_bytes)
    except Exception as error:
        return {"msg": f'Error al leer el archivo: {str(error)}'}

    #Validamos los titulos que deben de llevar, que son el de dato y valor
    columnas_esperadas = {"dato", "valor"}
    if not columnas_esperadas.issubset(set(archivo_leido.columns.str.lower())):
        #Si no se encuentran ambos titulos, entonces regresamos el error
        return {"msg": "El archivo debe contener las columnas 'dato' y 'valor'."}

    #Validamos los campos necesarios, definimos los campos que debemos de recibir
    campos_requeridos = {"estado_tumor", "er_estado", "pr_estado", "her2_estado", "supervivencia_meses", "evento_recaida"}
    #Generamos una lista con los datos que leemos del archivo debajo del titulo de dato
    campos_en_archivo = set(archivo_leido["dato"].str.lower().tolist())
    #Generamos la lista de los campos faltantes
    campos_faltantes = campos_requeridos - campos_en_archivo
    if campos_faltantes:
        #Si hay campos faltantes, entonces regresamos el error, junto con la lista de los faltantes
        return {"msg": f"Faltan los siguientes campos: {', '.join(campos_faltantes)}"}

    #Si todo esta correcto entonces regresamos los datos del archivo leido
    return archivo_leido





def validar_archivo_transcriptomico(archivo_subido: UploadFile):
    #Obtenemos la extension del archivo
    extension = archivo_subido.filename.split(".")[-1].lower()
    #Cobvertimos el archivo a bytes
    archivo_bytes = BytesIO(archivo_subido.file.read())
    #Reiniciamos el puntero
    archivo_subido.file.seek(0)

    # Leer archivo Excel o CSV
    try:
        if extension in ["xlsx", "xls"]:
            df = pd.read_excel(archivo_bytes)
        elif extension == "csv":
            df = pd.read_csv(archivo_bytes)
    except Exception as e:
        return {"msg": f"Error al leer el archivo: {str(e)}"}

    #Validamos los titulos que deben de llevar
    columnas_esperadas = {"gen", "expresion"}
    if not columnas_esperadas.issubset(set(df.columns.str.lower())):
        return {"msg": "El archivo debe contener las columnas 'gen' y 'expresion'."}

    # Cargar lista de genes requeridos desde el archivo TXT
    # Ruta absoluta al archivo TXT, relativa al archivo Python actual
    ruta_actual = os.path.dirname(__file__)
    diccionario_genes = os.path.join(ruta_actual, "diccionario_genes.txt")
    try:
        with open(diccionario_genes, "r", encoding="utf-8") as f:
            genes_requeridos = {line.strip().lower() for line in f if line.strip()}
    except FileNotFoundError:
        return {"msg": f"No se encontró el archivo de genes requerido: {diccionario_genes}"}
    
    # Validar cantidad de genes que hay
    genes_en_archivo = set(df["gen"].astype(str).str.lower())
    total_requeridos = len(genes_requeridos)
    total_presentes = len(genes_requeridos.intersection(genes_en_archivo))

    porcentaje_cumplimiento = (total_presentes / total_requeridos) * 100 if total_requeridos > 0 else 0

    if porcentaje_cumplimiento < 60:
        return {
            "msg": f"El archivo solo contiene el {porcentaje_cumplimiento:.2f}% de los genes requeridos. "
                   "Debe incluir al menos el 60%."
        }
    
    # Validar que todos los valores de la expresion sean numéricos
    df["expresion"] = df["expresion"].astype(str).str.strip()
    if not pd.to_numeric(df["expresion"], errors="coerce").notnull().all():
        return {"msg": "La columna 'expresion' debe contener únicamente valores numéricos (sin celdas vacías o texto)."}

    #Si todo es correcto entonces regresamos el archivo leido
    return df