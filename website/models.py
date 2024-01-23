from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    role = db.Column(db.Integer, default=1)

class Podcast(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150))
    description = db.Column(db.String(1000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    duration = db.Column(db.Integer)
    size = db.Column(db.Integer)
    file_path = db.Column(db.String(150))

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    question = db.Column(db.String(1000))
    user = db.Column(db.Integer)
