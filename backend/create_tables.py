from app import create_app
from app.models.db import db
from app.models.user import User

app = create_app()

with app.app_context():
   db.create_all()


    
   users = User(username='admin', password='admin123') 
   db.session.add(users)
   db.session.commit()

   print("✅ User table created and demo user added.")
