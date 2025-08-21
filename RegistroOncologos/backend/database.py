#Importamos SQLAlchemy para el manejo de las peticiones de la base de datos
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#Asignamos la url en donde se ecuentra la bd, con usuario:password y al final el nombre de la bd
DATABASE_URL = "mysql+pymysql://root:root@localhost:3307/srtcdmbd"

# Creamos el motor de conexión
engine = create_engine(DATABASE_URL, echo=True)

# Creamos la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Creamos la clase base para los modelos
Base = declarative_base()

# Creamos la dependencia para obtener sesión de BD en cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
