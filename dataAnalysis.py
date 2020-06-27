import datetime
import pandas as pd
import numpy as np
from datetime import timedelta
from math import radians, sin, cos, sqrt, asin

# Haversine Formula: Compute distance in km between two points
def haversine(point1_lat, point1_lon, point2_lat, point2_lon):
    R = 6372.8 # Radius of earth in km
    dLat = radians(point2_lat - point1_lat)
    dLng = radians(point2_lon - point1_lon)
    lat1 = radians(point1_lat)
    lat2 = radians(point2_lat)
    a = sin(dLat/2)**2 + cos(lat1)*cos(lat2)*sin(dLng/2)**2
    c = 2*asin(sqrt(a))
    return (R * c)

# Distance Travelled
def totalDist(col_lat, col_lon, date_index):
	n = len(col_lat)
	col_dist = np.zeros(n, dtype='float64')
	for i in range(n):
		if i not in date_index:
			col_dist[i] = float("{0:.2f}".format(haversine(col_lat[i-1],col_lon[i-1],col_lat[i],col_lon[i]) + col_dist[i-1]))
	return col_dist

# Before pass in to totalDist()
def totalDist_convertToNumpy(frame):
    date_index, date_index_last = getDateIndex(frame)
    result = totalDist(frame['lat'].to_numpy(), frame['lon'].to_numpy(), date_index)
    frame['dist'] = result.tolist()
    total_Dist = 0
    for n in date_index_last:
        total_Dist = total_Dist+result[n]
    return float("{0:.2f}".format(total_Dist))

# Date & Total Dist on respective Date
def build_distDF(frame):
	date, dist = [], []
	date_index, date_index_last = getDateIndex(frame)
	newFrame = frame.iloc[date_index_last]
	date = newFrame['date'].to_numpy()
	dist = newFrame['dist'].to_numpy()
	return date, dist

# Get all the Date
def getDate(frame):
	frame['tracker_time'] = pd.to_datetime(frame['tracker_time'], unit='s')
	frame.insert(3, "date", frame['tracker_time'].dt.strftime('%d-%m-%Y'))
	frame.insert(4, "time", frame['tracker_time'].dt.strftime('%I:%M:%S %p'))
	dates = frame.date.unique()
	return dates

# Get list of index of first occurence of the date
def getDateIndex(frame):
	date_index = []
	date_index_last = []
	dates = frame.date.unique()
	for d in dates:
	    idx = frame[frame.date==d].first_valid_index()
	    idx_last = frame[frame.date==d].last_valid_index()
	    date_index.append(idx)
	    date_index_last.append(idx_last)
	return date_index, date_index_last

# Analyse speed (max, avg)
def speed(frame):
	max_speed = frame.speed.max()
	avg_speed = frame.speed.mean()
	return "{0:.2f}".format(max_speed), "{0:.2f}".format(avg_speed)

# Return Date, Time and Speed JSON obj
def build_speedDF(frame):
	df = frame[['date','time', 'speed']]
	df = df.to_json(orient = "records")   # here chg to Json obj
	return df

# Compute & Analyse acceleration (min, max, avg)
def acceleration(tracker_time, speed, date_index):
    col_acc = np.zeros(len(tracker_time), dtype='float64')
    for n in range(len(tracker_time)):
        if n not in date_index:
            time_difference = tracker_time[n] - tracker_time[n-1]
            time_difference_in_sec = float("{0:.4f}".format(time_difference / np.timedelta64(1, 's')))
            col_acc[n] = float("{0:.4f}".format((((speed[n]-speed[n-1])/3.6) / time_difference_in_sec)))
    return col_acc

def acc_convertToNumpy(frame):
    date_index, date_index_last = getDateIndex(frame)
    result = acceleration(frame['tracker_time'].to_numpy(), frame['speed'].to_numpy(), date_index)
    frame['acceleration'] = result.tolist()
    min_acceleration = frame.acceleration.min()
    max_acceleration = frame.acceleration.max()
    avg_acceleration = frame.acceleration.mean()
    return "{0:.2f}".format(min_acceleration), "{0:.2f}".format(max_acceleration), "{0:.2f}".format(avg_acceleration)

