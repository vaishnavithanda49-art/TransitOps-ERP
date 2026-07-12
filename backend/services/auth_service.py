"""Authentication service placeholder for TransitOps."""


def login_user(username: str, password: str) -> bool:
    """Return True for valid credentials in a starter example."""
    return username == "admin" and password == "password"
