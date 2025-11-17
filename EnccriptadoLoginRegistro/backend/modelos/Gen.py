from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Gen(Base):
    __tablename__ = "gen"

    id_gen = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    relevancia = Column(String(255), nullable=True)
    descripcion = Column(String(255), nullable=True)
    vias_biologicas = Column(String(255), nullable=True)
    simbolo = Column(String(255), nullable=True)

    expresiones_genicas = relationship("ExpresionGenica", back_populates="gen")
