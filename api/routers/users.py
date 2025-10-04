from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from api.models.user import User, UserDB
from api.db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/users")
def get_users(
    search: Optional[str] = Query(None),
    sort_by: str = Query("id"),
    order: str = Query("asc"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    age: Optional[str] = Query(None),  
    db: Session = Depends(get_db)
):
    query = db.query(UserDB)

    # Search
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (UserDB.username.ilike(search_term)) |
            (UserDB.name.ilike(search_term)) |
            (UserDB.email.ilike(search_term))
        )

    # Age filter
    if age and age != "all":
        try:
            if "-" in age: 
                min_age, max_age = age.split("-")
                query = query.filter(UserDB.age.between(int(min_age), int(max_age)))
            elif age.endswith("+"): 
                min_age = int(age[:-1])
                query = query.filter(UserDB.age >= min_age)
            else:
                raise ValueError("Invalid age format")
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid age filter format. Use 'min-max' or 'N+' (e.g., '18-25' or '46+')."
            )

    total = query.count()

    # Sort
    if sort_by in ["id", "username", "name", "email", "age"]:
        sort_column = getattr(UserDB, sort_by)
        if order.lower() == "desc":
            sort_column = sort_column.desc()
        else:
            sort_column = sort_column.asc()
        query = query.order_by(sort_column)
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid sort_by field. Allowed: id, username, name, email, age"
        )

    # Pagination
    offset = (page - 1) * limit
    users = query.offset(offset).limit(limit).all()

    return {
        "data": users,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }
