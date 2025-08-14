from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message, Mail
from datetime import datetime
import re

send_email_bp = Blueprint('send_email', __name__)
mail_sender = Mail()

# -------------------------------------------------------------------
# Helper Functions (same as before)
# -------------------------------------------------------------------
def get_status_config(status: str) -> dict:
    """Professional status configuration with business-appropriate messaging."""
    configs = {
        "Complete": {
            "color": "#16a34a",
            "bg_color": "#dcfce7",
            "icon": "✅",
            "message": (
                "<strong>Report Complete:</strong> Your request has been processed successfully. "
                "Your report is now available for download through the management system."
            ),
            "urgency": "high"
        },
        "Inprogress": {
            "color": "#f59e0b",
            "bg_color": "#fef3c7",
            "icon": "⏳",
            "message": (
                "<strong>Processing:</strong> Your request is currently being processed by our team. "
                "You will be notified as soon as your report is ready."
            ),
            "urgency": "medium"
        },
        "Unassigned": {
            "color": "#6b7280",
            "bg_color": "#f3f4f6",
            "icon": "📋",
            "message": (
                "<strong>Received:</strong> Your request has been received and is awaiting assignment. "
                "You will be updated once a team member is assigned."
            ),
            "urgency": "low"
        },
        "Rejected": {
            "color": "#dc2626",
            "bg_color": "#fee2e2",
            "icon": "❌",
            "message": (
                "<strong>Request Rejected:</strong> Unfortunately, we were unable to process your request. "
                "Please contact support for further assistance."
            ),
            "urgency": "high"
        }
    }
    return configs.get(status, configs["Unassigned"])

def parse_frontend_data(body: str) -> dict:
    """Parse the frontend email body to extract structured data."""
    # Extract request ID
    request_id_match = re.search(r'\(([^)]+)\)', body)
    request_id = request_id_match.group(1) if request_id_match else "N/A"
    
    # Extract status
    status_match = re.search(r'Current status: ([^.]+)', body)
    status = status_match.group(1).strip() if status_match else "Updated"
    
    # Extract assigned to
    assigned_match = re.search(r'Assigned to: ([^.]+)', body)
    assigned_to = assigned_match.group(1).strip() if assigned_match else ""
    if assigned_to == "Unassigned":
        assigned_to = ""
    
    # Extract product from subject or body
    product_match = re.search(r'for "([^"]+)"', body)
    product = product_match.group(1) if product_match else "Report"
    
    # Determine category based on request ID or product
    category = "general"
    if "office" in product.lower() or "office" in request_id.lower():
        category = "office"
    elif "tech" in product.lower() or "tech" in request_id.lower():
        category = "tech"
    
    # Determine download status based on status
    download = status.lower() == "complete"
    
    return {
        "requestId": request_id,
        "product": product,
        "category": category,
        "status": status,
        "report": f"RPT_{request_id.split('_')[-1]}" if status.lower() == "complete" else "",
        "download": download,
        "report_link": f"#download/{request_id}" if download else "#dashboard",
        "assignedTo": assigned_to
    }

def get_priority_indicator(urgency: str) -> str:
    """Generate priority indicator with professional styling."""
    indicators = {
        "high": '<span style="background:#dc2626;color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">HIGH PRIORITY</span>',
        "medium": '<span style="background:#f59e0b;color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">MEDIUM PRIORITY</span>',
        "low": '<span style="background:#6b7280;color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">LOW PRIORITY</span>'
    }
    return indicators.get(urgency, indicators["low"])

def generate_timeline_visual(status: str, assigned_to: str = "") -> str:
    """Professional visual timeline based on current status."""
    steps = [
        ("Request Submitted", "✅" if status in ["Complete", "Inprogress", "Rejected"] else "⭕"),
        ("Team Assigned", "✅" if assigned_to and status in ["Complete", "Inprogress"] else "⏳" if status == "Unassigned" else "❌"),
        ("Report Processing", "✅" if status == "Complete" else "⏳" if status == "Inprogress" else "⭕"),
        ("Report Complete", "✅" if status == "Complete" else "⭕")
    ]
    
    timeline_html = '<div style="margin:20px 0;"><h4 style="margin:0 0 10px 0;color:#374151;">Progress Timeline</h4>'
    for i, (step_name, icon) in enumerate(steps):
        connector = '<div style="width:2px;height:20px;background:#e5e7eb;margin-left:10px;"></div>' if i < len(steps) - 1 else ''
        timeline_html += f'''
        <div style="display:flex;align-items:center;margin:5px 0;">
            <span style="font-size:16px;margin-right:10px;">{icon}</span>
            <span style="color:#374151;font-weight:500;">{step_name}</span>
        </div>
        {connector}
        '''
    timeline_html += '</div>'
    return timeline_html

