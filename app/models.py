from . import db
from werkzeug.security import generate_password_hash


class Users(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of Users would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_s` (plural) or some other name.
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    location = db.Column(db.String(255))
    account_type = db.Column(db.String(80))
    education_level = db.Column(db.String(80))
    photo = db.Column(db.String(255))
    date_joined = db.Column(db.Date)
    
    def __init__(self, fullname, username, password):
        self.name = fullname
        self.last_name = last_name
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        
    def __init__(self, username, password, fullname, email, loca, acct, edut, url, date):
        self.name = fullname
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.email = email
        self.location = loca
        self.account_type = acct
        self.education_level = edut
        self.photo = url
        self.date_joined = date

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)

class Books(db.Model):

    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    author = db.Column(db.String(255))
    subject = db.Column(db.String(255))
    year = db.Column(db.String(10))
    publisher = db.Column(db.String(255))
    isbn = db.Column(db.String(255))
    photo = db.Column(db.String(80))
    user_id = db.Column(db.Integer)

    def __init__(self, title, auth, type1, year, pub, isbn, url, uid):
        self.title = title
        self.author = auth
        self.subject = type1
        self.year = year
        self.publisher = pub
        self.isbn = isbn
        self.photo = url
        self.user_id = uid

    def __repr__(self):
        return '<Book %r>' % (self.title)

class Favourites(db.Model):

    __tablename__ = 'favourites'

    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    
    def __init__(self, bid, uid):
        self.book_id = bid
        self.user_id = uid

    def __repr__(self):
        return '<Favourite %r>' % (self.id)

class Classes(db.Model):

    __tablename__ = 'classes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    course_title = db.Column(db.String)
    course_code = db.Column(db.String)
    
    def __init__(self, uid, course_title, course_code):
        self.user_id = uid
        self.course_title = ctid
        self.course_code = ccid


    def __repr__(self):
        return '<Clas %r>' % (self.id)

class classJoined(db.Model):

    __tablename__ = 'classJoined'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    course_title = db.Column(db.String)
    course_code = db.Column(db.String)
    
    def __init__(self, uid, course_title, course_code):
        self.user_id = uid
        self.course_title = ctid
        self.course_code = ccid


    def __repr__(self):
        return '<ClasJoin %r>' % (self.id)