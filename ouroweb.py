from flask import Flask, render_template, request, redirect
import time

app = Flask(__name__)

# This should be replaced with a more secure way to store passwords
users = {'Ouroboros': 'Snakey'}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if username in users and users[username] == password:
        print(f"Welcome, {username} Telamōn! The collective conciousness of mankind is always stretching out to grasp the boundaries! Do be careful it doesn't rip!")
        time.sleep(3)
        return redirect('/games')
    else:
        return 'Invalid login credentials'

@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/pong')
def pong():
    return render_template('pong.html')

@app.route('/crowd')
def crowd():
    return render_template('crowd.html')

@app.route('/tower')
def tower():
    return render_template('tower.html')

if __name__ == '__main__':
    app.run(debug=True)