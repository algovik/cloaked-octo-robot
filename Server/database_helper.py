import sqlite3 as sqlite3

#This file will contain all the functions that access
#and control the database and shall contain some SQL scripts.
#This file will be used by the server to access the database.

def connect_db():
	rv = sqlite3.connect(app.config['DATABASE'])
	rv.row_factory = sqlite3.Row
	return rv

def get_db():
	if not hasattr(g, 'sqlite_db'):
		g.sqlite_db = connect_db()
	return g.sqlite_db

def close_db():
	if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()
    return ''

def verify_email(email):
	db = get_db()
	cur = db_execute('SELECT Email FROM Users WHERE Email=' + email)
	if cur.fetchone() == None:
		return False
	else:
		return True

def add_logged_in_users(email, token):
	db = get_db()
	cur = db.execute('INSERT INTO LoggedInUsers (Email, Token) VALUES ('+ email +', ' + token + ')')

def get_password(email):
	db = get_db()
	cur = db.execute('SELECT Password FROM Users WHERE Email=' + email)
	return cur.fetchone

def check_if_logged_in(token):
	db = get_db()
	cur = db_execute('SELECT Token FROM LoggedInUsers WHERE Token=' + token)
	if cur.fetchone() == None:
		return False
	else:
		return True