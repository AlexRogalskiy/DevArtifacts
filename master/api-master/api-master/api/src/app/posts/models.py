"""Post Model Module."""
from .. import db
from ..general.models import Base


class Post(Base):
    """Post Model."""

    __tablename__ = 'posts'
    title = db.Column(db.String(100), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)

    def __repr__(self):
        """Representation for post object."""
        return self.name
