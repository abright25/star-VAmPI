import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.user_model import User
from config import db

def seed_test_user():
    username = "testuser"
    password = "testpass"
    email = "testuser@example.com"
    admin = False
    if not User.query.filter_by(username=username).first():
        User.register_user(username, password, email, admin)
        print(f"Seeded test user: {username}")
    else:
        print(f"Test user {username} already exists.")

if __name__ == "__main__":
    from app import vuln_app
    with vuln_app.app.app_context():
        seed_test_user()
