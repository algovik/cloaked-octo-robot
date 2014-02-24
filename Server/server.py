from flask import Flask
from flask import g
from random import choice
import database_helper
import hashlib

app = Flask(__name__)
app.debug = True
#app.config['DEBUG'] = True


#HTTP functions
#Working
@app.route('/signin/<email>/<password>')
def sign_in(email, password):
    if database_helper.verify_email(email) and verify_password(email, password):
        token = ''
        letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0']
        for i in xrange(36):
            token += choice(letters)
        database_helper.add_logged_in_user(email, token)
        return token
    else:
        return 'Wrong username or password.'


#Useful to know about locals(): the dictionary does not neccessary contain the parameters in the expected order.
#Parameter identifiers should be used when trying to retrieve a specific value.
@app.route('/signup/<email>/<password>/<firstname>/<familyname>/<gender>/<city>/<country>')
def sign_up(email, password, firstname, familyname, gender, city, country):
    if database_helper.verify_email(email)==False:
        if validate_signup(locals()):
            database_helper.insert_new_user(locals())
            return {'success':True, 'message':'Successfully created a new user.'}        
        else:
            return {'success':False, 'message':'Formdata not complete.'}
    else:
        return {'success':False, 'message':'User already exists.'}

#Working
@app.route('/signout/<token>')
def sign_out(token):
    if database_helper.check_if_logged_in(token):
        database_helper.remove_logged_in_user(token)
        return 'Succesfully logged out.'
    else:
        return 'You are not signed in.'

#Working
@app.route('/changepassword/<token>/<old_password>/<new_password>')
def change_password(token, old_password, new_password):
    if database_helper.check_if_logged_in(token):
        email = database_helper.token_to_email(token)
        if verify_password(email,old_password):
            database_helper.set_password(email, hash_pwd(new_password))
            return 'Password changed.\n'
        else: 
            return 'Wrong password.\n'
    else:
        return 'You are not logged in.\n'

#Working
@app.route('/getuserdatabytoken/<token>')
def get_user_data_by_token(token):
    if database_helper.check_if_logged_in(token):
        email = database_helper.token_to_email(token)
        return get_user_data_by_email(token, email)
    else:
        return 'No such user.'

#Working
@app.route('/getuserdatabyemail/<token>/<email>')
def get_user_data_by_email(token, email):
    if database_helper.check_if_logged_in(token):
        if verify_email(email):
            match = database_helper.get_user_data(email)
            return match[0]['email'] + "|" + match[0]['firstname'] + "|" + match[0]['familyname'] + "|" + match[0]['gender'] + "|" + match[0]['city'] + "|" + match[0]['country']
        else:
            return 'No such user.'
    else:
        return 'You are not signed in.'

#Need to retrieve token
@app.route('/getusermessagesbytoken/<token>')
def get_user_messages_by_token(token):
    if database_helper.check_if_logged_in(token):
        email = database_helper.token_to_email(token)
        return get_user_messages_by_email(token, email)
    else:
        return 'No such user.'

@app.route('/getusermessagesbyemail/<token>/<email>')
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

@app.route('/postmessage/<token>/<message>/<email>')
def post_message(token, message, email):
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
        return 'User exists.\n'
    else:
        return 'User does not exist.\n'

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
        return 'User is logged in.\n'
    else:
        return 'User is not logged in.\n'

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
    result="Number | Sender | Content\n";
    index=0;
    for message in messages:
        result = result + index +"|"+ message['from'] + "|" + message['content'] + "\n"
        index=index+1;
    return result

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


if __name__ == '__main__':
    app.run()