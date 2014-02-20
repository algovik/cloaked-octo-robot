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

def verify_email(email):
    db = get_db()
    cur = db.execute("SELECT Email FROM Users WHERE Email=" + email)
    close_db(); # We probobly should close db connections roojjttt?
    if cur.fetchone() is None:
        return False
    else:
        return True

#Takes in a dictionary containing the attributes: email, password, firstname, familyname, gender, city, country
def insert_new_user(user):
    db = get_db()
    cur = db.execute("INSERT INTO Users (Email, Password, Firstname, Familyname, Gender, City, Country) VALUES (?,?,?,?,?,?,?)", (user["email"], user["password"], user["firstname"], user["familyname"], user["gender"], user["city"], user["country"]))
    cur.commit()

def add_logged_in_user(email, token):
    db = get_db()
    cur = db.execute("INSERT INTO LoggedInUsers (Email, Token) VALUES (?,?)", (email,token))
    cur.commit()

def get_password(email):
    db = get_db()
    cur = db.execute("SELECT Password FROM Users WHERE Email=" + email)
    return cur.fetchone

def check_if_logged_in(token):
    db = get_db()
    cur = db.execute("SELECT Token FROM LoggedInUsers WHERE Token=" + token)
    if cur.fetchone() is None:
        return False
    else:
        return True