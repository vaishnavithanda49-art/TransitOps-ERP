"""TransitOps application entry point.

This file is the main application module for beginners.
It can be extended to add routes, services, and configuration.
"""

from flask import Flask

app = Flask(__name__)


@app.get("/")
def home():
    """Return a simple welcome message for the TransitOps app."""
    return "Welcome to TransitOps"


if __name__ == "__main__":
    app.run(debug=True)
