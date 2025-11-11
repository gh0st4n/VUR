from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Package(Base):
    __tablename__ = "packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    version = Column(String(100), nullable=False)
    description = Column(Text)
    license = Column(String(100))
    homepage = Column(String(500))
    maintainer = Column(String(255))
    last_update = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    status = Column(String(20), default="maintained")  # maintained/orphan
    out_of_date = Column(TIMESTAMP, nullable=True)
    
    # Relationships
    dependencies = relationship(
        "Dependency", 
        foreign_keys="Dependency.package_id",
        back_populates="package",
        cascade="all, delete-orphan"
    )
    
    dependents = relationship(
        "Dependency",
        foreign_keys="Dependency.depends_on_id",
        back_populates="dependency_package"
    )

class Dependency(Base):
    __tablename__ = "dependencies"
    
    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, ForeignKey("packages.id", ondelete="CASCADE"))
    depends_on_id = Column(Integer, ForeignKey("packages.id", ondelete="CASCADE"))
    
    # Relationships
    package = relationship("Package", foreign_keys=[package_id], back_populates="dependencies")
    dependency_package = relationship("Package", foreign_keys=[depends_on_id], back_populates="dependents")
