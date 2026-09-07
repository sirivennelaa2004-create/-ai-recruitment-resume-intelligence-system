from backend.app.database.database import Base, engine
from backend.app.models.user import User


print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")