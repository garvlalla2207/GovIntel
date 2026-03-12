from flask import Flask
from flask_cors import CORS
from app.extensions import mongo
from app.controllers.api_controller import api_blueprint

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for the React frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize extensions
    mongo.init_app(app)
    
    # Register Blueprints (Controllers)
    app.register_blueprint(api_blueprint)
    
    return app