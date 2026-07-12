"""Run the TransitOps application.

Use this file to start the server locally.
"""

from app import app


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