# Return Date, Time and Acceleration JSON obj
def build_accelerationDF(frame):
	df = frame[['date','time', 'acceleration']]
	df = df.to_json(orient = "records")   # here chg to Json obj
	return df

# Return Date, Time and lat, lon JSON obj
def build_tripDF(frame):
	df = frame[['date', 'time', 'lat', 'lon']]
	df = df.to_json(orient = "records")   # here chg to Json obj
	return df

# Return Travelling Behaviour Classification
def tbClass(dist, r1, r2):
	if dist < r1:
		tbClass = "Rare"
	elif dist < r2:
		tbClass = "Average"
	else:
		tbClass = "Frequent"
	return tbClass

# Return avg of a list
def listAvg(myList):
	sum_list = 0
	for t in myList:
		sum_list = sum_list + t           
	avg = sum_list / len(myList)
	return "{0:.2f}".format(avg)

# Compute weight based on speed records 
def computeSpeedMark(frame):
    speedLimit = 90
    conditions = [ (frame['speed'] <= speedLimit),
                   (frame['speed'] - speedLimit) <= 25 ,
                   ((frame['speed'] - speedLimit) <= 40) & ((frame['speed'] - speedLimit) > 25)]
    choices = [0, 1.5, 3.0]
    frame['speedMark'] = np.select(conditions, choices, default=5.0)

# Compute weight based on acceleration records
def computeAccelerationMark(frame):  
    conditions = [ (frame['acceleration'] >= 0) & (frame['acceleration'] < 1.5),
                   (frame['acceleration'] >= 1.5) & (frame['acceleration'] < 3.5),
                   (frame['acceleration'] >= 3.5) & (frame['acceleration'] < 7.0),
                   (frame['acceleration'] >= 7.0),
                   (frame['acceleration'] < 0) & (frame['acceleration'] > -3.0),
                   (frame['acceleration'] <= -3.0) & (frame['acceleration'] > -5.5),
                   (frame['acceleration'] <= -5.5) & (frame['acceleration'] > -9.0),
                   (frame['acceleration'] <= -9.0)]
    choices = [0, 1.5, 3.0, 5.0, 0, 1.5, 3.0, 5.0]
    frame['accelerationMark'] = np.select(conditions, choices, default=0)

# Calculate Total Weight = speedMark + accelerationMark
def computeTotalWeight(frame):
	frame['drivingMark'] = frame.speedMark + frame.accelerationMark

# Based on Total Weight, Assign Class
def computeDrivingClass(frame):
    conditions = [ (frame["drivingMark"] < 1.5) ,
                   (frame["drivingMark"] >= 1.5) & (frame["drivingMark"] < 6.0),
                   (frame["drivingMark"] >= 6.0)]
    choices = ['Safe', 'Aggressive', 'Dangerous']
    frame['drivingClass'] = np.select(conditions, choices, default='Safe')

# Driving Behaviour Class for each DAY
def computeDBperDay(dates, frame):
    db_df = []
    for date in dates:
        temp = frame[frame['date'] == date]
        drivingMark_Total = temp['drivingMark'].sum()
        drivingMark_Avg = drivingMark_Total / temp.shape[0]
        if drivingMark_Avg < 1.5:
            drivingClass = 'Safe'
        elif drivingMark_Avg < 6.0:
            drivingClass = 'Aggressive'
        else:
            drivingClass = 'Dangerous'
        db_df.append([date, "{0:.4f}".format(drivingMark_Avg), drivingClass])
    return db_df

# Driving Behaviour Class for OVERALL
def computeOverallDBClass(frame):
    drivingMark_Total = frame['drivingMark'].sum()
    drivingMark_Avg = drivingMark_Total / frame.shape[0]
    if drivingMark_Avg < 1.0:
        drivingClass = 'Safe'
    elif drivingMark_Avg < 6.0:
        drivingClass = 'Aggressive'
    else:
        drivingClass = 'Dangerous'  
    return "{0:.4f}".format(drivingMark_Avg), drivingClass

# Compute Frequency for Categorical Variable List
def CountFrequency(my_list):   
    freq = {} 
    for item in my_list: 
        if (item in freq): 
            freq[item] += 1
        else: 
            freq[item] = 1
    return freq 