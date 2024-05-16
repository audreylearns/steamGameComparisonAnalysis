from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
app = Flask(__name__)

#routes & rate limiter
#doc https://flask-limiter.readthedocs.io/en/stable/#rate-limit-domain

@app.route("/")
def home():
    return "Hello, Flask!"

steam_limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100000 per day", "100 per hour"],
    storage_uri="memory://",
)

cs_limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["2400 per day", "100 per hour"],
    storage_uri="memory://",
)

er_limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per month"],
    storage_uri="memory://",
)