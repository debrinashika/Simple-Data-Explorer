from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import users
from api.db import Base, engine

app = FastAPI()

# create tables 
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api", tags=["users"])

@app.get("/")
def root():
    return {"message": "hi"}
