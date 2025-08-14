from flask import Blueprint, request, jsonify
from app.models.form_model import UserForm  
from app.utils.jwt_helper import generate_jwt

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Both email and password are required."}), 400

        user = UserForm.query.filter_by(email=email).first()

        if user and user.password == password:
            token = generate_jwt(user.id, user.role)
            return jsonify({
                "message": "Login successful ✅",
                "token": token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }), 200
        else:
            return jsonify({"error": "Invalid email or password ❌"}), 401

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Something went wrong on the server."}), 500
