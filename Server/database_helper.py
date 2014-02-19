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

def get_password(user_email):
	db = get_db()
	cur = db.execute('SELECT password FROM users WHERE email=' + user_email + ';')
	return cur.fetchone()