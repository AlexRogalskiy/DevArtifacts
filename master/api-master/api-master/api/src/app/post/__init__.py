"""posts blueprint."""
from flask import Blueprint

from ..general import Constants
from ..general.auth_handler import auth

posts_blueprint = Blueprint('posts_blueprint', __name__, url_prefix=Constants.API_PREFIX)


@posts_blueprint.before_request
@auth.login_required
def before_request():
    """All routes in this blueprint require authentication."""
    pass

from . import controllers
