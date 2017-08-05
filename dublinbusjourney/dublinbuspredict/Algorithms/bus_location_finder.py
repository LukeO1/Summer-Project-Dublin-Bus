import requests
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except:
    pass


# Retrieve stop list in order from MySQL database:
def get_stop_list(route, direction):
    """Pass in route and direction, and the function will return the list of stops in that route, in order, from start to end stop."""
    # Open connection to database and execute query
    if direction == 'inbound':
        direction = 1
    elif direction == 'outbound':
        direction = 0
    db = pymysql.connect(user='lucas', db='summerProdb', passwd='hello_world', host='csi6220-3-vm3.ucd.ie')
    cursor = db.cursor()
    query = "SELECT bus_timetable.trip_id " \
            "FROM bus_timetable " \
            "WHERE direction =" + str(direction) + " and route_id ='" + str(route) + \
            "' ORDER BY stop_sequence limit 1;"
    print("queryyyy", query)
    cursor.execute(query)
    rows = cursor.fetchall()
    query = "SELECT bus_timetable.stop_id " \
            "FROM bus_timetable " \
            "WHERE trip_id ='" + str(rows[0][0]) + "' and route_id ='" + str(route) + \
            "' ORDER BY stop_sequence;"
    print("queryyyy", query)
    cursor.execute(query)
    rows2 = cursor.fetchall()
    print(rows2)
    # Close connection
    db.close()

    # Create and populate a list with all the bus stop ids retrieved from the database
    stop_list = []
    for i in rows2:
        stop_list.append(i[0])
    return stop_list


# Retrieve real time data for the next 3 inbound buses
def get_due_time(stop_id, route_id):
    """Receives stop id of SRC stop and the route id and returns the first 3 inbound buses at that stop for that route in a list."""
    # REquest data from Dublin Bus API
    base_url = 'https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=' + str(stop_id) + '&routeid=' + str(route_id) + '&maxresults&operator&format=json'
    response = requests.get(base_url)
    results = response.json()

    # Create a counter to filter only the next 3 inbound buses
    counter = 0

    # Empty list to put the buses in
    first_3_buses = []

    # Populate the list with the next 3 inbound buses
    for i in results['results']:
        if counter == 3:
            # Stop populating list
            break
        # Append bus to list
        first_3_buses.append({'duetime':i['duetime'], 'scheduledarrivaldatetime':i['scheduledarrivaldatetime'], 'arrivaldatetime':i['arrivaldatetime'],
                              'direction':i['direction'], 'origin':i['origin'], 'destination':i['destination']})
        counter += 1

    # Returns the next 3 buses in a list
    # print(first_3_buses)
    return first_3_buses


# Receives the bus list and finds the delay for each of them
def get_delay(list_of_buses):
    #print('Inside delay:', list_of_buses)
    """Receives the 3 buses arriving at the source, and appends their respective delay to each of their dictionaries"""
    # Iterates over all the buses in the list and gets the delay for each bus
    for i in list_of_buses:
        # Calculate the delay, by first spliting the string (HH:MM:SS), into hours, minutes and seconds, then converting it to
        # ints and calculating the seconds. Does it for both the scheduled arrival time and the actual predicted arrival time
        scheduled_hours, scheduled_minutes, scheduled_seconds = i['scheduledarrivaldatetime'][11:].split(':')
        scheduled_arrival_seconds = int(scheduled_hours) * 3600 + int(scheduled_minutes) * 60 + int(scheduled_seconds)
        actual_hours, actual_minutes, actual_seconds = i['arrivaldatetime'][11:].split(':')
        actual_arrival_seconds = int(actual_hours) * 3600 + int(actual_minutes) * 60 + int(actual_seconds)

        # Calculate the delay
        delay = actual_arrival_seconds - scheduled_arrival_seconds

        # Left these prints here just in case we want to visually compare the times
        # print('Scheduled arrival time:', i['scheduledarrivaldatetime'], 'Actual arrival time:', i['arrivaldatetime'])
        # print(delay)

        # Append the delay to the dictionary that represents each bus, with key 'delay'
        i['delay'] = delay

# Receives the 3 bus list, and filters it to just the first one. Useful various functions.
def filter_buses(list_of_buses):
    """Receives bus list and returns only the first bus on that list."""
    for bus in list_of_buses:
        return bus