def build_enhanced_email_html(data: dict) -> str:
    """Build a professional email from parsed frontend data."""
    status_config = get_status_config(data["status"])
    priority_indicator = get_priority_indicator(status_config["urgency"])
    timeline_visual = generate_timeline_visual(data["status"], data.get("assignedTo", ""))
    date_str = datetime.now().strftime("%B %d, %Y • %I:%M %p")

    # Greeting
    hour = datetime.now().hour
    if hour < 12:
        greeting = "Good morning"
    elif hour < 17:
        greeting = "Good afternoon"
    else:
        greeting = "Good evening"

    # Assignment section
    assignment_section = ""
    if data.get("assignedTo"):
        assignment_section = f'''
        <div style="background:#e0f2fe;border:1px solid #0288d1;border-radius:8px;padding:16px;margin:20px 0;">
            <h4 style="margin:0 0 8px 0;color:#01579b;display:flex;align-items:center;">
                <span style="margin-right:8px;">👤</span> Team Assignment
            </h4>
            <p style="margin:0;color:#0277bd;font-size:14px;">
                Your request has been assigned to <strong>{data["assignedTo"]}</strong> from our expert team.
            </p>
        </div>
        '''

    # Download section
    download_section = ""
    if data.get("status") == "Complete" and data.get("download"):
        download_section = f'''
        <div style="background:linear-gradient(135deg,#16a34a,#15803d);
                    border-radius:10px;
                    padding:20px;
                    margin:25px 0;
                    text-align:center;
                    color:white;">
            <h3 style="margin:0 0 10px 0;font-size:18px;">Report Ready for Download</h3>
            <p style="margin:0 0 18px 0;opacity:0.95;">
                Your <strong>{data['product']}</strong> report is ready. Access the management system to download your report.
            </p>
            <div style="text-align:center;margin:20px 0;">
                <a href="{data.get('report_link', '#')}" 
                   style="display:inline-block;background:#16a34a;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;">
                    Access Report System
                </a>
            </div>
        </div>
        '''

    return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Report Status Update - {data['requestId']}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 7px 18px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px 16px;text-align:center;color:white;">
            <h1 style="margin:0;font-size:22px;font-weight:600;">Report Management System</h1>
            <p style="margin:7px 0 0 0;opacity:0.92;font-size:15px;">Status Update Notification</p>
            <div style="margin-top:12px;">{priority_indicator}</div>
        </div>
        
        <!-- Content -->
        <div style="padding:24px 18px;">
            <div style="margin-bottom:18px;">
                <h2 style="margin:0 0 8px 0;color:#1e293b;font-size:18px;">{greeting},</h2>
                <div style="background:{status_config['bg_color']};
                           border-left:4px solid {status_config['color']};
                           padding:12px 16px;
                           border-radius:5px;
                           margin:12px 0;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                        <span style="font-size:17px;margin-right:8px;">{status_config['icon']}</span>
                        <strong style="color:{status_config['color']};font-size:15px;">Status Update</strong>
                    </div>
                    <p style="margin:0;color:#374151;line-height:1.5;">{status_config['message']}</p>
                </div>
            </div>

            <!-- Request Details -->
            <h3 style="margin:16px 0 10px 0;color:#1e293b;font-size:16px;">Request Details</h3>
            <table style="width:100%;border-collapse:collapse;margin:12px 0;border-radius:7px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
                <tr>
                    <td style="padding:8px 12px;background:#f8fafc;font-weight:600;color:#374151;border-bottom:1px solid #e2e8f0;">Request ID</td>
                    <td style="padding:8px 12px;background:#ffffff;color:#1e293b;border-bottom:1px solid #e2e8f0;font-family:monospace;font-weight:500;">{data['requestId']}</td>
                </tr>
                <tr>
                    <td style="padding:8px 12px;background:#f8fafc;font-weight:600;color:#374151;border-bottom:1px solid #e2e8f0;">Product</td>
                    <td style="padding:8px 12px;background:#ffffff;color:#1e293b;border-bottom:1px solid #e2e8f0;">{data['product']}</td>
                </tr>
                <tr>
                    <td style="padding:8px 12px;background:#f8fafc;font-weight:600;color:#374151;border-bottom:1px solid #e2e8f0;">Category</td>
                    <td style="padding:8px 12px;background:#ffffff;color:#1e293b;border-bottom:1px solid #e2e8f0;">
                        <span style="background:#e0e7ff;color:#3730a3;padding:3px 7px;border-radius:4px;font-size:12px;font-weight:500;">
                            {data['category'].upper()}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 12px;background:#f8fafc;font-weight:600;color:#374151;border-bottom:1px solid #e2e8f0;">Current Status</td>
                    <td style="padding:8px 12px;background:#ffffff;color:#1e293b;border-bottom:1px solid #e2e8f0;">
                        <span style="display:inline-block;padding:5px 12px;border-radius:16px;color:white;background:{status_config['color']};font-size:12px;font-weight:600;">
                            {status_config['icon']} {data['status'].upper()}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 12px;background:#f8fafc;font-weight:600;color:#374151;border-bottom:1px solid #e2e8f0;">Report ID</td>
                    <td style="padding:8px 12px;background:#ffffff;color:#1e293b;border-bottom:1px solid #e2e8f0;font-family:monospace;">{data.get('report') or 'Pending'}</td>
                </tr>
                <tr>
                    <td style="padding:8px 12px;background:#f8fafc;font-weight:600;color:#374151;">Last Updated</td>
                    <td style="padding:8px 12px;background:#ffffff;color:#1e293b;">{date_str}</td>
                </tr>
            </table>

            {assignment_section}
            {timeline_visual}
            {download_section}
            
            <div style="margin-top:22px;padding-top:16px;border-top:1.5px solid #e2e8f0;">
                <p style="color:#374151;line-height:1.5;font-size:14px;">
                    Thank you for using our Report Management System. We'll keep you updated on any changes to your request.
                </p>
                <p style="margin-top:16px;color:#374151;font-size:14px;">
                    Best regards,<br>
                    <strong style="color:#6366f1;">The LKCentrix Team</strong>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 4px 0;font-size:13px;color:#6b7280;">
                This is an automated notification from the Report Management System.
            </p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">
                © 2025 LKCentrix Report Management System. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
