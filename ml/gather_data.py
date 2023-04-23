import requests
import json
import ciso8601
from tqdm import tqdm, trange
import time
import datetime
import geopy.distance
import py3dep

key_stat = "gps"

stats = [
    "ambientAirTemperatureMilliC",
    "engineStates",
    "engineRpm",
    "evStateOfChargeMilliPercent",
    "evChargingEnergyMicroWh",
    "gpsDistanceMeters",
    # "evRegeneratedEnergyMicroWh",
    # "evConsumedEnergyMicroWh",
]

samsara_api_key = "samsara_api_mgw61Muh7RFxmTAkvhIDZb1QgqmU4Y"

headers = {
    "accept": "application/json",
    "authorization": "Bearer " + samsara_api_key,
}

vehicle_id = "281474981766008"

# start_time = "2023-03-21T06:07:11Z"
# end_time = "2023-03-23T06:07:11Z"

start_time = "2023-03-21T00:00:00-08:00"
end_time = "2023-04-08T23:59:59-08:00"

samsara_url = f"https://api.samsara.com/fleet/vehicles/stats/history?startTime={start_time}&endTime={end_time}&vehicleIds={vehicle_id}"

data = {}

def process_hist(hist):
    temp = {}
    
    # elevations = get_elevation_batch([(frame["latitude"], frame["longitude"]) for frame in hist])
    
    for frame in hist:  #tqdm(hist):
        temp[frame["time"]] = {
            "datetime": frame["time"],
            "timestamp": ciso8601.parse_datetime(frame["time"]).timestamp(),
            'latitude': frame["latitude"],
            'longitude': frame["longitude"],
            'headingDegrees': frame["headingDegrees"],
            'speedMilesPerHour': frame["speedMilesPerHour"],
            'reverseGeo': frame["reverseGeo"]["formattedLocation"],
            'isEcuSpeed': frame["isEcuSpeed"],
        }
        
        if "decorations" in frame:
            temp[frame["time"]].update({key: frame["decorations"][key]["value"] for key in frame["decorations"]})

    return temp

