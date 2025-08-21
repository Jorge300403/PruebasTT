from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tipo_usuario = Column(TINYINT(1), nullable=False)
    correo_electronico = Column(String(100), unique=True, nullable=False)
    contrasenia = Column(String(255), nullable=False)    
    es_verificado = Column(TINYINT(1), default=False) 

    oncologo = relationship("Oncologo", back_populates="usuario", uselist=False)