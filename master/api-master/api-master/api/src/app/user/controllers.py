"""User Controller."""
from flask import jsonify, g, request
# Import the database object from the main app module
from . import users_blueprint
from .models import User
from ..general.auth_handler import auth
from .. import db


@users_blueprint.route('/get-token')
@auth.login_required
def get_auth_token():
    return jsonify({'token': g.user.generate_auth_token()})


@users_blueprint.route('/users', methods=['GET'])
def get_users():
    """Get all users."""
    users_urls = [user.get_url() for user in User.query.all()]
    return jsonify({'users': users_urls})


@users_blueprint.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    """Get a specific user."""
    user = User.query.get_or_404(id).serialize
    return jsonify(user)


@users_blueprint.route('/users', methods=['POST'])
def create_user():
    """Create user."""
    data = request.get_json()
    user = User(data)
    db.session.add(user)
    db.session.commit()
    return jsonify({}), 201, {'Location': user.get_url()}


@users_blueprint.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    """Update user."""
    data = request.get_json()
    db.session.query(User).filter_by(id=id).update(data)
    db.session.commit()

    return jsonify({}), 200


@users_blueprint.route('/users/<int:id>', methods=['DELETE'])
def remove_user(id):
    """Remove user."""
    User.query.filter_by(id=id).delete()
    db.session.commit()

    return jsonify({}), 204
