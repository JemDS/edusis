"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app, db, login_manager
from flask import render_template, request, send_from_directory, jsonify, url_for

import os
from werkzeug.utils import secure_filename
from .forms import BookForm, RegistrationForm, LoginForm, SearchForm, ClassForm

from flask_login import login_user, logout_user, current_user, login_required
from app.models import Users, Books, Favourites
from werkzeug.security import check_password_hash

from datetime import date
from functools import wraps
import jwt

# Create a JWT @requires_auth decorator
# This decorator can be used to denote that a specific route should check
# for a valid JWT token before displaying the contents of that route.
def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None) # or request.cookies.get('token', None)

    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

    except jwt.ExpiredSignatureError:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    #g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated

###
# Routing for your application.
###

@app.route("/api/register", methods=["POST"])
def register():
    myform = RegistrationForm()
    if request.method == 'POST' and myform.validate_on_submit():
        # Get file data and save to your uploads folder
        username = myform.Username.data
        password = myform.Password.data
        name = myform.Name.data
        email = myform.Email.data
        loc = myform.Location.data
        acct = myform.Account_Type.data
        edut = myform.Education_Level.data
        photo = myform.photo.data
        date_joined = date.today()

        #if not checkLen(bio):
           # info = {"message": "Max Bio: 500 characters"}
            #return  jsonify(error=info)

        num = Users.query.filter_by(username = username).all()
        l = len(num)
        if l > 0:
            info = {
            "message": "Username already taken: " +username
            }
            return  jsonify(error=info)


        filefolder = app.config['UPLOAD_FOLDER']
        filename = secure_filename(photo.filename)

        #username, password, name, email, loca, acct, url, date
        user = Users (username, password, name, email, loc, acct, edut, filename, date_joined)
        db.session.add(user)
        db.session.commit()

        photo.save(os.path.join(filefolder,filename))

        info = {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "photo": user.photo,
            "email": user.email,
            "location": user.location,
            "type": user.account_type,
            "type": user.education_level,
            "date_joined": user.date_joined
            }

        return  jsonify(info=info)

    error = form_errors(myform)
    return jsonify(error= error)


