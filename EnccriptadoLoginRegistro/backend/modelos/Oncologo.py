from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import relationship
from database import Base

class Oncologo(Base):
    __tablename__ = "oncologo"

    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), primary_key=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    institucion = Column(String(100), nullable=False)
    telefono = Column(String(100), nullable=False)

    usuario = relationship("Usuario", back_populates="oncologo")