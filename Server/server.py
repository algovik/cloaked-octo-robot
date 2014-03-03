from flask import Flask
from flask import g
from flask import request
from random import choice
import database_helper
import hashlib
import json

app = Flask(__name__)
app.debug = True
#app.config['DEBUG'] = True


#HTTP functions
#Parameters: email, password
#Returns {"success":True/False, "message":Success- or errormessage, "data":token}
@app.route('/signin', methods=['POST'])
def sign_in():
    email = request.form.get('email')
    password = request.form.get('password')
    if database_helper.verify_email(email) and verify_password(email, password):
        token = ''
        letters = map(chr, range(97, 123) + range(65,91) + range(49,58))
        #letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0']
        for i in xrange(36):
            token += choice(letters)
        success_bool = database_helper.add_logged_in_user(email, token)
        if success_bool:
            return_data = {"success":True, "message":"User successfully signed in.", "data":token}
            #return token + ""
        else:
            return_data = {"success":False, "message":"User already signed in."}
    else:
        return_data = {"success":False, "message":"Wrong username or password."}
    return json.dumps(return_data)

#Parameter identifiers should be used when trying to retrieve a specific value.
#Parameters: email, password, firstname, familyname, gender, city, country
#Returns: {"success":True/False, "message":Success- or errormessage}
@app.route('/signup', methods=['POST'])
def sign_up():
    email = request.form.get('email')
    new_user=dict(email=email, password=hash_pwd(request.form.get('password')), firstname=request.form.get('firstname'), familyname=request.form.get('familyname'), gender=request.form.get('gender'), city=request.form.get('city'), country=request.form.get('country'))
    if database_helper.verify_email(email)==False:
        if validate_signup(new_user):
            if database_helper.insert_new_user(new_user)==True:
                return_data = {"success":True, "message":"Successfully created a new user."}
            else:
                return_data = {"success":False, "message":"An error occured when creating user."}
        else:
            return_data =  {"success":False, "message":"Formdata not complete."}
    else:
        return_data =  {"success":False, "message":"User already exists."}
    return json.dumps(return_data)

#Parameters: token
#Returns: {"success":True/False, "message":Success- or errormessage}
@app.route('/signout', methods=['GET'])
def sign_out():
    token = request.args.get('token')
    if not_none(token)==False:
        return_data = {"success":False, "message":"Invalid token."}
    if database_helper.check_if_logged_in(token):
        database_helper.remove_logged_in_user(token)
        return_data = {"success":True, "message":"Signed out."}
    else:
        return_data = {"success":False, "message":"Invalid token or already signed out."}
    return json.dumps(return_data)

#Parameters: token, old_password, new_password
#Returns: {"success":True/False, "message":Success- or errormessage}
@app.route('/changepassword', methods=['POST', 'GET'])
def change_password():
    token = request.args.get('token')
    if not_none(token)==False:
        return_data = {"success":False, "message":"Ah ah ah! That is not a token, THIS is a token: asA5hG9anfG7HlpzK1."}
    if database_helper.check_if_logged_in(token):
        email = database_helper.token_to_email(token)
        old_pw=request.form.get('old_password')
        new_pw=request.form.get('new_password')
        if not_none(old_pw)==False or not_none(new_pw)==False:
            return_data = {"success":False, "message":"Passwords can not be null."}
            return json.dumps(return_data)
        if old_pw==new_pw:
            return_data = {"success":False, "message":"New password must be different from old password."}
            return json.dumps(return_data)
        if verify_password(email,old_pw):
            database_helper.set_password(email, hash_pwd(new_pw))
            return_data = {"success":True, "message":"Password changed."}
        else:
            return_data = {"success":False, "message":"Wrong password."}
    else:
        return_data = {"success":False, "message":"You are not logged in."}
    return json.dumps(return_data)

#Parameters: token
#Returns: {"success":True/False, "message":Success- or errormessage, "data": {__userdata__} }
#THESE FUNCTIONS ARE COULD REUSE CODE MUCH BETTER!!
@app.route('/getuserdatabytoken', methods=['GET'])
def get_user_data_by_token():
    token = request.args.get('token')
    if not_none(token)==False:
        return_data = {"success":False, "message":"Invalid token."}
        return json.dumps(return_data)
    if database_helper.check_if_logged_in(token)==True:
        email = database_helper.token_to_email(token)
        userdata = get_user_data_by_email(email)
        if userdata["success"]==True:
            return_data = {"success":True, "message":"Returning userdata.", "data": userdata["data"]}
        else:
            return_data = {"success":False, "message":"User not found."}
    else:
        return_data = {"success":False, "message":"Invalid token or signed out."}
    return json.dumps(return_data)

