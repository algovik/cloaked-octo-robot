from flask import Flask
from flask import g
import sqlite3

def connect_db():
    rv = sqlite3.connect('database.db')
    rv.row_factory = sqlite3.Row
    return rv

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

def close_db():
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


#Works
def verify_email(email):
    db = get_db()
    cur = db.execute("SELECT Email FROM Users WHERE Email='" + email + "'")
    if cur.fetchone() is None:
        close_db()
        return False
    else:
        close_db()
        return True

#Doesn't work
#Takes in a dictionary containing the attributes: email, password, firstname, familyname, gender, city, country
def insert_new_user(user):
    db = get_db()
    db.execute("INSERT INTO Users (Email, Password, Firstname, Familyname, Gender, City, Country) VALUES (?,?,?,?,?,?,?)", (user["email"], user["password"], user["firstname"], user["familyname"], user["gender"], user["city"], user["country"]))
    db.commit()
    close_db()

#Works for test function add_user
def add_logged_in_user(email, token):
    db = get_db()
    db.execute("INSERT INTO LoggedInUsers (Email, Token) VALUES (?,?)", (email,token))
    db.commit()
    close_db()

#Works for test function remove_user, but not for sign_out
def remove_logged_in_user(token):
    db = get_db()
    db.execute("DELETE FROM LoggedInUsers WHERE Token='" + token + "'")
    db.commit()
    close_db()

#Doesn't work
def get_password(email):
    db = get_db()
    cur = db.execute("SELECT Password FROM Users WHERE Email='" + email + "'")
    return cur.fetchone()

#Works for test function read_user
def check_if_logged_in(token):
    db = get_db()
    cur = db.execute("SELECT * FROM LoggedInUsers WHERE Token='" + token + "'")
    if cur.fetchone() is None:
        close_db()
        return False
    else:
        close_db()
        return True