from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)

loc = 0

@app.route('/')
def index():
	return redirect('/home')

@app.route('/home', methods=["GET", 'POST'])
def home():
	if request.method == "POST":
		loc = request.form.getlist('loc[]')
		return redirect('/app')
	return render_template('home.html')

@app.route('/app')
def loc_app():
	return "YES"

app.run(debug=True)