from flask import Flask
from flask import g
import sqlite3

def connect_db():
    try:
        rv = sqlite3.connect('database.db')
        rv.row_factory = sqlite3.Row
        return rv
    except sqlite3.Error as e:
        print "An error occured while connecting to database:", e.args[0]

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

def close_db():
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()
        
#Working
#Return True if there is a user with that email address and False otherwise. 
def verify_email(email):
    db = get_db()
    cur = db.execute("SELECT Email FROM Users WHERE Email='" + email + "'")
    if cur.fetchone() is None:
        #close_db()
        return False
    else:
        #close_db()
        return True

#Takes in a dictionary containing the attributes: email, password, firstname, familyname, gender, city, country
def insert_new_user(user):
    db = get_db()
    try:
        db.execute("INSERT INTO Users (Email, Password, Firstname, Familyname, Gender, City, Country) VALUES (?,?,?,?,?,?,?)", (user["email"], user["password"], user["firstname"], user["familyname"], user["gender"], user["city"], user["country"]))
        db.commit()
        return True
    except sqlite3.IntegrityError as e:
        return False

#Working
def add_logged_in_user(email, token):
    db = get_db()
    try:
        db.execute("INSERT INTO LoggedInUsers (Email, Token) VALUES (?,?)", (email,token))
        db.commit()
        return True
    except sqlite3.IntegrityError as e:
        return False

#Working
def remove_logged_in_user(token):
    db = get_db()
    db.execute("DELETE FROM LoggedInUsers WHERE Token='" + token + "'")
    db.commit()
    #close_db()

#Working
def set_password(email, password):
    db = get_db()
    db.execute("UPDATE Users SET Password='" + password + "' WHERE Email='" + email + "'")
    db.commit()

#Working
def get_password(email):
    db = get_db()
    cur = db.execute("SELECT Password FROM Users WHERE Email='" + email + "'")

    return cur.fetchone()[0]

#Working
def check_if_logged_in(token):
    db = get_db()
    cur = db.execute("SELECT * FROM LoggedInUsers WHERE Token='" + token + "'")
    if cur.fetchone() is None:
        #close_db()
        return False
    else:
        #close_db()
        return True

#Working
def token_to_email(token):
    db = get_db()
    cur = db.execute("SELECT Email FROM LoggedInUsers WHERE Token='" + token + "'")
    result = cur.fetchone()
    return result[0]

#Working
def get_user_data(email):
    db = get_db()
    cur = db.execute("SELECT Email, Firstname, Familyname, Gender, City, Country FROM Users WHERE Email='" + email + "'")
    result = [dict(email=row[0], firstname=row[1], familyname=row[2], gender=row[3], city=row[4], country=row[5]) for row in cur.fetchall()]
    return result

#Returns a list of dictionaries.
def get_user_messages(email):
    db = get_db()
    cur = db.execute("SELECT Sender, Content FROM Messages WHERE Recipient='" + email + "'")
    result = [dict(sender=row[0], content=row[1]) for row in cur.fetchall()]
    return result

#sender and recipient parameters are the corresponding email addresses
def insert_new_message(sender, message, recipient):
    db = get_db()
    cur = db.execute("INSERT INTO Messages (Sender, Recipient, Content) VALUES (?,?,?)", (sender, recipient, message))
    db.commit()
    #this should return something later, catch exceptions and return error code ot sumtin
