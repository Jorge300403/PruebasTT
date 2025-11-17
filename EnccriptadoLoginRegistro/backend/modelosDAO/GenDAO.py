from sqlalchemy.orm import Session
from database import SessionLocal
from modelos.Gen import Gen
from sqlalchemy.exc import SQLAlchemyError
from validaciones import modelo_aes
import os

def creat_llenar_diccionario_genes():

    # Crear sesión
    db: Session = SessionLocal()

    try:
        # Verificar si ya existen registros en la tabla para que solo la llenemos una vez
        total = db.query(Gen).count()
        if total > 0:
            print(f"La tabla de genes ya está poblada con {total} registros. No se insertará nada.")
            return

        # Ruta del archivo de genes
        ruta_actual = os.path.dirname(__file__)
        diccionario_genes = os.path.join(ruta_actual, "diccionario_genes.txt")

        if not os.path.exists(diccionario_genes):
            print(" No se encontró el archivo diccionario_genes.txt")
            return

        # Leer los nombres de los genes
        with open(diccionario_genes, "r", encoding="utf-8") as f:
            lineas = [line.strip() for line in f if line.strip()]

        genes = [
            Gen(
                nombre=modelo_aes.encriptar(linea),
                relevancia=None,
                descripcion=None,
                vias_biologicas=None,
                simbolo=None
            )
            for linea in lineas
        ]

        # Insertar en la base de datos
        db.bulk_save_objects(genes)
        db.commit()
        print(f"genes insertados correctamente en la base de datos.")

    except SQLAlchemyError as e:
        db.rollback()
        print(f" Error al insertar los genes: {str(e)}")
    finally:
        db.close()
