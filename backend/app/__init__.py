from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_migrate import Migrate
from .config import Config
from .models.db import db

migrate = Migrate()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)

    CORS(app,
    origins=[
        "*",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174",
        "https://qbit-tech-six.vercel.app"
    ],

    

    supports_credentials=True,
    methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

   

    # @app.after_request
    # def after_request(response):
    # response.headers.add("Access-Control-Allow-Origin", "*")
    # response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    # response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    # return response



    from .routes.login import login_bp
    app.register_blueprint(login_bp, url_prefix='/api')

    from .routes.send_email import send_email_bp
    app.register_blueprint(send_email_bp, url_prefix='/api')

    from .routes.form_routes import form_bp  
    app.register_blueprint(form_bp, url_prefix='/api')


    from app.routes.google_routes import google_bp
    app.register_blueprint(google_bp, url_prefix='/api')

    from app.routes.chat_routes import chat_bp
    app.register_blueprint(chat_bp, url_prefix='/api')

    from app.routes.usermanagement_route import user_bp
    app.register_blueprint(user_bp, url_prefix='/api')

    from app.routes.report_routes import report_bp
    app.register_blueprint(report_bp, url_prefix='/api')


    @app.route("/api/health")
    def health_check():
        return {"status": "ok", "message": "API is running"}, 200


    return app