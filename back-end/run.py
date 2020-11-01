from flask import Flask, url_for, render_template, request
from flask_sqlalchemy import SQLAlchemy
import os
import hashlib
import random
import hashlib
import util
import random
import binascii
import time
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, String, Binary, Integer, Boolean
from sqlalchemy.orm import relationship


class config_prod():
    DEBUG = False

    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 3600

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + \
        os.path.join(os.path.abspath(os.path.dirname(__file__)), 'database.db')


app = Flask(__name__)
app.config.from_object(config_prod)
db = SQLAlchemy()
db.init_app(app)


@app.before_first_request
def initialize_database():
    db.create_all()


@app.teardown_request
def shutdown_session(exception=None):
    db.session.remove()


class user(db.Model):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, unique=True)
    username = Column(String, primary_key=True, unique=True)
    password = Column(Binary)
    current_location_id = Column(String, primary_key=True)
    current_location_coords = Column(String, primary_key=True)

    def __init__(self, **kwargs):
        for property, value in kwargs.items():
            if hasattr(value, '__iter__') and not isinstance(value, str):
                value = value[0]
            if property == 'password':
                value = util.hash_pass(value)
            setattr(self, property, value)


class service(db.Model):
    __tablename__ = 'services'
    id = Column(String, primary_key=True, unique=True)
    name = Column(String, primary_key=True, unique=True)
    location = Column(String, primary_key=True)
    visitor_count = Column(Integer, default=0)
    visitor_limit = Column(Integer, default=0)
    is_halloween = Column(Boolean, default=False)
    category = Column(String, primary_key=True)

    def __init__(self, **kwargs):
        for property, value in kwargs.items():
            if hasattr(value, '__iter__') and not isinstance(value, str):
                value = value[0]
            setattr(self, property, value)


# TODO: major ghetto code
sessions = {}
user_sessions = {}


# Sorry Rob :(

# @app.route("/")
# def index():
#     return render_template("home.html")


@app.route("/api/user", methods=["POST", "GET"])
def api_user():
    try:
        if request.method == "POST":
            data = request.get_json(force=True)
            if data["action"] == "register":
                username = data.get("username", None)

                result = user.query.filter_by(username=username).first()
                if result != None:
                    return {"status": "fail", "message": "Username already taken"}

                password = data.get("password", None)
                loc = data.get("loc", None)

                if password is None or loc is None:
                    return {"status": "fail", "message": "Malformed request"}

                new_user = user(id=util.make_id(), username=username,
                                password=password, current_location_coords=loc)
                db.session.add(new_user)
                db.session.commit()
                return {"status": "success", "message": "Successfully created account"}
            elif data["action"] == "login":
                username = data.get("username", None)
                result = user.query.filter_by(username=username).first()

                if user == None or not util.verify_pass(data.get("password", ""), result.password):
                    return {"status": "fail", "message": "Invalid username or password"}

                if len(user_sessions[username]) > 5:
                    return {"status": "success", "message": "Already logged in", "sess_id": user_sessions[username]}

                sess_id = util.make_id()
                sessions[sess_id] = username
                user_sessions[username] = sess_id
                return {"status": "success", "message": "Successfully created session", "sess_id": str(sess_id)}
            else:
                return {"status": "fail", "message": "Malformed request"}
        else:
            # TODO: return user as json if authorized
            return {"status": "success", "message": "Successfully fetched user", "user": {}}
    except:
        return {"status": "fail", "message": "Failed to perform action"}


@app.route("/services")
def api_location():
    # TODO: read location from user's session key
    # fetch services close to user's location
    pass


@app.route("/api/services/create", methods=["POST"])
def api_create_location():
    try:
        if request.method == "POST":
            data = request.get_json(force=True)
            name = data.get("name", None)

            result = service.query.filter_by(username=name).first()
            if result != None:
                return {"status": "fail", "message": "Name already taken"}

            location = data.get("location")
            visitor_limit = data.get("visitor_limit")
            category = data.get("category")
            is_halloween = data.get("is_halloween")
            new_service = service(id=util.make_id(), username=name, location=location,
                                  visitor_limit=visitor_limit, is_halloween=is_halloween, category=category)
            db.session.add(new_service)
            db.session.commit()
            return {"status": "success", "message": "Successfully created account"}
        else:
            return {"status": "fail", "message": "Malformed request"}
    except:
        return {"status": "fail", "message": "Failed to perform action"}


@app.route("/api/services/<string:id>", methods=["POST", "GET"])
def api_location_id(id):
    try:
        result = service.query.filter_by(id=id).first()
        if result == None:
            return {"status": "fail", "message": "Invalid service ID"}

        if request.method == "POST":
            data = request.get_json(force=True)
            sess_id = data["sess_id"]

            if len(sessions[sess_id]) < 1:
                return {"status": "success", "message": "Invalid session ID"}

            requesting_user = user.query.filter_by(
                username=sessions[sess_id]).first()

            if data["action"] == "enter":
                if service.visitor_count >= service.visitor_limit:
                    return {"status": "fail", "message": "Location full"}

                service.visitor_count = service.visitor_count + 1
                requesting_user.current_location_coords = service.location
                requesting_user.current_location_id = service.id
                db.session.commit()
                return {"status": "success", "message": "Successfully entered location"}
            elif data["action"] == "leave":
                service.visitor_count = service.visitor_count - 1
                requesting_user.current_location_coords = service.location
                requesting_user.current_location_id = ""
                db.session.commit()
                return {"status": "success", "message": "Successfully left location"}
            else:
                return {"status": "fail", "message": "Malformed request"}
        res = {
            "id": result.id,
            "name": result.name,
            "location": result.location,
            "visitor_count": result.visitor_count,
            "visitor_limit": result.visitor_limit,
            "is_halloween": result.is_halloween,
            "category": result.category
        }

        return {"status": "success", "message": "Successfully fetched service", "service": res}
    except:
        return {"status": "fail", "message": "Failed to perform action"}


app.run()