@app.route('/api/books', methods=['POST', 'GET'])
@login_required
###@requires_auth
def books():
    myform = BookForm()
    if request.method == 'POST':
        if myform.validate_on_submit():
            # Get file data and save to your uploads folder
            title = myform.Title.data
            author = myform.Author.data
            subject = myform.Subject.data
            year = myform.Year.data
            publisher = myform.Publisher.data
            isbn = myform.ISBN.data
            uid = myform.User.data
            photo = myform.photo.data

            #validate ISBN
            #if not checkISBN(isbn):
                #info = {"message": "Invalid ISBN"}
                #return  jsonify(error=info)

            
            filefolder = app.config['UPLOAD_FOLDER']
            filename = secure_filename(photo.filename)

            #title, auth, type1, year, pub, isbn, url, uid
            book = Books (title, auth, type1, year, pub, isbn, url, uid)
            db.session.add(book)
            db.session.commit()

            #rootdir = os.getcwd()
            photo.save(os.path.join(filefolder,filename))

            book = {
                'title': book.title,
                'author': book.author, 
                'type': book.subject,
                'subject': book.subject, 
                'year': book.year,  
                'publisher': book.publisher, 
                'isbn': book.isbn,
                'photo': url_for('get_image', filename="" + book.photo),
                'user_id': book.user_id
            }

            return  jsonify(book=book)
        error = form_errors(myform)
        return jsonify(error= error)

    if request.method == 'GET':
        booksResult = db.session.query(Books).all()
        books = [
            {
                "id": 123,
                "title": "The Grass is Always Greener",
                "author": "Jeffrey Archer", 
                "type": "Student",
                "subject": "English", 
                "year": "2002",  
                "publisher": "Modern Times", 
                "isbn": "1-86092-049-7",
                "photo": "http://localhost/Book photos/Jeffrey Archer.png",
                "user_id": 1
            },

            {
                "id": 456,
                "title": "Murder!",
                "author": "Arnold Bennett", 
                "type": "Student",
                "subject": "English", 
                "year": "2004",  
                "publisher": "Modern Times", 
                "isbn": "1-86092-012-8",
                "photo": "http://localhost/Book photos/Arnold Bennett.png",
                "user_id": 2
            },

            {
                "id": 789,
                "title": "An Occurrence at Owl Creek Bridge One of the Missing",
                "author": "Ambrose Bierce", 
                "type": "Student",
                "subject": "English", 
                "year": "1842",  
                "publisher": "AdventureLog", 
                "isbn": "1-86092-006-3",
                "photo": "http://localhost/Book photos/Ambrose Bierce.png",
                "user_id": 3
            },

            {
                "id": 321,
                "title": "A Boy at Seven, Fear and Loathing in Aspen",
                "author": "John Bidwell", 
                "type": "Student",
                "subject": "English", 
                "year": "1842",  
                "publisher": "AdventureLog", 
                "isbn": "1-86092-022-5",
                "photo": "http://localhost/Book photos/John Bidwell.png",
                "user_id": 4
            },

            {
                "id": 654,
                "title": "The Higgler",
                "author": "A. E. Coppard", 
                "type": "Student",
                "subject": "English", 
                "year": "1957",  
                "publisher": "Romanaians", 
                "isbn": "   1-86092-010-1",
                "photo": "http://localhost/Book photos/A. E. Coppard.png",
                "user_id": 5
            },

            {
                "id": 987,
                "title": "The Open Boat",
                "author": "Stephen Crane", 
                "type": "Student",
                "subject": "English", 
                "year": "1871",  
                "publisher": "AdventureLog", 
                "isbn": "1-86092-022-5",
                "photo": "http://localhost/Book photos/Stephen Crane.png",
                "user_id": 6
            },

        ]
        for b in booksResult:
            book = {
                "id": b.id,
                "title": b.title,
                "author": b.author, 
                "type": b.subject,
                "subject": b.subject, 
                "year": b.year,  
                "publisher": b.publisher, 
                "isbn": b.isbn,
                "photo": url_for('get_image', filename="" + b.photo),
                "user_id": current_user.id
            }
            books.append(book)
        
        return  jsonify(books=books)
    error = form_errors(myform)
    return jsonify(error= error)


@app.route("/api/books/<book_id>", methods=["GET"])
@login_required
@requires_auth
def book(book_id):
    if request.method == 'GET':
        b = Books.query.get(book_id)
        book = {
            "id": b.id,
            "title": b.title,
            "author": b.author, 
            "type": b.subject,
            "subject": b.subject, 
            "year": b.year,  
            "publisher": b.publisher, 
            "isbn": b.isbn,
            "photo": url_for('get_image', filename="" + b.photo),
            "user_id": b.id
        }

        return  jsonify(book=book)
    error = form_errors(myform)
    return jsonify(error= error)


@app.route("/api/books/<book_id>/favourite", methods=["POST"])
@login_required
@requires_auth
def bookFav(book_id):
    if request.method == 'POST':
        num = Favourites.query.filter_by(book_id = book_id).filter_by(user_id = current_user.id).all()
        l = len(num)
        if l > 0:
            info = {
            "message": "Book Already Favourited",
            "book_id": book_id
            }
            return  jsonify(info=info)
        fav = Favourites(book_id, current_user.id)
        db.session.add(fav)
        db.session.commit()
        info = {
            "message": "Book Successfully Favourited",
            "book_id": fav.book_id
        }
        return  jsonify(info=info)
    info = {"message": "Book Failed to be Favourited" }
    return  jsonify(info=info)


@app.route("/api/search", methods=["GET"])
@login_required
@requires_auth
def search():
    myform = SearchForm()
    if request.method == 'GET':
        stitle = request.args.get('title')
        sauthor = request.args.get('author')
        sisbn = request.args.get('isbn')

        stitle = "%{}%".format(stitle)
        sauthor = "%{}%".format(sauthor)
        sisbn = "%{}%".format(sisbn)
        
        results = Books.query.filter(Books.title.ilike(stitle), Books.author.ilike(author), Books.isbn.ilike(isbn)).all()
        books = []
        for b in results:
            book = {
                "id": b.id,
                "title": b.title,
                "author": b.author, 
                "type": b.subject,
                "subject": b.subject, 
                "year": b.year,  
                "publisher": b.publisher, 
                "isbn": b.isbn,
                "photo": url_for('get_image', filename="" + b.photo),
                "user_id": b.id
            }
            books.append(book)

        return  jsonify(books=books)
    error = form_errors(myform)
    return jsonify(error= error)

