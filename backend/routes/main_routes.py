"""Main route definitions for TransitOps."""

from flask import Blueprint

main_bp = Blueprint("main", __name__)


@main_bp.route("/health")
def health_check():
    return {"status": "ok"}