# This function finds where a bus is. It uses a binary search algorithm to allow for more efficiency (less API calls). It needs a low bound,
# a high bound and a pointer that moves between them.
def get_closest_bus_stop(due_time, stop_src, stop_ids, route_id):
    """Receives the due time of that bus at the stop, the stop id of source stop, the list of stop of ids on the route and the route id. It retuns an integer (called pointer)
    that is the index position in the stop_ids list. This tells us what stop the bus is at."""

    # Get index of where the SRC stop is in the tupple to serve as the high-bound, and store that position in original. Also, store the original due time, as it will be needed
    high_bound = 0
    original = 0
    original_due_time = due_time
    for i in range(0, len(stop_ids)):
        if str(stop_ids[i]) == stop_src:
            high_bound = i
            original = i
            break

    # Innitialize pointer to be halfway between the lowbound (set to 0 index) and the highbound (the SRC stop).
    pointer = original//4
    low_bound = 0

    # Optimally we want to find the stop where our bus is just 1 minute away, for better accuracy. But sometimes that is not possible, so we will
    # need to look for a bus further away. This variable, arrival_within_minutes, starts with 1 minutes, and will be increased as necessary.
    arrival_within_minutes = 1

    # Search until we find where the bus is
    while True:
        last_due_time = 0
        # Search while our due time is not 'Due' or within the specified minutes
        while due_time != 'Due' or int(due_time) > arrival_within_minutes:
            # Once more, get the buses for the stop we are currently looking at
            first_3_buses = get_due_time(str(stop_ids[pointer]), route_id)

            # Get just the first bus, since we already have the 3 buses from our SRC stop (this one is just looking for where one of those 3 buses is)
            possible_stop = filter_buses(first_3_buses)
            # Store the new due time, from the bus stop our binary algorithm selected
            new_due_time_due = possible_stop['duetime']

            # If the new due_time is the same as the last_due_time it means the algorithm got stuck without finding a better value, and we need to break, and change our
            # arrival_within_minutes for a longer time
            if new_due_time_due == last_due_time:
                break

            # If we found a 'Due' or within the arrival_within_minutes, return that index. That is the index of the stop where our bus is at/close to.
            if possible_stop['duetime'] == 'Due' or int(possible_stop['duetime']) <= arrival_within_minutes:
                # ('Found the bus with', new_due_time_due, 'minutes due time.')
                # This for loop is to check if the previous bus stop(s) have the same due time, and find a closer more accurae stop
                # print('Original pointer:', pointer)
                for i in range(pointer - 1, 0, -1):
                    if new_due_time_due == (filter_buses(get_due_time(str(stop_ids[i]), route_id))['duetime']):
                        pointer = i
                        # print('New pointer:', pointer)
                    else:
                        break
                # Return the pointer, the index of the stop
                return pointer
            else:
                # If the due time at the possible stop is less than the one at SRC, we're on the right path, and need to look for a stop farther from the SRC
                if int(possible_stop['duetime']) < int(due_time):
                    # Store the new, better due time
                    due_time = possible_stop['duetime']
                    # Change the highbound to the pointer and reduce our pointer again to halfway between lowbound and highbound
                    high_bound = pointer
                    pointer -= ((high_bound - low_bound)//4)
                else:
                    # If the due time at the possible stop is bigger than the one at SRC, we've gone too far, and need to look for a stop closer to the SRC
                    # The lowbound becomes the pointer and we move the pointer, again, to halfway between the lowbound and the highbound
                    low_bound = pointer
                    pointer += ((high_bound - low_bound)//4)
            # If we found a better (shortter) due time, we store this one for the next iteration and keep looking for an even better one
            last_due_time = new_due_time_due

        # If the algorithm comes to this part, it means we didn't find a stop where our bus was due wihin 1 (or more) minutes. So we need to increase the
        # arrival_within minutes to keep searching.
        arrival_within_minutes += 1

        # Reset our lowbound, highbound and pointer to restart the search
        low_bound = 0
        high_bound = original
        pointer = original // 4

        # If we start looking for a stop, previous to the SRC, were our bus has MORE duetime, we've gonne too far. Possibly, there are two buses running very close to one another,
        # and they may be due to our SRC stop at the same time (seen before too many times with the 17). In this case, we need to increase the original bound to take the stop where
        # we found the previous bus.
        if arrival_within_minutes > int(original_due_time):
            high_bound += 1
            return high_bound

    # Just a token return
    return 0

def get_closest_stop_test(due_time, stop_src, stop_ids, route_id):
    pointer = stop_ids.index(int(stop_src))
    # print(stop_ids[pointer])
    arrival_within_minutes = 1
    # print('inside test')
    while True:
        while pointer >= 0:
            # Once more, get the buses for the stop we are currently looking at
            first_3_buses = get_due_time(str(stop_ids[pointer]), route_id)
            counter = 0
            while first_3_buses == [] and counter < 5:
                first_3_buses = get_due_time(str(stop_ids[pointer]), route_id)
                counter += 1
                # print('It came up empty!')
                # continue

            # Get just the first bus, since we already have the 3 buses from our SRC stop (this one is just looking for where one of those 3 buses is)
            possible_stop = filter_buses(first_3_buses)
            # if stop_ids[pointer] == 320 or stop_ids[pointer] == 349:
            #     pointer -= 1
            #     continue
            print(possible_stop['duetime'], str(stop_ids[pointer]))
            # duetime = possible_stop['duetime']
            if possible_stop['duetime'] == 'Due' or int(possible_stop['duetime']) <= arrival_within_minutes:
                print('Test, found with:', possible_stop['duetime'], '-', stop_ids[pointer])
                better_stop = []
                for i in range(pointer - 1, 0, -1):
                    counter = 0
                    while better_stop == [] and counter < 5:
                        try:
                            better_stop = (filter_buses(get_due_time(str(stop_ids[i]), route_id))['duetime'])
                        except:
                            pass
                        counter += 1
                    if due_time == better_stop or better_stop == 'Due':
                        pointer = i
                        print('New pointer:', pointer)
                    else:
                        break
                # Return the pointer, the index of the stop
                return pointer
            pointer -= 1
        arrival_within_minutes += 1
        pointer = stop_ids.index(int(stop_src))



# This function computes the stops between where the buses were found and the source stop
def get_all_stops(bus_position, stop_ids, at_stop_id):
    """Receives the list that says where each bus is, the list of stops in that route in that direction, and the source stop"""
    # Create empty list to hold the stops between where each bus is currently and the source stop
    list_of_stops = []
    print('List:', bus_position)
    print('blah', at_stop_id)
    # Populate list
    for i in bus_position:
        # Create list for each bus (bus 1, bus 2, bus 3)
        bus = []
        found = False
        for j in stop_ids:
            # Search for the stop where the bus  is at and change found to true
            if i == j:
                found = True
            # If found, then add the stop
            if found:
                bus.append(j)
            # If we reach the source stop, break, don't add anymore
            if j == int(at_stop_id):
                break
        # Append that bus to the list_of_stops list
        list_of_stops.append(bus)
        if str(i) == str(at_stop_id):
            break
    if len(list_of_stops) == 1:
        pass
    elif len(list_of_stops) == 2:
        list_of_stops = [list_of_stops[i] for i in [0,1]]
    else:
        list_of_stops = [list_of_stops[i] for i in [0,1,2]]

    # Return every stop between where the buses are the source stop
    print('-->', list_of_stops, stop_ids)
    return list_of_stops


# Creates the final dictionary to go into the data model
def info_for_model(stop_list, stops, route):
    """Takes in the stop list from the stop where each bus is at to the source stop, the list of stops for that route and direction
    , and the route id. Returns the final dictionary that goes in the model {arrival_hour, stop_id, previous_stop, delay}"""


    # Need to know where the bus number 1 and 2 are
    # This if and elif were put in due to an error where the bus list for bus 1 would come up empty, but not sure if necessary
    print('Errorrssss!', stops)
    print('Length!', len(stops))
    if len(stops) == 1:
        bus_1 = stops[0][0]
    elif len(stops) >= 2:
        bus_1 = stops[0][0]
        bus_2 = stops[1][0]

    # Create empty lists to hold the information for each bus
    stops_bus_1 = []
    stops_bus_2 = []
    stops_bus_3 = []
    joined = 0
    # Set bus_number to 3, we will start filling the buses from the end, the last bus first

    if len(stops) == 3:
        # Set bus_number to 3, we will start filling the buses from the end, the last bus first
        bus_number = 3

        # Populate our lists
        for i in stops[len(stops) - 1]:
            print('Bus 1:', bus_1, 'I:', i)
            # Get the times for the buses at the given stop
            first_3_buses = get_due_time(str(i), route)
            while first_3_buses == []:
                print('Error with:', str(1))
                first_3_buses = get_due_time(str(i), route)
                # continue
            # Add in the delay
            get_delay(first_3_buses)

            # Have to check if the bus it at the first stop, in which case, we just say 'Starting stop' for previous_stop
            if i == stop_list[0]:
                    previous_stop = 'Starting stop'
            # Else, we get the previous stop
            else:
                previous_stop = stop_list[stop_list.index(i) - 1]

            # If the bus is the last one, we will only append to bus_number_3
            if bus_number == 3:
                # If we reach the stop where bus number 2 is, we must append this stop to both bus_number_3 and bus_number2 and
                # decrease the bus_number counter
                if i == bus_2:
                    bus_number -= 1
                    stops_bus_3.append({'stopid':i, 'delay':first_3_buses[1]['delay'], 'arrival_hour':first_3_buses[1]['arrivaldatetime'][11:13], 'datetime':first_3_buses[1]['arrivaldatetime'], 'previous_stop':previous_stop})
                    stops_bus_2.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})
                else:
                    stops_bus_3.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})

            # Now, we keep adding bus 2 and bus 3
            elif bus_number == 2:
                # If we reach the stop where bus number 1 is, we must append this stop to both bus_number_3 and bus_number2 and
                # bus_number1 and decrease the bus_number counter
                print(first_3_buses)
                if i == bus_1:
                    bus_number -= 1
                    print('BUs 1:', stops_bus_1)
                    stops_bus_3.append({'stopid':i, 'delay':first_3_buses[2]['delay'], 'arrival_hour':first_3_buses[2]['arrivaldatetime'][11:13], 'datetime':first_3_buses[2]['arrivaldatetime'], 'previous_stop':previous_stop})
                    stops_bus_2.append({'stopid':i, 'delay':first_3_buses[1]['delay'], 'arrival_hour':first_3_buses[1]['arrivaldatetime'][11:13], 'datetime':first_3_buses[1]['arrivaldatetime'], 'previous_stop':previous_stop})
                    stops_bus_1.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})
                    print('BUs 1:', stops_bus_1)
                else:
                    stops_bus_3.append({'stopid':i, 'delay':first_3_buses[1]['delay'], 'arrival_hour':first_3_buses[1]['arrivaldatetime'][11:13], 'datetime':first_3_buses[1]['arrivaldatetime'], 'previous_stop':previous_stop})
                    stops_bus_2.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})

            # Here, we are now appending all the buses, until we finally reach the source stop
            elif bus_number == 1:
                stops_bus_3.append({'stopid':i, 'delay':first_3_buses[2]['delay'], 'arrival_hour':first_3_buses[2]['arrivaldatetime'][11:13], 'datetime':first_3_buses[2]['arrivaldatetime'], 'previous_stop':previous_stop})
                stops_bus_2.append({'stopid':i, 'delay':first_3_buses[1]['delay'], 'arrival_hour':first_3_buses[1]['arrivaldatetime'][11:13], 'datetime':first_3_buses[1]['arrivaldatetime'], 'previous_stop':previous_stop})
                stops_bus_1.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})
                print('BUs 1:', stops_bus_1)
            print('<---------------------------------------------------------------->')
            print(stops_bus_1)
            print(stops_bus_2)
            print(stops_bus_3)
            print('<---------------------------------------------------------------->')
        joined = [stops_bus_1, stops_bus_2, stops_bus_3]
    elif len(stops) == 2:
        # Set bus_number to 2, we will start filling the buses from the end, the last bus first
        bus_number = 2

        # Populate our lists
        for i in stops[len(stops) - 1]:
            # Get the times for the buses at the given stop
            first_3_buses = get_due_time(str(i), route)
            while first_3_buses == []:
                print('Error with:', str(1))
                first_3_buses = get_due_time(str(i), route)
                # continue
            # Add in the delay
            get_delay(first_3_buses)
            print(i, first_3_buses)
            # Have to check if the bus it at the first stop, in which case, we just say 'Starting stop' for previous_stop
            if i == stop_list[0]:
                    previous_stop = 'Starting stop'
            # Else, we get the previous stop
            else:
                previous_stop = stop_list[stop_list.index(i) - 1]

            # If the bus is the last one, we will only append to bus_number_3
            if bus_number == 2:
                # If we reach the stop where bus number 2 is, we must append this stop to both bus_number_3 and bus_number2 and
                # decrease the bus_number counter
                if i == bus_1:
                    bus_number -= 1
                    stops_bus_2.append({'stopid':i, 'delay':first_3_buses[1]['delay'], 'arrival_hour':first_3_buses[1]['arrivaldatetime'][11:13], 'datetime':first_3_buses[1]['arrivaldatetime'], 'previous_stop':previous_stop})
                    stops_bus_1.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})
                else:
                    stops_bus_2.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})

            # Now, we keep adding bus 2 and bus 1
            elif bus_number == 1:
                print('First blah bla', first_3_buses)
                stops_bus_2.append({'stopid':i, 'delay':first_3_buses[1]['delay'], 'arrival_hour':first_3_buses[1]['arrivaldatetime'][11:13], 'datetime':first_3_buses[1]['arrivaldatetime'], 'previous_stop':previous_stop})
                stops_bus_1.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})
        joined = [stops_bus_1, stops_bus_2]
    elif len(stops) == 1:
        # Populate just the one bus
        for i in stops[len(stops) - 1]:
            # Get the times for the buses at the given stop
            first_3_buses = get_due_time(str(i), route)
            while first_3_buses == []:
                print('Error with:', str(1))
                first_3_buses = get_due_time(str(i), route)
                # continue
            # Add in the delay
            get_delay(first_3_buses)

            # Have to check if the bus it at the first stop, in which case, we just say 'Starting stop' for previous_stop
            if i == stop_list[0]:
                    previous_stop = 'Starting stop'
            # Else, we get the previous stop
            else:
                previous_stop = stop_list[stop_list.index(i) - 1]
            stops_bus_1.append({'stopid':i, 'delay':first_3_buses[0]['delay'], 'arrival_hour':first_3_buses[0]['arrivaldatetime'][11:13], 'datetime':first_3_buses[0]['arrivaldatetime'], 'previous_stop':previous_stop})
        joined = [stops_bus_1]
    print('Joined:', joined)
    return joined


