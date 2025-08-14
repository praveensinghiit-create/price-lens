from flask import Blueprint, request, jsonify, current_app
from app.services.serp_service import SerpService
import logging

google_bp = Blueprint("google", __name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@google_bp.route("/search", methods=["POST", "OPTIONS"])
def search_google_route():
    if request.method == "OPTIONS":
        return '', 204

    try:
        data = request.get_json()
        query = data.get("query", "").strip()
        category = data.get("category", "").strip() 
        if not query:
            return jsonify({
                "success": False,
                "error": "Missing query parameter",
                "message": "Please provide a search query"
            }), 400

        api_key = current_app.config.get("SERP_API_KEY")
        if not api_key:
            return jsonify({
                "success": False,
                "error": "API key missing",
                "message": "SERP API key is not configured on the server"
            }), 500

        serp = SerpService(api_key)

        results = serp.search_google(
            query=query,
            category=category, 
        )

        return jsonify({
            "success": True,
            "results": results
        }), 200

    except Exception as e:
        logger.error(f"Google search failed: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Search failed",
            "message": str(e)
        }), 500