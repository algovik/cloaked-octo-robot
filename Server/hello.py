#Hello World
from flask import Flask
from random import choice
import hashlib
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run()