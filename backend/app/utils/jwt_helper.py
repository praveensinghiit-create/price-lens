import jwt
import datetime
from flask import current_app

def generate_jwt(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,  # ✅ include the user's role in the token
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token
