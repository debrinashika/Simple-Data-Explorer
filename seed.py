import random
from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.models.user import UserDB  
from api.db import Base
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

fake = Faker()

def seed_users(n=100):
    session = SessionLocal()
    try:
        for i in range(n):
            user = UserDB(   
                username=f"user{i+1}",
                name=fake.name(),
                email=f"user{i+1}@example.com",
                age=random.randint(18, 60)
            )
            session.add(user)

        session.commit()
        print(f"✅ Successfully seeded {n} users!")
    except Exception as e:
        session.rollback()
        print("❌ Error seeding:", e)
    finally:
        session.close()

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    seed_users(100)
