#This file will contain all the functions that access
#and control the database and shall contain some SQL scripts.
#This file will be used by the server to access the database.

def get_db():
	if not hasattr(g, 'sqlite_db'):
		g.sqlite_db = connect_db()
	return g.sqlite_db

def close_db():
	if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

def get_password(email):
	db = get_db()
	db.execute('')