#Parameters: token, email
#Returns: {"success":True/False, "message":Success- or errormessage, "data": {__userdata__} }
#THESE FUNCTIONS ARE COULD REUSE CODE MUCH BETTER!!
@app.route('/getuserdatabyemail', methods=['GET'])
def get_user_data_by_email_route():
<<<<<<< HEAD
    return get_user_data_by_email(request.form['token'],request.form['email'])

def get_user_data_by_email(token, email):
    if database_helper.check_if_logged_in(token):
        if verify_email(email):
            match = database_helper.get_user_data(email)
            return match[0]['email'] + "|" + match[0]['firstname'] + "|" + match[0]['familyname'] + "|" + match[0]['gender'] + "|" + match[0]['city'] + "|" + match[0]['country']
=======
    token = request.args.get('token')
    email = request.args.get('email')
    if not_none(token)==False or not_none(email)==False:
        return_data = {"success":False, "message":"Invalid querystring."}
        return json.dumps(return_data)
    if database_helper.check_if_logged_in(token)==True:
        userdata = get_user_data_by_email(email)
        if userdata["success"]==True:
            return_data = {"success":True, "message":"Returning userdata.", "data": userdata["data"]}
>>>>>>> 91daf3e32fdbcc25530021a225610a7781bd0b86
        else:
            return_data = {"success":False, "message":"User not found.", "data": userdata["data"]}
    else:
        return_data = {"success":False, "message":"Invalid token or signed out."}
    return json.dumps(return_data)

#Returns: {"success":True/False (, "data": {userdata}) }
def get_user_data_by_email(email):
    if database_helper.verify_email(email)==True:
        match = database_helper.get_user_data(email)[0]
        userdata = {"email":match['email'], "firstname":match['firstname'], "familyname":match['familyname'], "gender":match['gender'], "city":match['city'], "country":match['country']}
        return_data = {"success":True, "data":userdata}
        #return match[0]['email'] + "|" + match[0]['firstname'] + "|" + match[0]['familyname'] + "|" + match[0]['gender'] + "|" + match[0]['city'] + "|" + match[0]['country'] + ""
    else:
        return_data = {"success":False}
    return return_data

#Parameters: token
#Returns: {"success":True/False, "message":"success/error messages", "data":[{"sender":sender, "message":message},..]}
@app.route('/getusermessagesbytoken', methods=['GET'])
def get_user_messages_by_token():
    token = request.args.get('token')
    if not_none(token)==False or database_helper.check_if_logged_in(token)==False:
        return json.dumps({"success":False, "message":"Invalid token."})
    email = database_helper.token_to_email(token)
    return json.dumps(get_user_messages_by_email(token, email))

#Parameters: token, email
@app.route('/getusermessagesbyemail', methods=['GET'])
def get_user_messages_by_email_route():
    token = request.args.get('token')
    email = request.args.get('email')
    if not_none(token)==False or not_none(email)==False:
        return json.dumps({"success":False, "message":"Invalid token or email."})
    return json.dumps(get_user_messages_by_email(token, email))

def get_user_messages_by_email(token, email):
    if database_helper.check_if_logged_in(token):
        if database_helper.verify_email(email):
            matches = database_helper.get_user_messages(email)
            return {"success":True, "message":"Returning messages.", "data":matches}
            #result = stringify_messages(matches) used in lab2
            #return result
        else:
            return {"success":False, "message":"User not found."}
    else:
        return {"success":False, "message":"Must be logged in to retrieve messages."}


#Parameters: token, message, email
@app.route('/postmessage', methods=['POST'])
def post_message():
    token = request.form.get('token')
    message = request.form.get('message')
    email = request.form.get('email')
    if not_none(token)==False or not_none(email)==False:
        return json.dumps({"success":False, "message":"Invalid token or email."})
    if database_helper.check_if_logged_in(token):
        sender = database_helper.token_to_email(token)
        if not_none(message):
            if database_helper.verify_email(email):
                database_helper.insert_new_message(sender, message, email)
                return_data = {"success":True, "message":"Message has been sent."}
            else:
                return_data = {"success":False, "message":"No such recipient."}
        else:
            return_data = {"success":False, "message":"Message must not be empty."}
    else:
        return_data = {"success":False, "message":"Sender must be logged in."}
    return json.dumps(return_data)

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