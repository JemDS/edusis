from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SelectField, PasswordField, HiddenField
from wtforms.fields.html5 import EmailField
from wtforms.widgets import TextArea
from wtforms.validators import DataRequired, InputRequired



class UploadForm (FlaskForm):
    description = StringField('Description', widget=TextArea(), validators=[DataRequired()])
    photo = FileField('Photo', validators=[
        FileRequired(),
        FileAllowed(['jpg', 'png', 'Images only!'])
    ])


class LoginForm (FlaskForm):
    Username = StringField('Username', validators=[DataRequired()])
    Password = PasswordField('Password', validators=[DataRequired()])


class RegistrationForm (FlaskForm):
    Username = StringField('Username', validators=[DataRequired()])
    Password = PasswordField('Password', validators=[DataRequired()])
    Name = StringField('Name', validators=[DataRequired()])
    Email = EmailField('Email', validators=[DataRequired()])
    Location = StringField('Location', validators=[DataRequired()])
    
    choices1 = [('Educator', 'Educator'), ('Student', 'Student')]
    Account_Type = SelectField("Account Type", choices = choices1, default = ['Student'])

    choices2 = [('Primary', 'Primary'), ('Secondary', 'Secondary'), ('Teritiary', 'Teritiary')]
    Education_Level = SelectField("Education_Level", choices = choices2, default = ['Primary'])

    photo = FileField('Photo', validators=[
        FileRequired(),
        FileAllowed(['jpg', 'png', 'Images only!'])
    ])

class BookForm (FlaskForm):
    Title = StringField('Title', validators=[DataRequired()])
    Author = StringField('Author', validators=[DataRequired()])
    Year = StringField('Year', validators=[DataRequired()])
    Publisher = StringField('Publisher', validators=[DataRequired()])
    ISBN = StringField('ISBN', validators=[DataRequired()])
    User = HiddenField('User', validators=[DataRequired()])
    
    choices1 = [('Accounts', 'Accounts'), ('Biology', 'Biology'), ('Chemistry', 'Chemistry'), ('Computer Science','Computer Science'), ('English','English')
               , ('Mathematics','Mathematics')]
              
    Subject = SelectField("Subject", choices = choices1, default = ['English'])

   
    photo = FileField('Photo', validators=[
        FileRequired(),
        FileAllowed(['jpg', 'png', 'Images only!'])
    ])

class SearchForm(FlaskForm):
    title = StringField('title')
    author = StringField('author') 
    isbn = StringField('isbn') 

class ClassForm(FlaskForm):
    course_title = StringField('course_title')
    course_code = StringField('course_code') 
