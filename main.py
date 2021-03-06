from model import Zone
from flask import Flask, render_template, url_for, jsonify, request, redirect, session
from math import cos, asin, sqrt
import json
from ip2geotools.databases.noncommercial import DbIpCity
import requests

dist = 0
a = Zone()

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
app.secret_key = "LMAO"
loc =  [0.0,0.0]
lic = None

@app.route('/')
def index():
	return redirect('/home')

@app.route('/home', methods=["GET", 'POST'])
def home():
	if request.method == "POST":
		global loc
		loc = request.form.getlist('loc[]')
		lic = session['loc'] = loc
		return redirect('/app')
	return render_template('home.html')

@app.route('/app')
def loc_app():
	try:
		global loc
		global lic
		data = {
			"location":lic,
			"area":closest(a.return_dict(), loc),
			"all":a.return_dict()
		}
		data['dist'] = distance(data['area'][1],data['area'][2], loc[0], loc[1])
		data['places'] = a.return_place_dist(loc[0], loc[1], data['dist'])

		return render_template('index.html', **data)
	except:
		ip = request.remote_addr
		geo_request_url = 'https://get.geojs.io/v1/ip/geo/' + ip + '.json'
		geo_request = requests.get(geo_request_url)
		geo_data = geo_request.json()

		data = {
			"location":[geo_data['latitude'], geo_data['longitude']],
			"area":closest(a.return_dict(), loc),
			"all":a.return_dict()
		}
		data['dist'] = distance(data['area'][1],data['area'][2], loc[0], loc[1])
		data['places'] = a.return_place_dist(loc[0], loc[1], data['dist'])

if __name__ == "__main__":
	app.run(debug=True)