'''

# -------------------------------------------------------------------
# Updated Route - Works with existing frontend
# -------------------------------------------------------------------
@send_email_bp.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()

        recipient_email = data.get('email')
        if not recipient_email:
            return jsonify({"error": "Recipient email is required"}), 400

        # Check if this is the old format (subject + body) or new format (structured data)
        if 'subject' in data and 'body' in data:
            # OLD FORMAT: Parse the body to extract structured data
            parsed_data = parse_frontend_data(data['body'])
            parsed_data['email'] = recipient_email
            
            # Use parsed data to build enhanced email
            status_config = get_status_config(parsed_data['status'])
            subject = f"Report Update: {parsed_data['requestId']} - {parsed_data['status']}"
            
            msg = Message(
                subject=subject,
                sender=current_app.config['MAIL_USERNAME'],
                recipients=[recipient_email],
                html=build_enhanced_email_html(parsed_data)
            )
        else:
            # NEW FORMAT: Use structured data directly
            payload = {
                "requestId": data.get("requestId", "N/A"),
                "product": data.get("product", "Report"),
                "category": data.get("category", "general"),
                "status": data.get("status", "Updated"),
                "report": data.get("report", ""),
                "download": data.get("download", False),
                "report_link": data.get("report_link", "#dashboard"),
                "assignedTo": data.get("assignedTo", "")
            }
            
            status_config = get_status_config(payload['status'])
            subject = f"Report Update: {payload['requestId']} - {payload['status']}"
            
            msg = Message(
                subject=subject,
                sender=current_app.config['MAIL_USERNAME'],
                recipients=[recipient_email],
                html=build_enhanced_email_html(payload)
            )

        mail_sender.send(msg)
        return jsonify({"message": f"Email sent to {recipient_email}"}), 200

    except Exception as e:
        current_app.logger.error(f"Email sending error: {e}")
        return jsonify({"error": "Something went wrong while sending email"}), 500
