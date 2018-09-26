"""Post Model Module."""
from .. import db
from ..general.models import Base
from ..general.error_handler import ValidationError


class Post(Base):
    """Post Model."""

    __tablename__ = 'posts'
    title = db.Column(db.String(100), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)

    def __init__(self, data):
        """Post constructor."""
        try:
            self.title = data['title']
            self.user_id = data['user_id']
        except KeyError as e:
            raise ValidationError('Invalid post: missing ' + e.args[0])

    def __repr__(self):
        """Representation for post object."""
        return self.title

    @property
    def serialize(self):
        return {
            'title': self.title,
            'user_id': self.user_id
        }
