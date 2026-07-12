"""Helper utilities for TransitOps backend code."""


def format_response(message: str) -> dict:
    """Wrap a simple message in a consistent response object."""
    return {"message": message}
