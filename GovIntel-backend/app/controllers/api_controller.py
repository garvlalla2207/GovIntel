import os
import io
from flask import Blueprint, jsonify, request
from app.services.analytics_service import AnalyticsService
from app.repositories.legislation_repo import LegislationRepository
from google import genai
from pypdf import PdfReader


api_blueprint = Blueprint('api', __name__, url_prefix='/api/v1')
analytics_service = AnalyticsService()

@api_blueprint.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Endpoint powering the top cards on the React Dashboard."""
    try:
        # Get term from query params (e.g. ?term=2024)
        term = request.args.get('term', 'All Terms')
        stats = analytics_service.fetch_dashboard_stats(term=term)
        return jsonify({"success": True, "data": stats}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_blueprint.route('/commitments', methods=['GET'])
def get_commitments():
    """Endpoint powering the Manifesto Tracker."""
    try:
        term = request.args.get('term', 'All Terms')
        limit = int(request.args.get('limit', 100))
        skip = int(request.args.get('skip', 0))
        
        commitments = analytics_service.fetch_commitments_for_ui(limit=limit, skip=skip, term=term)
        return jsonify({"success": True, "data": commitments}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_blueprint.route('/dashboard/briefing', methods=['GET'])
def get_dashboard_briefing():
    """Endpoint to trigger the AI-generated Executive Briefing."""
    try:
        term = request.args.get('term', 'All Terms')
        # AI will now analyze data specific to the selected term
        briefing_text = analytics_service.generate_ai_briefing(term=term)
        
        return jsonify({
            "success": True, 
            "data": {"briefing_markdown": briefing_text}
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_blueprint.route('/dashboard/high-priority', methods=['GET'])
def get_high_priority():
    """Endpoint powering the radial progress list on the Dashboard."""
    try:
        term = request.args.get('term', 'All Terms')
        data = analytics_service.fetch_high_priority_for_ui(term=term)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        print(f"Error fetching high priority: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
    
@api_blueprint.route('/dashboard/feed', methods=['GET'])
def get_intelligence_feed():
    """Endpoint for the chronological intelligence timeline."""
    try:
        term = request.args.get('term', 'All Terms')
        feed = analytics_service.fetch_intelligence_feed(term=term)
        return jsonify({"success": True, "data": feed}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

@api_blueprint.route('/legislation', methods=['GET'])
def get_legislation():
    """Unfiltered endpoint to show all 100+ legislative documents."""
    try:
        # We ignore 'term' entirely here to ensure 'all' are shown
        bills = LegislationRepository.get_all_bills()
        
        for bill in bills:
            bill['_id'] = str(bill['_id'])
        
        return jsonify({
            "status": "success",
            "count": len(bills),
            "data": bills
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    

# Define the blueprint with the correct prefix
chat_bp = Blueprint('chat', __name__, url_prefix='/api/v1')

@chat_bp.route('/ai/summarize-doc', methods=['POST'])
def summarize_document():
    # 1. Check if a file was actually uploaded
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
    
    uploaded_file = request.files['file']
    
    # 2. Verify API Key
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"success": False, "error": "Gemini API key is missing on the server."}), 500
        
    client = genai.Client(api_key=api_key)

    try:
        # 3. Read the binary file stream and extract text
        file_stream = io.BytesIO(uploaded_file.read())
        pdf_reader = PdfReader(file_stream)
        
        content = ""
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                content += extracted + "\n"

        # 4. Handle empty/scanned PDFs
        if not content.strip():
            return jsonify({"success": False, "error": "Could not extract text. Ensure the PDF is not just scanned images."}), 422

        # 5. Format the GOVINTEL prompt
        prompt = f"""
        Act as a GOVINTEL OSINT Analyst. 
        Analyze the following document and provide:
        1. A 3-bullet executive summary.
        2. Identify if this aligns with any Manifesto promises of BJP.
        3. Flag any critical bottlenecks or risks.

        Document Content:
        {content[:30000]}  # Safely capping at 30k characters to ensure fast processing
        """

        # 6. Call the Gemini API
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )

        # 7. Return the successful summary to the React frontend
        return jsonify({"success": True, "summary": response.text}), 200

    except Exception as e:
        # This will print the exact line and cause of the crash in your Flask terminal
        print("--- OSINT DOCUMENT PROCESSING ERROR ---")
        traceback.print_exc() 
        return jsonify({"success": False, "error": f"Internal Error: {str(e)}"}), 500