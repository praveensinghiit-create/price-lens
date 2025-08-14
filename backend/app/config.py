import os
from dotenv import load_dotenv

# It's good practice to load_dotenv here as well if this file might be imported
# directly in other scripts that don't go through run.py, though run.py is the primary place.
# If you're certain run.py always loads it first, this line can be omitted here.
load_dotenv() 

class Config:
    # Database config
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask secret
    SECRET_KEY = os.getenv("SECRET_KEY")

    # Mail config
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    # ✅ SERP API key (existing)
    SERP_API_KEY = os.getenv("SERP_API_KEY")

    # ✅ GEMINI API key (NEWLY ADDED)
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        # This will now correctly raise an error if GEMINI_API_KEY is still not found
        # after load_dotenv() has run.
        raise ValueError("GEMINI_API_KEY not found in environment variables. Please set it in your .env file.")

    # Flask environment settings (assuming you want these too, as they were in previous config.py)
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'