import os
# Define the application directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Statement for enabling the development environment
DEBUG = True
SECRET_KEY = 'top-secret!'

# Define the database
SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://localhost/api'
SQLALCHEMY_TRACK_MODIFICATIONS = False
