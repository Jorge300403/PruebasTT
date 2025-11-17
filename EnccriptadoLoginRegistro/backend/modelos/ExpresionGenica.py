from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class ExpresionGenica(Base):
    __tablename__ = "expresion_genica"

    id_expresion = Column(Integer, primary_key=True, index=True, autoincrement=True)
    valor_expresion = Column(String(255), nullable=False)
    entrenamiento = Column(String(255), nullable=True)    
    id_paciente = Column(Integer, ForeignKey("paciente.id_paciente"), primary_key=True)    
    id_gen = Column(Integer, ForeignKey("gen.id_gen"), primary_key=True)

     # Relaciones ORM 
    paciente = relationship("Paciente", back_populates="expresiones_genicas")
    gen = relationship("Gen", back_populates="expresiones_genicas")
