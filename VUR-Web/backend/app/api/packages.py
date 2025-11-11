from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/packages", response_model=List[schemas.Package])
def read_packages(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    packages = crud.get_packages(db, skip=skip, limit=limit)
    return packages

@router.get("/package/{name}", response_model=schemas.PackageWithDependencies)
def read_package(name: str, db: Session = Depends(get_db)):
    package = crud.get_package_by_name(db, name=name)
    if package is None:
        raise HTTPException(status_code=404, detail="Package not found")
    
    # Get dependencies and dependents
    dependencies = crud.get_package_dependencies(db, package.id)
    dependents = crud.get_package_dependents(db, package.id)
    
    package_dict = package.__dict__
    package_dict['dependencies'] = dependencies
    package_dict['dependents'] = dependents
    
    return schemas.PackageWithDependencies(**package_dict)

@router.get("/search", response_model=List[schemas.Package])
def search_packages(
    q: str = Query(..., min_length=1),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    packages = crud.search_packages(db, query=q, skip=skip, limit=limit)
    return packages

@router.post("/packages", response_model=schemas.Package)
def create_package(
    package: schemas.PackageCreate,
    db: Session = Depends(get_db)
):
    db_package = crud.get_package_by_name(db, name=package.name)
    if db_package:
        raise HTTPException(status_code=400, detail="Package already exists")
    return crud.create_package(db=db, package=package)

@router.post("/package/{name}/flag-outdated")
def flag_outdated(name: str, db: Session = Depends(get_db)):
    package = crud.get_package_by_name(db, name=name)
    if package is None:
        raise HTTPException(status_code=404, detail="Package not found")
    
    flagged_package = crud.flag_out_of_date(db, package.id)
    return {"message": "Package flagged as out of date", "package": flagged_package}