@app.route("/api/classes", methods=["GET"])
@login_required
@requires_auth
def classes():
    myform = ClassForm()
    if request.method == 'POST':
        if myform.validate_on_submit():
            course_title = myform.course_title.data
            course_code = myform.course_code.data

            clas ={
                'course_title': clas.course_title,
                'course_code': clas.course_code,
                "user_id": clas.id
            }
        
        return  jsonify(clas=clas)
    error = form_errors(myform)
    return jsonify(error= error)   

    if request.method == 'GET':
        classResult = db.session.query(Classes).all()
        classes = [
            {
                "id": 123,
                "course_title": "Beginner English",
                "course_code": "BE100", 
            },

            {
                "id": 456,
                "course_title": "Intermediate English",
                "course_code": "BE200", 
            },
            {
                "id": 789,
                "course_title": "Advanced English",
                "course_code": "BE300", 
            },
            {
                "id": 321,
                "course_title": "Beginner Math",
                "course_code": "BM100", 
            },
            {
                "id": 654,
                "course_title": "Intermediate Math",
                "course_code": "BM200", 
            },
            {
                "id": 987,
                "course_title": "Advanced Math",
                "course_code": "BM300", 
            },
        ]
        for c in classResult:
            clas = {
                "id": c.id,
                'course_title': c.course_title,
                'course_code': c.course_code,
                "user_id": current_user.id
             }

            classes.append(clas)
        
        return  jsonify(classes=classes)
    error = form_errors(myform)
    return jsonify(error= error)

@app.route("/api/classes/<class_id>", methods=["GET"])
@login_required
@requires_auth
def clas(class_id):
    if request.method == 'GET':
        c = Classes.query.get(class_id)
        clas = {
                "id": c.id,
                "course_title": c.course_title,
                "course_code": c.course_code,
                "user_id": c.id
        }

        return  jsonify(clas=clas)
    error = form_errors(myform)
    return jsonify(error= error)

@app.route("/api/classes/<classes_id>/join", methods=["POST"])
@login_required
@requires_auth
def joinClass(class_id):
    if request.method == 'POST':
        num = ClassJoined.query.filter_by(class_id = class_id).filter_by(user_id = current_user.id).all()
        l = len(num)
        if l > 0:
            info = {
            "message": "Already Joined Class",
            "class_id": class_id
            }
            return  jsonify(info=info)
        join = ClassJoined(class_id, current_user.id)
        db.session.add(join)
        db.session.commit()
        info = {
            "message": "Successfully Joined Class",
            "class_id": fav.book_id
        }
        return  jsonify(info=info)
    info = {"message": " Failed to join class" }
    return  jsonify(info=info)

@app.route("/api/users/<user_id>", methods=["GET"])
@login_required
@requires_auth
def users(user_id):
    userq = Users.query.get(int(user_id))
    user = {
        "id": userq.id,
        "username": userq.username,
        "name": userq.name,
        "photo": url_for('get_image', filename="" + userq.photo),
        "email": userq.email,
        "location": userq.location,
        "account_type": userq.account_type,
        "date_joined": userq.date_joined
    }
    return  jsonify(user=user)


@app.route("/api/users/<user_id>/favourites", methods=["GET"])
@login_required
@requires_auth
def userFav(user_id):
    results = Favourites.query.filter_by(user_id = user_id).all()
    books = []
    for r in results:
        
        b = Books.query.get(r.car_id)
        book = {
                "id": b.id,
                "title": b.title,
                "author": b.author, 
                "type": b.subject,
                "subject": b.subject, 
                "year": b.year,  
                "publisher": b.publisher, 
                "isbn": b.isbn,
                "photo": url_for('get_image', filename="" + b.photo),
                "user_id": b.id
        }
        books.append(book)

    return  jsonify(books=books)


