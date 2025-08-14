from flask import Blueprint, request, jsonify
from app.models.form_model import UserForm
from app.models.db import db

form_bp = Blueprint('form', __name__)

@form_bp.route('/submit-form', methods=['POST'])
def submit_form():
    data = request.get_json()

    try:
        user = UserForm(
            first_name=data.get('firstName'),
            last_name=data.get('lastName'),
            gender=data.get('gender'),
            dob=data.get('dob'),
            role=data.get('role'),
            email=data.get('email'),
            phone=data.get('phone'),
            password=data.get('password'),  # hash before saving in real apps
        )

        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Form submitted successfully!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
