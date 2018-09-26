"""User Controller."""
from flask import jsonify, request
# Import the database object from the main app module
from .models import Post

from . import posts_blueprint
from .. import db


@posts_blueprint.route('/posts', methods=['GET'])
def get_posts():
    """Get all posts."""
    posts = [post.serialize for post in Post.query.all()]
    return jsonify({'posts': posts})


@posts_blueprint.route('/posts', methods=['POST'])
def create_post():
    """Create post."""
    data = request.get_json()
    post = Post(data)
    db.session.add(post)
    db.session.commit()
    return jsonify({}), 201
