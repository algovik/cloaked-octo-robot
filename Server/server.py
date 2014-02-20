from flask import Flask
from flask import g
from random import choice
import database_helper
import hashlib

app = Flask(__name__)
app.debug = True
#app.config['DEBUG'] = True


#HTTP functions
@app.route('/signin')
def sign_in(email, password):
    if database_helper.verify_email(email) and verify_password(email, password):
        token = ''
        letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0']
        for i in xrange(36):
            token += choice(letters)
        database_helper.add_logged_in_user(email, token)
        return {'success':True,'message':'Successfully signed in.','data':token}
    else:
        return {'success':False,'message':'Wrong username or password.'}


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

@app.route('/signout/<token>')
def sign_out(token):
    if database_helper.check_if_logged_in(token):
        database_helper.remove_logged_in_user(token)
        return {'success':True,'message':'Successfully signed out'}
    else:
        return {'success':False,'message':'You are not signed in.'}


@app.route('/changepassword')
def change_password(token, old_password, new_password):
    #Call to appropirate function(s) in database_helper
    return ''

@app.route('/getuserdatabytoken')
def get_user_data_by_token(token):
    #Call to appropirate function(s) in database_helper
    return ''

@app.route('/getuserdatabyemail')
def get_user_data_by_email(token, email):
    #Call to appropirate function(s) in database_helper
    return ''

@app.route('/getusermessagesbytoken')
def get_user_messages_by_token(token):
    #Call to appropirate function(s) in database_helper
    return ''

@app.route('/getusermessagesbyemail')
def get_user_messages_by_email(token, email):
    #Call to appropirate function(s) in database_helper
    return ''

@app.route('/postmessage')
def post_message(token, message, email):
    #Call to appropirate function(s) in database_helper
    return ''

#Test functions
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

@app.teardown_appcontext
def teardown_app(exception):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


if __name__ == '__main__':
    app.run()