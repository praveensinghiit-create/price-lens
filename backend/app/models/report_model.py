from app.models.db import db
from datetime import datetime

class ReportRequest(db.Model):
    __tablename__ = "report_requests"

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.String(50), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    product = db.Column(db.String(100))
    status = db.Column(db.String(50), default="Unassigned")
    report = db.Column(db.String(100), default="")
    download = db.Column(db.Boolean, default=False)

    assigned_to_id = db.Column(db.Integer, db.ForeignKey("user_management.id"))
    assigned_to = db.relationship("UserDetails", backref="assigned_reports")


    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# from app.models.usermanagement_model import UserDetails
