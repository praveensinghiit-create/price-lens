from flask import Blueprint, request, jsonify
from app.models.usermanagement_model import UserDetails
from app.models.db import db

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = UserDetails.query.all()
    return jsonify([{
        "id": user.id,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "gender": user.gender,
        "dob": user.dob,
        "role": user.role,
        "email": user.email,
        "phone": user.phone,
        # "isActive": user.is_active
    } for user in users]), 200

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    try:
        new_user = UserDetails(
            first_name=data['firstName'],
            last_name=data['lastName'],
            gender=data['gender'],
            dob=data['dob'],
            role=data['role'],
            email=data['email'],
            phone=data['phone'],
            password=data['password'],
            # is_active=True
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User added successfully."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = UserDetails.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.first_name = data['firstName']
    user.last_name = data['lastName']
    user.gender = data['gender']
    user.dob = data['dob']
    user.role = data['role']
    user.email = data['email']
    user.phone = data['phone']
    user.password = data['password']

    db.session.commit()
    return jsonify({"message": "User updated successfully."}), 200

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = UserDetails.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully."}), 200

@user_bp.route('/users/<int:user_id>/toggle', methods=['PATCH'])
def toggle_user(user_id):
    user = UserDetails.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({"message": "User status updated.", "isActive": user.is_active}), 200