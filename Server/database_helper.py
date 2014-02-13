#This file will contain all the functions that access
#and control the database and shall contain some SQL scripts.
#This file will be used by the server to access the database.

def get_db():
	#open database

def close_db():
	#close database

def verify_password(email, password):
	#create hash of password
	#compare hash of password with hash of email's stored password
	#if true, return True, else False