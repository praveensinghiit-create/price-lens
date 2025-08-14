from flask import Blueprint, request, jsonify, current_app
from app.services.gemini_service import GeminiService
import logging

chat_bp = Blueprint("chat", __name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@chat_bp.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return '', 204

    data = request.get_json()
    user_message = data.get("message")
    chat_history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    api_key = current_app.config.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured on the server.")
        return jsonify({"error": "Server configuration error: API key missing"}), 500

    try:
        gemini_service = GeminiService(api_key)
        
        current_chat_history = chat_history + [{"role": "user", "parts": [{"text": user_message}]}]

        model_response = gemini_service.generate_text(current_chat_history)
        
        return jsonify({"response": model_response}), 200

    except Exception as e:
        logger.exception(f"Error during chat processing: {e}")
        return jsonify({"error": str(e)}), 500