from flask import Blueprint, jsonify, request
from app.services.analytics_service import AnalyticsService

api_blueprint = Blueprint('api', __name__, url_prefix='/api/v1')
analytics_service = AnalyticsService()

@api_blueprint.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Endpoint powering the top cards on the React Dashboard."""
    try:
        stats = analytics_service.fetch_dashboard_stats()
        return jsonify({"success": True, "data": stats}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_blueprint.route('/commitments', methods=['GET'])
def get_commitments():
    """Endpoint powering the Manifesto Tracker and Legislative Explorer."""
    try:
        limit = int(request.args.get('limit', 50))
        skip = int(request.args.get('skip', 0))
        
        commitments = analytics_service.fetch_commitments_for_ui(limit, skip)
        return jsonify({"success": True, "data": commitments}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

    
@api_blueprint.route('/dashboard/briefing', methods=['GET'])
def get_dashboard_briefing():
    """Endpoint to trigger the AI-generated Executive Briefing."""
    try:
        # Call the service layer to do the heavy lifting
        briefing_text = analytics_service.generate_ai_briefing()
        
        return jsonify({
            "success": True, 
            "data": {"briefing_markdown": briefing_text}
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500