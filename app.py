from flask import Flask, render_template, url_for, request, jsonify, session
from flask_pymongo import PyMongo
from pymongo import MongoClient
from dataAnalysis import *
from collections import OrderedDict
import numpy as np
import pandas as pd
import os
import psycopg2

app = Flask(__name__)
app.config['TESTING'] = True
app.config['DEBUG'] = True
app.config['ENV'] = 'development'
app.config['SECRET_KEY'] = b'_5#y2L"F4Q8z\n\xec]/'
app.config['DEBUG'] = True

'''
Please insert your Google Map API Key & Mongo_URI
'''
Google_Map_API_key = ""
mongo_uri = ""
app.config["MONGO_URI"] = ""

mongo = PyMongo(app)

client = MongoClient(mongo_uri)
db = client.myFYP

# Clear cache
@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/customer/login')
def customerlogin():
	allCollections = db.collection_names()
	return render_template('loginCustID.html', allCollections=allCollections)

@app.route('/customer/getID', methods=['GET', 'POST'])
def getID():
	if request.method == 'POST':
		a = request.get_json()
		session['customerID'] = str(a)
	customerID = session.get('customerID')
	return jsonify(status="success", customerID=customerID)
	
@app.route('/customer')
@app.route('/customer/home')
def customerHome():
	return render_template('customerHome.html')

@app.route('/customer/profile', methods=['GET', 'POST'])
def customerProfile():
	# Get the user login ID
	customerID = session.get('customerID')
	# Retrieve the data from mongoDB
	collection = db[customerID]
	cursor = collection.find({})
	# Put into a dataframe & sort according to tracker_time in ascending
	df =  pd.DataFrame(list(cursor))
	df = df.sort_values(by=['tracker_time']).reset_index(drop=True)
	# Get the Customer ID
	cust_id = customerID
	# Compute Date and Time & Get the unique Date
	date_list = getDate(df)
	# Compute Total Distance & Prepare data for Distance Graph
	## total_dist = totalDist(df)
	total_dist = totalDist_convertToNumpy(df)
	df.to_csv(r'C:\Users\GL63\Desktop\check2.csv')
	date, dist = build_distDF(df)
	# Analyse on Speed & Prepare data for Speed Graph
	max_speed, avg_speed = speed(df)
	speedGraph = build_speedDF(df)
	# Compute & Analyse Acceleration & Prepare data for Acceleration Graph
	## min_acceleration, max_acceleration, avg_acceleration = acceleration(df)
	min_acceleration, max_acceleration, avg_acceleration = acc_convertToNumpy(df)
	accelerationGraph = build_accelerationDF(df)
	return render_template('customerProfile.html', cust_id=cust_id, date_list=date_list, \
							total_dist=total_dist, date=date, dist=dist,  \
							max_speed=max_speed, avg_speed=avg_speed, speedGraph=speedGraph,\
							min_acceleration=min_acceleration, max_acceleration=max_acceleration, avg_acceleration=avg_acceleration, \
							accelerationGraph=accelerationGraph)

@app.route('/customer/trip')
def customerTrip():
	# Get the user login ID
	customerID = session.get('customerID')
	# Retrieve the data from mongoDB
	collection = db[customerID]
	cursor = collection.find({})
	# Put into a dataframe & sort according to tracker_time in ascending
	df =  pd.DataFrame(list(cursor))
	df = df.sort_values(by=['tracker_time']).reset_index(drop=True)
	# Get the Date
	date_list = getDate(df)
	# Prepare data for plotting map
	trip = build_tripDF(df)
	return render_template('customerTrip.html', date_list=date_list, trip=trip, Google_Map_API_key=Google_Map_API_key)

@app.route('/customer/analytic')
def customerAnalytic():
	# Get the user login ID
	customerID = session.get('customerID')
	# Retrieve the data from mongoDB
	collection = db[customerID]
	cursor = collection.find({})
	# Put into a dataframe & sort according to tracker_time in ascending
	df = pd.DataFrame(list(cursor))
	df = df.sort_values(by=['tracker_time']).reset_index(drop=True)
	##### Travelling Behavior #####
	# Compute Date and Time
	date_list = getDate(df)
	# Compute Total Distance
	##total_dist = totalDist(df)
	total_dist = totalDist_convertToNumpy(df)
	# Compute Total Distance for all the customers
	totalDist_list = []
	allCollections = db.collection_names()
	for fname in allCollections:
		collection2 = db[fname]
		cursor2 = collection2.find({})
		df2 = pd.DataFrame(list(cursor2))
		df2 = df2.sort_values(by=['tracker_time']).reset_index(drop=True)
		getDate(df2)   # date2 = 
		##totalDist_list.append(totalDist(df2))
		totalDist_list.append(totalDist_convertToNumpy(df2))
	minTotalDist = min(totalDist_list)
	maxTotalDist = max(totalDist_list)
	# Calculate the separator for the class
	r1 = float("{0:.2f}".format((maxTotalDist-minTotalDist)*0.3333 + minTotalDist))
	r2 = float("{0:.2f}".format((maxTotalDist-minTotalDist)*0.6666 + minTotalDist))
	tb = tbClass(total_dist, r1, r2)
	##### Driving Behavior #####
	# date, dist = build_distDF(df)
	max_speed, avg_speed = speed(df)
	##min_acceleration, max_acceleration, avg_acceleration = acceleration(df)
	min_acceleration, max_acceleration, avg_acceleration = acc_convertToNumpy(df)
	computeSpeedMark(df)
	computeAccelerationMark(df)
	computeTotalWeight(df)
	computeDrivingClass(df)
	drivingMark, drivingClass = computeOverallDBClass(df)
	DBperDay = computeDBperDay(date_list, df)
	return render_template('customerAnalytic.html', total_dist=total_dist, \
							maxTotalDist=maxTotalDist, minTotalDist=minTotalDist,\
							r1=r1, r2=r2, tb=tb, \
							max_speed=max_speed, avg_speed=avg_speed, min_acceleration=min_acceleration, \
							max_acceleration=max_acceleration, avg_acceleration=avg_acceleration, \
							drivingMark=drivingMark, drivingClass=drivingClass, DBperDay=DBperDay)

