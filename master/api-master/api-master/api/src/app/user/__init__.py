"""users blueprint."""
from flask import Blueprint

from ..general import Constants

users_blueprint = Blueprint('users_blueprint', __name__, url_prefix=Constants.API_PREFIX)

from . import controllers
