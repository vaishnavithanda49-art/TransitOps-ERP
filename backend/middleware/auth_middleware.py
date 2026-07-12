"""Authentication middleware placeholder for TransitOps."""


def require_auth(func):
    """Example middleware wrapper for protected routes."""

    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return wrapper
