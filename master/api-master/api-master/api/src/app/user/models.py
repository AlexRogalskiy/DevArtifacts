"""User Model Module."""
from sqlalchemy.dialects.postgresql import JSON
from flask import url_for, current_app
from passlib.hash import bcrypt
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

from .. import db
from ..general.models import Base
from ..general.error_handler import ValidationError


class User(Base):
    """User Model."""

    __tablename__ = 'users'
    name = db.Column(db.String(100), unique=True)
    age = db.Column(db.Integer)
    new_field = db.Column(db.Integer)
    password_hash = db.Column(db.String(64))
    json_field = db.Column(JSON)
    email = db.Column(db.String(200))

    def __init__(self, data):
        """User constructor."""
        try:
            self.name = data['name']
            self.password_hash = self.hash_password(data['password'])
            self.email = data['email']
        except KeyError as e:
            raise ValidationError('Invalid user: missing ' + e.args[0])

    def hash_password(self, password):
        return bcrypt.encrypt(password)

    def verify_password(self, password):
        return bcrypt.verify(password, self.password_hash)

    def generate_auth_token(self, expires_in=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expires_in)
        return s.dumps({'id': self.id}).decode('utf-8')

    @staticmethod
    def verify_auth_token(token):
        serializer = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = serializer.loads(token)
        except:
            return None
        return User.query.get(data['id'])

    def get_url(self):
        """Get user url."""
        return url_for('users_blueprint.get_user', id=self.id, _external=True)

    @property
    def serialize(self):
        """Serialize user data object."""
        return {
            'name': self.name,
            'json': self.json_field,
            'email': self.email,
            'date_created': self.date_created,
            'date_modified': self.date_modified
        }

    def __repr__(self):
        """Representation for user object."""
        return self.name
