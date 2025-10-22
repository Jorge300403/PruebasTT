from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import relationship
from database import Base

class Oncologo(Base):
    __tablename__ = "oncologo"

    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), primary_key=True)
    nombre = Column(String(255), nullable=False)
    apellido_paterno = Column(String(255), nullable=False)
    apellido_materno = Column(String(255), nullable=False)
    institucion = Column(String(255), nullable=False)
    telefono = Column(String(255), nullable=False)

    usuario = relationship("Usuario", back_populates="oncologo")