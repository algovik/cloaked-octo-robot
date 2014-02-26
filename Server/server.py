from flask import Flask
from flask import g
from flask import request
from random import choice
import database_helper
import hashlib

app = Flask(__name__)
app.debug = True
#app.config['DEBUG'] = True


#HTTP functions
#Parameters: email, password
@app.route('/signin', methods=['POST'])
def sign_in():
    email = request.form['email']#for lab 3, use request.form.get('email'), works with the 'send' function we are using
    password = request.form['password']
    if database_helper.verify_email(email) and verify_password(email, password):
        token = ''
        letters = map(chr, range(97, 123) + range(65,91) + range(49,58))
        #letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0']
        for i in xrange(36):
            token += choice(letters)
        success_bool = database_helper.add_logged_in_user(email, token)
        if success_bool:
            return token + ""
        else:
            return 'Already signed in.'
    else:
        return 'Wrong username or password.'

#Parameter identifiers should be used when trying to retrieve a specific value.
#Parameters: email, password, firstname, familyname, gender, city, country
@app.route('/signup', methods=['POST'])
def sign_up():
    email = request.form['email']
    new_user=dict(email=email, password=hash_pwd(request.form['password']), firstname=request.form['firstname'], familyname=request.form['familyname'], gender=request.form['gender'], city=request.form['city'], country=request.form['country'])
    if database_helper.verify_email(email)==False:
        if validate_signup(new_user):
            database_helper.insert_new_user(new_user)
            return 'Successfully created a new user.'       
        else:
            return 'Formdata not complete.'
    else:
        return 'User already exists.'

#Parameters: token
@app.route('/signout', methods=['GET'])
def sign_out():
    token = request.args.get('token')
    if not_none(token)==False:
        return 'Ah ah ah! You did not use the magic querystring.' 
    if database_helper.check_if_logged_in(token):
        database_helper.remove_logged_in_user(token)
        return 'Succesfully logged out.'
    else:
        return 'You are not signed in.'

#Parameters: token, old_password, new_password
@app.route('/changepassword', methods=['POST'])
def change_password():
    token = request.args.get('token')
    if not_none(token)==False:
        return 'Ah ah ah! That is not a token, THIS is a token: asA5hG9anfG7HlpzK1.'
    if database_helper.check_if_logged_in(token):
        email = database_helper.token_to_email(token)
        old_pw=request.form['old_password']
        new_pw=request.form['new_password']
        if not_none(old_pw)==False or not_none(new_pw)==False:
            return 'Passwords can not be null.'
        if old_pw==new_pw:
            return 'New password must be different from old password.'
        if verify_password(email,old_pw):
            database_helper.set_password(email, hash_pwd(new_pw))
            return 'Password changed.'
        else: 
            return 'Wrong password.'
    else:
        return 'You are not logged in.'

#Parameters: token
@app.route('/getuserdatabytoken', methods=['GET'])
def get_user_data_by_token():
    token = request.args.get('token')
    if not_none(token)==False:
        return 'Ah ah ah! That is not a token, THIS is a token: asA5hG9anfG7HlpzK1.'
    if database_helper.check_if_logged_in(token):
        email = database_helper.token_to_email(token)
        return get_user_data_by_email(token, email)
    else:
        return 'No such user.'

#Parameters: token, email
@app.route('/getuserdatabyemail', methods=['GET'])
def get_user_data_by_email_route():
    token = request.args.get('token')
    email = request.args.get('email')
    if not_none(token)==False or not_none(email)==False:
        return 'Invalid querystring.'
    return get_user_data_by_email(token,email)

def get_user_data_by_email(token, email):
    if database_helper.check_if_logged_in(token):
        if verify_email(email)==True:#must write like this in python, just 'verify_email(email):' doesn't work
            match = database_helper.get_user_data(email)
            return match[0]['email'] + "|" + match[0]['firstname'] + "|" + match[0]['familyname'] + "|" + match[0]['gender'] + "|" + match[0]['city'] + "|" + match[0]['country'] + ""
        else:
            return 'No such user.'
    else:
        return 'You are not signed in.'

#Parameters: token
@app.route('/getusermessagesbytoken', methods=['GET'])
def get_user_messages_by_token():
    token = request.args.get('token')
    if not_none(token)==False:
        return 'Invalid querystring.'
    email = database_helper.token_to_email(token)
    return get_user_messages_by_email(token, email)

#Parameters: token, email
@app.route('/getusermessagesbyemail', methods=['GET'])
def get_user_messages_by_email_route():
    token = request.args.get('token')
    email = request.args.get('email')
    if not_none(token)==False or not_none(email)==False:
        return 'Invalid querystring.'
    return get_user_messages_by_email(token, email)

def get_user_messages_by_email(token, email):
    if database_helper.check_if_logged_in(token):
        if database_helper.verify_email(email):
            matches = database_helper.get_user_messages(email)
            result = stringify_messages(matches)
            return result
        else:
            return 'User not found.'
    else:
        return 'Must be logged in to retrieve messages.'


#Parameters: token, message, email
@app.route('/postmessage', methods=['POST'])
def post_message():
    token = request.form.get('token')
    message = request.form.get('message')
    email = request.form.get('email')
    if not_none(token)==False or not_none(email)==False:
        return 'Invalid querystring.'
    if database_helper.check_if_logged_in(token):
        sender = database_helper.token_to_email(token)
        if not_none(message):
            if database_helper.verify_email(email):
                database_helper.insert_new_message(sender, message, email)
                return 'Message has been sent.'
            else:
                return 'No such recipient.'
        else:
            return 'Message must not be empty.'
    else:
        return 'Sender must be logged in.'

#Test functions for trying out single database_helper functions.
@app.route('/verify/<email>')
def verify_email(email):
    if database_helper.verify_email(email):
        return 'User exists.'
    else:
        return 'User does not exist.'

@app.route('/adduser/<email>/<token>')
def add_user(email, token):
    database_helper.add_logged_in_user(email, token)
    return 'Success'

@app.route('/removeuser/<token>')
def remove_user(token):
    database_helper.remove_logged_in_user(token)
    return 'Success'

@app.route('/readuser/<token>')
def read_user(token):
    if database_helper.check_if_logged_in(token):
        return 'User is logged in.'
    else:
        return 'User is not logged in.'

@app.route('/getpassword/<email>')
def get_password(email):
    return database_helper.get_password(email)

@app.route('/setpassword/<email>/<password>')
def set_password(email, password):
    database_helper.set_password(email, hash_pwd(password))
    return 'Success'

#Local functions
def verify_password(email, password):
    hash = hash_pwd(password)
    if hash == database_helper.get_password(email):
        return True
    else:
        return False

def hash_pwd(password):
    m = hashlib.sha224()
    m.update(password)
    return m.hexdigest()

def validate_signup(formDictionary):
    for val in formDictionary.values():
        if not_none(val)!=True:
            return False
    return True

def not_none(fieldName):
    valid=True
    if fieldName=="" or fieldName is None: #'is' ~ identical operator, == ~ equality operator
        valid=False

    return valid

#Takes in a list of dictionaries(dict(from, content)) and 'stringifies'
def stringify_messages(messages):
    result="Sender | Content";
    for message in messages:
        result = result +"|"+ message['sender'] + "|" + message['content'] + ""
    return result

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


if __name__ == '__main__':
    app.run()