@app.route("/api/auth/studentlogin", methods=["POST"])
def studentlogin():
    myform = LoginForm()
    if request.method == "POST":
        # change this to actually validate the entire form submission
        # and not just one field
        #if form.username.data:
        if myform.validate_on_submit():
            usern = myform.Username.data
            passw = myform.Password.data

            user = Users.query.filter_by(username= usern)

            # Get the username and password values from the form.
            user = Users.query.filter_by(username= usern).first()
            # using your model, query database for a user based on the username
            # and password submitted. Remember you need to compare the password hash.
            # You will need to import the appropriate function to do so.
            # Then store the result of that query to a `user` variable so it can be
            # passed to the login_user() method below.
            
            if user and check_password_hash(user.password, passw):
                # get user id, load into session
                login_user(user)
                
                secret = app.config['SECRET_KEY']
                payload = {'id': user.id, 'name': user.name}
                encoded_jwt = jwt.encode(payload, secret, algorithm='HS256')
                
                info = {
                    "message": "Login Successful",
                    "token": encoded_jwt.decode('UTF-8')
                 }

                # remember to flash a message to the user
                #flash('Logged in successfully.', 'success')
                #return redirect(url_for("secure_page"))  # they should be redirected to a secure-page route instead
                return  jsonify(info=info)
            info = {"message": "Invalid Username/ Password"}
            return  jsonify(error=info)
    #return render_template("login.html", form=form)
    error = form_errors(myform)
    return jsonify(error= error)

@app.route("/api/auth/educatorlogin", methods=["POST"])
def educatorlogin():
    myform = LoginForm()
    if request.method == "POST":
        # change this to actually validate the entire form submission
        # and not just one field
        #if form.username.data:
        if myform.validate_on_submit():
            usern = myform.Username.data
            passw = myform.Password.data

            user = Users.query.filter_by(username= usern)

            # Get the username and password values from the form.
            user = Users.query.filter_by(username= usern).first()
            # using your model, query database for a user based on the username
            # and password submitted. Remember you need to compare the password hash.
            # You will need to import the appropriate function to do so.
            # Then store the result of that query to a `user` variable so it can be
            # passed to the login_user() method below.
            
            if user and check_password_hash(user.password, passw):
                # get user id, load into session
                login_user(user)
                
                secret = app.config['SECRET_KEY']
                payload = {'id': user.id, 'name': user.name}
                encoded_jwt = jwt.encode(payload, secret, algorithm='HS256')
                
                info = {
                    "message": "Login Successful",
                    "token": encoded_jwt.decode('UTF-8')
                 }

                # remember to flash a message to the user
                #flash('Logged in successfully.', 'success')
                #return redirect(url_for("secure_page"))  # they should be redirected to a secure-page route instead
                return  jsonify(info=info)
            info = {"message": "Invalid Username/ Password"}
            return  jsonify(error=info)
    #return render_template("login.html", form=form)
    error = form_errors(myform)
    return jsonify(error= error)


@app.route("/api/auth/logout")
@login_required
@requires_auth
def logout():
    # Logout the user and end the session
    logout_user()
    info = [{"message": "You were sucessfully logged out"}]
    return  jsonify(info=info)
    #return redirect(url_for('index'))

@app.route('/images/<filename>')
def get_image(filename):
    rootdir = os.getcwd()
    return send_from_directory(os.path.join(rootdir, app.config['UPLOAD_FOLDER']), filename)

@app.route('/icon/<filename>')
def get_icon(filename):
    rootdir = os.getcwd()
    return send_from_directory(os.path.join(rootdir, app.config['ICON_FOLDER']), filename)


@app.route('/uploads/<path:filename>', methods=['GET', 'POST'])
def download(filename):
    uploads = os.path.join(current_app.root_path, app.config['UPLOAD_FOLDER'])
    return send_from_directory(directory=uploads, filename=filename)


def checkISBN(I):
    I = I.replace(',', '')
    status = True
    try:
        float(I)
        status = True
    except:
        status = False
    return status

def checkLen(s):
    if len(s)>=500:
        return False
    else:
        return True

# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))


# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')


# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

###
# The functions below should be applicable to all Flask apps.
###

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
