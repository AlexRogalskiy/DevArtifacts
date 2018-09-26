"""General Model Module."""
from .. import db


# Define a base model for other database tables to inherit
class Base(db.Model):
    """Abstract Base Class."""

    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp()
    )
