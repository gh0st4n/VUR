from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas

def get_package(db: Session, package_id: int):
    return db.query(models.Package).filter(models.Package.id == package_id).first()

def get_package_by_name(db: Session, name: str):
    return db.query(models.Package).filter(models.Package.name == name).first()

def get_packages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Package).offset(skip).limit(limit).all()

def search_packages(db: Session, query: str, skip: int = 0, limit: int = 100):
    return db.query(models.Package).filter(
        or_(
            models.Package.name.ilike(f"%{query}%"),
            models.Package.description.ilike(f"%{query}%"),
            models.Package.maintainer.ilike(f"%{query}%")
        )
    ).offset(skip).limit(limit).all()

def create_package(db: Session, package: schemas.PackageCreate):
    db_package = models.Package(**package.dict())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package

def get_package_dependencies(db: Session, package_id: int):
    dependencies = db.query(models.Dependency).filter(
        models.Dependency.package_id == package_id
    ).all()
    
    result = []
    for dep in dependencies:
        dep_package = db.query(models.Package).filter(
            models.Package.id == dep.depends_on_id
        ).first()
        if dep_package:
            result.append(dep_package)
    return result

def get_package_dependents(db: Session, package_id: int):
    dependents = db.query(models.Dependency).filter(
        models.Dependency.depends_on_id == package_id
    ).all()
    
    result = []
    for dep in dependents:
        dep_package = db.query(models.Package).filter(
            models.Package.id == dep.package_id
        ).first()
        if dep_package:
            result.append(dep_package)
    return result

def flag_out_of_date(db: Session, package_id: int):
    package = db.query(models.Package).filter(models.Package.id == package_id).first()
    if package:
        from sqlalchemy import func
        package.out_of_date = func.now()
        db.commit()
        db.refresh(package)
    return package
