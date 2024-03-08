from flask import Flask, render_template, request, redirect, jsonify, send_from_directory
import time
import os

app = Flask(__name__)

# This should be replaced with a more secure way to store passwords
users = {'Ouroboros': 'Snakey'}

@app.route('/ouroboros/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

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

@app.route('/api/images', methods=['GET'])
def get_image_filenames():
    image_dir = 'C:/Users/jnc4m/directories/ouroboros/static/zerepic6m'
    try:
        filenames = os.listdir(image_dir)
        return jsonify(filenames)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/message')
def message():
    return render_template('message.html')

@app.route('/tower')
def tower():
    return render_template('tower.html')

if __name__ == '__main__':
    app.run(debug=True)
