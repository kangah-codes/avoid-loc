from model import a
from flask import Flask, render_template, url_for
# from math import cos, asin, sqrt

# def distance(lat1, lon1, lat2, lon2):
# 	lat1, lat2 = float(lat1), float(lat2)
# 	lon1, lon2 = float(lon1), float(lon2)
# 	p = 0.017453292519943295
# 	a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
# 	return 12742 * asin(sqrt(a))

# def closest(data, v):
# 	return min(data, key=lambda p: distance(v[0],v[1],p[1],p[2]))

# tempDataList = a.return_dict()
# v = [5.621913, -0.238955]
# print(closest(tempDataList, v))