import sqlite3
import csv
from math import cos, asin, sqrt,acos,sin

def distance(lat1, lon1, lat2, lon2):
	lat1, lat2 = float(lat1), float(lat2)
	lon1, lon2 = float(lon1), float(lon2)
	p = 0.017453292519943295
	a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
	return 12742 * asin(sqrt(a))

class Zone():
	def __init__(self):
		self.name = "zones.db"

		self.connection = sqlite3.connect(self.name)
		self.cursor = self.connection.cursor()

		try:
			self.cursor.execute("""
				CREATE TABLE AREA (NAME TEXT NOT NULL, LAT FLOAT NOT NULL, LON FLOAT NOT NULL)
			""")
		except sqlite3.OperationalError as e:
			print(e)
			pass
		else:
			self.connection.commit()
		finally:
			if self.connection:
				self.connection.close()

	def add_place(self, name, lat, lon):
		try:
			self.connection = sqlite3.connect(self.name)
			self.cursor = self.connection.cursor()

			self.cursor.execute("""
				INSERT INTO AREA (NAME, LAT, LON) VALUES (?, ?, ?)
			""", (name, float(lat), float(lon),))

		except sqlite3.OperationalError as e:
			return e

		else:
			self.connection.commit()
		finally:
			if self.connection:
				self.connection.close()

	def return_dict(self):
		try:
			self.connection = sqlite3.connect(self.name)
			self.cursor = self.connection.cursor()

			self.cursor.execute("SELECT * FROM AREA")

		except sqlite3.OperationalError as e:
			return e

		else:
			return self.cursor.fetchall()

		finally:
			if self.connection:
				self.connection.close()

	def return_place_dist(self, lat, lon):
		try:
			self.connection = sqlite3.connect(self.name)
			self.cursor = self.connection.cursor()
			self.connection.create_function("distance", 4, distance)
			self.cursor.execute(f"""
				SELECT * FROM AREA WHERE distance(LAT, LON, ?, ?) >= 0;
			""", (float(lat), float(lon),))

		except sqlite3.OperationalError as e:
			return e

		else:
			return min(self.cursor.fetchall(), key=lambda p:  distance(lat, lon,p[1],p[2]))

		finally:
			if self.connection:
				self.connection.close()

a = Zone()

#print(a.return_dict())
print(a.return_place_dist(5.621913, -0.238955))
# reader = csv.reader(open("places.csv"), delimiter=";")

# for row in reader:
# 	lat_lon = row[1].split(',')
# 	place = row[0]
# 	print(lat_lon)

# 	a.add_place(place, lat_lon[0], lat_lon[1])