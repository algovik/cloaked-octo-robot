from flask import Flask
import database_helper

app = Flask(__name__)
app.debug = True

@app.route('/signin')
def sign_in(email, password):
	if verify_password(email, password):
		
		token = ''
		#create randomized token

		add_logged_in_user(email, token) #Should we keep a log of logged in users in db?
		return {'success':True,'message':'Successfully signed in.','data':token}
	else:
		return {'success':False,'message':'Wrong username or password.'}


@app.route('/signup')
def sign_up(email, password, firstname, familyname, gender, city, country):
	#Call to appropirate function(s) in database_helper

@app.route('/signout')
def sign_out(token):
	#Call to appropirate function(s) in database_helper

@app.route('/changepassword')
def change_password(token, old_password, new_password):
	#Call to appropirate function(s) in database_helper

@app.route('/getuserdatabytoken')
def get_user_data_by_token(token):
	#Call to appropirate function(s) in database_helper

@app.route('/getuserdatabyemail')
def get_user_data_by_email(token, email):
	#Call to appropirate function(s) in database_helper

@app.route('/getusermessagesbytoken')
def get_user_messages_by_token(token):
	#Call to appropirate function(s) in database_helper

@app.route('/getusermessagesbyemail')
def get_user_messages_by_email(token, email):
	#Call to appropirate function(s) in database_helper

@app.route('/postmessage')
def post_message(token, message, email):
	#Call to appropirate function(s) in database_helper


if __name__ = '__main__':
	app.run()