def get_weather(lat, lon, timestamp):
    dt = datetime.datetime.fromtimestamp(timestamp)
    response = requests.get(f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={dt.date()}&end_date={dt.date()}&hourly=weathercode,windspeed_10m,winddirection_10m")
    if response.status_code == 200:
        return {
            "elevation": response.json()["elevation"],
            "weatherCode": response.json()["hourly"]["weathercode"][dt.hour],
            "windSpeed": response.json()["hourly"]["windspeed_10m"][dt.hour],
            "windDirection": response.json()["hourly"]["winddirection_10m"][dt.hour],
        }
    else:
        print("FATAL. Exiting.", response.json())
        exit()
        
# def get_elevation(lat, lon):
#     time.sleep(1)
#     response = requests.get(f"https://api.open-meteo.com/v1/elevation?latitude={lat}&longitude={lon}")
#     if response.status_code == 200:
#         elev = response.json()["elevation"][0]
#         response.close()
#         print(elev)
#         return elev
#     else:
#         print("FATAL. Exiting.", response.json())
#         exit()

def final_process(hist):
    hist = sorted(hist.values(), key=lambda d: d['timestamp'])
    ref = []
    temp = []
    final = []
    lastwh = 0
    
    for frame in tqdm(hist):
        clone = frame.copy()
        clone["elevation"] = py3dep.elevation_bycoords((frame["longitude"], frame["latitude"]), crs="epsg:4326")
        frame["elevation"] = clone["elevation"]
        
        if "engineStates" in frame and frame["engineStates"] == "On" and "evStateOfChargeMilliPercent" in frame:
            if ref != []:
                prev_ref = ref[-1]
                
                if "evStateOfChargeMilliPercent" in prev_ref and lastwh != ((prev_ref["evStateOfChargeMilliPercent"] / 100000) * 77):
                    lastwh = (prev_ref["evStateOfChargeMilliPercent"] / 100000) * 77
                
                # Calculate time since last frame
                clone["timeSinceLastFrame"] = frame["timestamp"] - prev_ref["timestamp"]
                clone["milesTraveledSinceFrame"] = geopy.distance.geodesic((frame["latitude"], frame["longitude"]), (prev_ref["latitude"], prev_ref["longitude"])).miles
                clone["evConsumedEnergyKiloWhSinceLastFrame"] = lastwh - ((frame["evStateOfChargeMilliPercent"] / 100000) * 77)
                clone["elevationChangeSinceLastFrame"] = clone["elevation"] - prev_ref["elevation"]
                
                # clone.update(get_weather(frame["latitude"], frame["longitude"], frame["timestamp"]))
                # clone["elevation"] = get_elevation(frame["latitude"], frame["longitude"])
                
            ref.append(frame)
            temp.append(clone)
        else:
            if temp != []:
                if ref != []:
                    prev_ref = ref[-1]
                    
                    # Calculate time since last frame
                    clone["timeSinceLastFrame"] = frame["timestamp"] - prev_ref["timestamp"]
                    clone["elevationChangeSinceLastFrame"] = clone["elevation"] - prev_ref["elevation"]
                    
                ref.append(frame)
                temp.append(clone)
                final.append(temp)
                temp = []
                    
    if temp != []:
        if ref != []:
            prev_ref = ref[-1]
            
            # Calculate time since last frame
            clone["timeSinceLastFrame"] = frame["timestamp"] - prev_ref["timestamp"]
            clone["elevationChangeSinceLastFrame"] = clone["elevation"] - prev_ref["elevation"]
            
        ref.append(frame)
        temp.append(clone)
        final.append(temp)
        
    final_postprocess = []
        
    for trip in final:
        temp1 = []
        evConsumedEnergyKiloWhSinceLastFrame = None
        counter = 0
        
        for entry in trip:
            temp1.append(entry)
            
            if evConsumedEnergyKiloWhSinceLastFrame is not None and "evConsumedEnergyKiloWhSinceLastFrame" in entry and entry["evConsumedEnergyKiloWhSinceLastFrame"] != 0:
                whpermile = (evConsumedEnergyKiloWhSinceLastFrame * 1000) / sum(temp1[-1-i]["milesTraveledSinceFrame"] if "milesTraveledSinceFrame" in temp1[-1-i] else 0 for i in range(counter + 1))
                for i in range(counter + 1):
                    temp1[-1-i]["efficency"] = whpermile
                
                if whpermile < -1000 or whpermile > 1000:
                    print("WARNING: whpermile is", whpermile, "for trip", trip[0]["datetime"], "to", trip[-1]["datetime"])
                    
                counter = 0
                evConsumedEnergyKiloWhSinceLastFrame = None
            else:  
                counter += 1
                
            if evConsumedEnergyKiloWhSinceLastFrame is None and "evConsumedEnergyKiloWhSinceLastFrame" in entry and entry["evConsumedEnergyKiloWhSinceLastFrame"] != 0:
                evConsumedEnergyKiloWhSinceLastFrame = entry["evConsumedEnergyKiloWhSinceLastFrame"]
        
        final_postprocess.append(temp1)
    return final_postprocess

def update_global_data(hist):
    for time in hist:
        if time in data:
            data[time].update(hist[time])
        else:
            data[time] = hist[time]

def get_stats(stat, endcursor, hist):
    if not hist:
        hist = []
        print(stat)
    response = requests.get(samsara_url+f"&types={key_stat}&decorations={stat}" + (f"&after={endcursor}" if endcursor else ""), headers=headers)
    if response.status_code == 200:
        response_json = response.json()
        if response_json["data"]:
            hist.extend(response_json["data"][0][key_stat])
        if response_json["pagination"]["hasNextPage"]:
            get_stats(stat, response_json["pagination"]["endCursor"], hist)
    else:
        print("FATAL. Exiting.", response.json())
        exit()
        
    return process_hist(hist)


for stat in stats:
    update_global_data(get_stats(stat, None, None))

data = final_process(data)
print(len(data))
json.dump(data, open("data.json", "w"))