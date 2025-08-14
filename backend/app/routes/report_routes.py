from flask import Blueprint, request, jsonify
from app.models.report_model import ReportRequest
from app.models.usermanagement_model import UserDetails
from app.models.db import db

report_bp = Blueprint("report_bp", __name__)


@report_bp.route("/report-requests", methods=["GET"])
def get_report_requests():
    reports = ReportRequest.query.order_by(ReportRequest.created_at.desc()).all()
    result = []
    for r in reports:
        assigned_name = f"{r.assigned_to.first_name} {r.assigned_to.last_name}" if r.assigned_to else ""
        result.append({
            "requestId": r.request_id,
            "category": r.category,
            "product": r.product,
            "status": r.status,
            "report": r.report,
            "download": r.download,
            "assignedTo": assigned_name,
            "locked": bool(assigned_name),
        })
    return jsonify(result), 200


@report_bp.route("/report-requests", methods=["POST"])
def create_report_request():
    data = request.get_json()
    try:
        # Parse full name into first + last name
        full_name = data.get("assignedTo", "")
        assigned_user = None
        if full_name:
            parts = full_name.strip().split()
            if len(parts) >= 2:
                assigned_user = UserDetails.query.filter_by(first_name=parts[0], last_name=parts[1]).first()

        new_report = ReportRequest(
            request_id=data["requestId"],
            category=data["category"],
            product=data.get("product", ""),
            status=data.get("status", "Unassigned"),
            report=data.get("report", ""),
            download=data.get("download", False),
            assigned_to_id=assigned_user.id if assigned_user else None
        )
        db.session.add(new_report)
        db.session.commit()
        return jsonify({"message": "Report request created."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@report_bp.route('/api/report-requests/<string:request_id>/assign', methods=['PATCH'])
def assign_report_request(request_id):
    data = request.get_json()
    print(f"[INFO] Incoming PATCH /assign request for {request_id}")
    print("[INFO] Request body:", data)

    assigned_to_id = data.get("assigned_to")
    print("[DEBUG] assigned_to ID received:", assigned_to_id)

    if not assigned_to_id:
        print("[ERROR] Missing assigned_to ID")
        return jsonify({"error": "Missing assigned_to ID"}), 400

    report_request = ReportRequest.query.filter_by(request_id=request_id).first()
    if not report_request:
        print(f"[ERROR] ReportRequest with request_id '{request_id}' not found")
        return jsonify({"error": "ReportRequest not found"}), 404

    user = UserDetails.query.get(assigned_to_id)
    if not user:
        print(f"[ERROR] User with id '{assigned_to_id}' not found")
        return jsonify({"error": "User not found"}), 404

    report_request.assigned_to_id = assigned_to_id
    report_request.status = "Assigned"

    try:
        db.session.commit()
        print(f"[SUCCESS] ReportRequest '{request_id}' successfully assigned to User ID '{assigned_to_id}'")
        return jsonify({"message": "ReportRequest assigned successfully"}), 200
    except Exception as e:
        print(f"[EXCEPTION] Error while saving to database: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Internal Server Error"}), 500