@app.route('/manager')
@app.route('/manager/home')
def managerHome():
	return render_template('managerHome.html')

@app.route('/manager/overview')
def managerOverview():
	# Total No. of Customer
	allCollections = db.collection_names()
	custNo = len(allCollections)
	# Total Dist Travelled Analysis
	# Create new list to store the result of all customer
	totalDist_list = []
	avgSpeed_list = []
	speed_list = []
	minAcceleration_list = []
	maxAcceleration_list = []
	avgAcceleration_list = []
	for fname in allCollections:
		# Retrieve the data from mongoDB
		collection = db[fname]
		cursor = collection.find({})
		# Put into a dataframe & sort according to tracker_time in ascending
		df = pd.DataFrame(list(cursor))
		df = df.sort_values(by=['tracker_time']).reset_index(drop=True)
		date = getDate(df)
		# Total Dist Travelled
		##totalDist_list.append(totalDist(df))
		totalDist_list.append(totalDist_convertToNumpy(df))
		# Speed
		speed_list.extend(df.speed.tolist())
		avgSpeed_list.append("{0:.2f}".format(df.speed.mean()))
		# Acceleration
		##min_acceleration, max_acceleration, avg_acceleration = acceleration(df)
		min_acceleration, max_acceleration, avg_acceleration = acc_convertToNumpy(df)
		minAcceleration_list.append(min_acceleration)
		maxAcceleration_list.append(max_acceleration)
		avgAcceleration_list.append(float(avg_acceleration))
	# Total Dist Variable
	minTotalDist = min(totalDist_list)
	maxTotalDist = max(totalDist_list)
	avgTotalDist = listAvg(totalDist_list)
	# Speed Variable
	maxSpeed = max(speed_list)
	# Acceleration Variable
	minAcceleration = min(minAcceleration_list)
	maxAcceleration = max(maxAcceleration_list)
	avgAcceleration = listAvg(avgAcceleration_list)
	return render_template('managerOverview.html', custNo=custNo, \
							minTotalDist=minTotalDist, maxTotalDist=maxTotalDist, avgTotalDist=avgTotalDist, \
							id_dist = zip(allCollections, totalDist_list), \
							maxSpeed=maxSpeed, id_avgSpeed = zip(allCollections, avgSpeed_list), \
							minAcceleration=minAcceleration, maxAcceleration=maxAcceleration, avgAcceleration=avgAcceleration,\
							id_avgAcceleration = zip(allCollections, avgAcceleration_list))

@app.route('/manager/analytic')
def managerAnalytic():
	# Total No. of Customer
	allCollections = db.collection_names()
	# Total Dist Travelled Analysis
	# Create new list to store the result of all customer
	totalDist_list = []
	tb_list = []
	dmark_list = []
	db_list = []
	for fname in allCollections:
		# Retrieve the data from mongoDB
		collection = db[fname]
		cursor = collection.find({})
		# Put into a dataframe & sort according to tracker_time in ascending
		df = pd.DataFrame(list(cursor))
		df = df.sort_values(by=['tracker_time']).reset_index(drop=True)
		date = getDate(df)
		# Total Dist Travelled
		##totalDist_list.append(totalDist(df))
		totalDist_list.append(totalDist_convertToNumpy(df))
		# Acceleration
		##min_acceleration, max_acceleration, avg_acceleration = acceleration(df)
		min_acceleration, max_acceleration, avg_acceleration = acc_convertToNumpy(df)
		# Evaluation of speed and acceleration
		computeSpeedMark(df)
		computeAccelerationMark(df)
		computeTotalWeight(df)
		computeDrivingClass(df)
		drivingMark, drivingClass = computeOverallDBClass(df)
		dmark_list.append(drivingMark)
		db_list.append(drivingClass)
		# Traveliing Behaviour
	minTotalDist = min(totalDist_list)
	maxTotalDist = max(totalDist_list)
	r1 = float("{0:.2f}".format((maxTotalDist-minTotalDist)*0.3333 + minTotalDist))
	r2 = float("{0:.2f}".format((maxTotalDist-minTotalDist)*0.6666 + minTotalDist))
	for dist in totalDist_list:
		tb_list.append(tbClass(dist, r1, r2))
	
	# tbFreq = CountFrequency(tb_list)
	tbFreq = {}
	tbkeyorder = ['Rare', 'Average', 'Frequent']
	for i in range(len(tbkeyorder)):
		count = tb_list.count(tbkeyorder[i])
		tbFreq.update({tbkeyorder[i]: count})
	# tbFreq = OrderedDict(sorted(tbFreq.items(), key=lambda i:tbkeyorder.index(i[0])))
	
	dbFreq = {}
	dbkeyorder = ['Safe', 'Aggressive', 'Dangerous']
	for i in range(len(dbkeyorder)):
		count = db_list.count(dbkeyorder[i])
		dbFreq.update({dbkeyorder[i]: count})
	
	return render_template('managerAnalytic.html', id_dist_tb=zip(allCollections, totalDist_list, tb_list),\
							tbFreq=tbFreq, id_mark_db=zip(allCollections, dmark_list, db_list),
							dbFreq=dbFreq)

if __name__ == '__main__':
	app.run(debug=True)