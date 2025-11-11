from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PackageBase(BaseModel):
    name: str
    version: str
    description: Optional[str] = None
    license: Optional[str] = None
    homepage: Optional[str] = None
    maintainer: Optional[str] = None
    status: str = "maintained"

class PackageCreate(PackageBase):
    pass

class Package(PackageBase):
    id: int
    last_update: datetime
    out_of_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class PackageWithDependencies(Package):
    dependencies: List['Package'] = []
    dependents: List['Package'] = []

class DependencyBase(BaseModel):
    package_id: int
    depends_on_id: int

class Dependency(DependencyBase):
    id: int
    
    class Config:
        from_attributes = True

# Update forward references
PackageWithDependencies.model_rebuild()
