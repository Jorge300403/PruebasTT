from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import relationship
from database import Base

class Paciente(Base):
    __tablename__ = "paciente"

    id_paciente = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    apellido_paterno = Column(String(255), nullable=False)
    apellido_materno = Column(String(255), nullable=False)
    correo_electronico = Column(String(255), unique=True, nullable=False)
    edad = Column(String(255), nullable=False)
    sexo = Column(TINYINT(1), nullable=False)
    estado_tumor = Column(String(255), nullable=True)
    er_estado = Column(String(255), nullable=True)
    pr_estado = Column(String(255), nullable=True)
    her2_estado = Column(String(255), nullable=True)
    supervivencia_meses = Column(String(255), nullable=True)
    evento_recaida = Column(String(255), nullable=True)

    # Relación con Oncólogo
    id_usuario = Column(Integer, ForeignKey("oncologo.id_usuario"), nullable=False)

    # 0 cuando ha cargado solo los datos personales, 1 cuando ya cargo el archivo del paciente, 2 cuando ya se ha hecho algun análisis
    estado_milestone = Column(TINYINT(1), default=0, nullable=False)

    # Relación con la tabla de oncologo
    oncologo = relationship("Oncologo", backref="pacientes")
