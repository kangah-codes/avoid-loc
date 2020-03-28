from model import a
from flask import Flask, render_template, url_for, jsonify, request, redirect
from math import cos, asin, sqrt
import json

dist = 0

def distance(lat1, lon1, lat2, lon2):
	lat1, lat2 = float(lat1), float(lat2)
	lon1, lon2 = float(lon1), float(lon2)
	p = 0.017453292519943295
	a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
	return 12742 * asin(sqrt(a))

def closest(data, v):
	return min(data, key=lambda p: distance(v[0],v[1],p[1],p[2]))

# tempDataList = a.return_dict()
# v = [5.621913, -0.238955]
# print(closest(tempDataList, v))

app = Flask(__name__)


@app.route('/home')
def index():
	loc = {'lat':0.0,'lng':0.0}
	global dist
	data = {
		"places":a.return_place_dist(loc['lat'], loc['lng'], dist),
		"closest":closest(a.return_dict(), [loc['lat'], loc['lng']]),
	}
	data['dist'] = distance(data['closest'][1], data['closest'][2], loc['lat'], loc['lng'])
	return render_template('index.html', **data)

@app.route('/', methods=['GET','POST'])
def home():
	if request.method == "POST":
		loc = request.get_json()
		print(loc)
		return redirect(url_for('home'))
	return render_template('home.html')

@app.route('/get_loc', methods=['POST','GET'])
def get_loc():
	if request.method == 'POST':
		search = request.get_json()
		global loc
		loc = search
		return redirect('/')
	return redirect('/')

@app.route('/get_dist', methods=["GET"])
def get_dist():
	global dist
	dist = request.args.get('dist')
	return redirect('/')


app.run(debug=True)