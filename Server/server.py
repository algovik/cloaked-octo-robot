from flask import Flask
from random import choice
import database_helper
import hashlib

app = Flask(__name__)
app.debug = True
#app.config['DEBUG'] = True


#HTTP functions
@app.route('/signin')
def sign_in(email, password):
    try:
        if verify_password(email, password):
            token = ''
            letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0']
                for i in xrange(36):
                    token += choice(letters)

            add_logged_in_user(email, token) #Should we keep a log of logged in users in db?
            return {'success':True,'message':'Successfully signed in.','data':token}
        else:
            return {'success':False,'message':'Wrong username or password.'}
    except:
        return {'success':False,'message':'Wrong username or password.'}

#Useful to know about locals(): the dictionary does not neccessary contain the parameters in the expected order.
#Parameter identifiers should be used when trying to retrieve a specific value.
@app.route('/signup')
def sign_up(email, password, firstname, familyname, gender, city, country):
    if database_helper.userExists(email)==False:
        if validate_signup(locals()):
            database_helper.insertUser(locals())

    #Call to appropirate function(s) in database_helper
    return ''

@app.route('/signout')
def sign_out(token):
    #Call to appropriate function(s) in database_helper
    return ''


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

@app.route('/hash')
def hash(password):
    return ''


#Local functions
def verify_password(email, password):
    hash = hash_pwd(password)
    if hash == get_password(email):
        return True
    else:
        return False

def hash_pwd(password):
    m = hashlib.sha224()
    m.update(password)
    return m.hexdigest()

def validate_signup(formDictionary):
    for val in dictionary.values():
        if not_none(val)!=True:
            return False

    return True

def not_none(fieldName):
    valid=True
    if fieldName is "" or None:
        valid=False

    return valid

@app.teardown_appcontext
def teardown_app(exception):
    #Close after app context is teared down.


if __name__ == '__main__':
    app.run()