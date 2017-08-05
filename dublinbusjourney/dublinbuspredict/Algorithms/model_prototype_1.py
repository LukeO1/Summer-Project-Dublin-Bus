# import pandas as pd
# import numpy as np
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.preprocessing import binarize
# pd.options.mode.chained_assignment = None
# from sklearn import datasets
# from sklearn.externals import joblib
#
# import datetime as datetime
# import pickle
# from dateutil import parser
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except:
    pass

import pandas as pd
pd.options.mode.chained_assignment = None
from sklearn.externals import joblib
from dateutil import parser



def model(bus_route, stopid, arrival_time, day, p_holiday, s_holiday):
    # 1 request the lon and lat from a query in sql based on the stop id.
    db = pymysql.connect(user='lucas', db='summerProdb', passwd='hello_world', host='csi6220-3-vm3.ucd.ie')
    cursor = db.cursor()
    cursor.execute('SELECT bus_stops.lat, bus_stops.lon '
                   'FROM bus_stops '
                   'WHERE bus_stops.stop_id = ' + str(stopid) + ';')
    rows = cursor.fetchall()
    cursor = db.cursor()
    cursor.execute('SELECT DISTINCT trip_id FROM bus_timetable WHERE bus_timetable.route_id = "' + str(bus_route) + '" AND bus_timetable.stop_id = "' + str(stopid) + '" AND bus_timetable.arrival_time >= "' + str(arrival_time)[11:] + '" ORDER BY bus_timetable.arrival_time ASC LIMIT 1;')
    rows2 = cursor.fetchall()
    cursor.execute('SELECT bus_timetable.arrival_time, bus_timetable.stop_sequence, bus_timetable.stop_id, bus_stops.long_name, bus_stops.name, bus_stops.normed_lat, bus_stops.normed_lon, bus_timetable.dist_nxt_stop, bus_timetable.accum_dist FROM bus_timetable, bus_stops WHERE bus_timetable.trip_id = "' + str(rows2[0][0]) + '" AND bus_timetable.stop_id = bus_stops.stop_id AND bus_stops.stop_id = "' + str(stopid) + '" ORDER BY bus_timetable.stop_sequence;')
    rows3 = cursor.fetchall()
    normed_lat = rows[0][0]
    normed_lon = rows[0][1]
    distance = rows3[0][7]

    # 2 convert your arrival time to an integer. Arrival time needs to be replaced with your time variable.
    arrival_time = parser.parse(arrival_time)
    new_arrival_time = (arrival_time.hour*3600) + (arrival_time.minute*60) + (arrival_time.second)
    new_arrival_time = new_arrival_time/86399

    # 3 convert your date of the week to business day vs Saturday and Sunday.
    weekday = False
    saturday = False
    sunday = False
    if day < 5:
        weekday = True
    elif day == 5:
        saturday = True
    elif day == 6:
        sunday = True

    # Create the row we want to match up against the model
    input_data = pd.DataFrame({'normed_lat': [normed_lat],'normed_lon': [normed_lon], 'Distance': [distance], 'weekday': [weekday],
                               'Saturday': [saturday], 'Sunday': [sunday], 'arrival_time': [new_arrival_time], 'school_holiday': [s_holiday],
                               'public_holiday': [p_holiday]})

    # 4 load in the model.
    with open("C:\\Users\\lucas\\Desktop\\trained_modelv8.pkl", "rb") as f:
        rtr = joblib.load(f)

    # 5 predict the delay based on the input.
    predict_duration = rtr.predict(input_data)
    return predict_duration

if __name__ == '__main__':
    bus_route = '17'
    stopid = '1304'
    arrival_time = '19/07/2017 17:33:45'
    day = 2
    s_holiday = True
    p_holiday = False
    print(model(bus_route, stopid, arrival_time, day, p_holiday, s_holiday))