# Everything runs from this function. It receives the source and (maybe the destination?) stop id and bus route.
def main_bus_finder(source_stop, destination_stop, bus_route):
    """This function receives the source(or destination, or both) stop_id and bus route, and will:
    1) Get the next 3 buses arriving at that stop
    2) Find where those buses are along the route
    3) Compute the delay for each stop for all 3 buses
    The end result is a dictionary that has delay, arrival_hour, stop_id and previous_stop."""
    # In the future, the data for these two variables will have to come from the website
    at_stop_id = source_stop
    bus_route = bus_route

    # Extra variable used for finding the delay
    at_stop_id_original = at_stop_id

    # Get direction: inbound or outbound
    try:
        direction = (get_due_time(at_stop_id, bus_route)[0]['direction']).lower()
    except IndexError:
        print('No buses found!')
        return "No buses found!"
    # Get stop list for the specified route in the inbound/outbound direction
    stop_ids = get_stop_list(bus_route, direction)
    print('Stop ids', stop_ids)
    # Get stop list only up to source stop. Trying to solve error where we get a stop beyond the source stop for the location
    # of the bus
    # print(stop_ids)
    source_stops = stop_ids[:(stop_ids.index(int(destination_stop)) + 1)]
    print("Source stops", source_stops)
    # Get due times for first 3 buses at chosen origin, for specified route
    first_3_buses = get_due_time(at_stop_id, bus_route)
    print("3buses", first_3_buses)
    # Get the delays for each of the buses
    # get_delay(first_3_buses)

    # Find where the buses are store it in list
    bus_position = []
    at_stop_id_test = at_stop_id
    for i in first_3_buses:
        # If the bus is due at the SRC stop, no need to look for it
        print('Original due time is', i['duetime'], 'minutes.')
        if i['duetime'] == 'Due' or int(i['duetime']) <= 2:
            bus_position.append(int(at_stop_id))
            print('The bus it at', str(at_stop_id) + '.')
            # print('Bus is delayed by', i['delay'], 'seconds. Or approximately', round(i['delay'] / 60), 'minutes.')
            print('\n<<---------------------------------------------------------->>')
            continue

        # But if its not, we will need to go into the bus finder algorithm
        # pointer = get_closest_bus_stop(i['duetime'], at_stop_id, source_stops, bus_route)
        pointer_test = get_closest_stop_test(i['duetime'], at_stop_id_test, source_stops, bus_route)
        print('The bus is at', str(stop_ids[pointer_test]) + '.')
        bus_position.append(stop_ids[pointer_test])
        # print('Bus is delayed by', i['delay'], 'seconds. Or approximately', round(i['delay'] / 60), 'minutes.')
        print('\n<<---------------------------------------------------------->>')

        # Next we reduce the pointer (our index) by one, so we don't risk getting the same bus again (except detailed exception as explained previously)
        # at_stop_id = str(stop_ids[pointer - 1])
        if pointer_test == 0:
            continue
        at_stop_id_test = str(stop_ids[pointer_test - 1])
    print('Bus position', bus_position)

    # Get list of stops starting at the stop where the bus is at up to the destination stop
    list_of_stops = get_all_stops(bus_position, stop_ids, destination_stop)
    print('List of stops', list_of_stops)
    # Get the final data necessary to go into the model and return it
    stops_for_model = info_for_model(stop_ids, list_of_stops, bus_route)
    print('Stops for model:', stops_for_model)
    clean = [x for x in stops_for_model if x != []]
    return stops_for_model

if __name__ == '__main__':
    source_stop = '2112'
    destination_stop = '2123'
    bus_route = '76'
    print(main_bus_finder(source_stop, destination_stop, bus_route))
