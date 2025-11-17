from sqlalchemy.orm import Session
from modelos.ExpresionGenica import ExpresionGenica
from modelos.Gen import Gen
from sqlalchemy.exc import SQLAlchemyError
from validaciones import modelo_aes

def creat_expresion_genicas(db: Session, id_paciente: int, df):
    try:
        # Mapeo de gen -> id_gen para evitar consultas repetidas
        genes_en_bd = db.query(Gen).with_entities(Gen.id_gen, Gen.nombre).all()
        mapa_genes = {}

        for g in genes_en_bd:
            try:
                nombre_desencriptado = modelo_aes.desencriptar(g.nombre).lower()
                mapa_genes[nombre_desencriptado] = g.id_gen
            except Exception as e:
                print(f" Error desencriptando gen {g.id_gen}: {str(e)}")

        expresiones = []
        for _, row in df.iterrows():
            nombre_gen = str(row["gen"]).strip().lower()
            valor_expresion = str(row["expresion"]).strip()

            id_gen = mapa_genes.get(nombre_gen)
            if id_gen:
                expresion = ExpresionGenica(
                    id_paciente=id_paciente,
                    id_gen=id_gen,
                    valor_expresion=valor_expresion,
                    entrenamiento=None
                )
                expresiones.append(expresion)

        if expresiones:
            db.bulk_save_objects(expresiones)
            db.commit()
            return {"msg": f"Se insertaron {len(expresiones)} registros de expresión génica."}
        else:
            return {"msg": "No se insertaron registros, ningún gen coincidió con la base de datos."}

    except SQLAlchemyError as e:
        db.rollback()
        return {"msg": f"Error al insertar expresiones génicas: {str(e)}"}
    


def read_expresion_genica_completa(db: Session, id_paciente: int):    
    expresion_genica = db.query(ExpresionGenica, Gen).join(Gen, ExpresionGenica.id_gen == Gen.id_gen).filter(ExpresionGenica.id_paciente == id_paciente).all()
    return expresion_genica
