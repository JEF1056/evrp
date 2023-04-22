import requests
from flask import Flask, request
from flask_cors import CORS
import py3dep
import ciso8601
import sys
import json
from env import *
 
# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)
CORS(app)

global counter
counter = 0
testdata = json.load(open("testdata8.json", "r"))
 
def get_stats(base_url, decorations=None, vehicleId=None):
    state = []
    
    if decorations==None:
        return None
    
    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + samsara_api_key
    }
    
    after = request.get_json(silent=True)
    if after == None:
        after = {}
    
    for decorationIndex in range(0, len(decorations)):
        hasNextPage = True
        decoration = decorations[decorationIndex]
        
        while hasNextPage:
            params = {
                "types": "gps",
                "decorations": decoration,
                "vehicleIds": vehicleId
            }
            
            if decoration in after:
                params["after"] = after[decoration]
            
            response = requests.get(base_url, headers=headers, params=params)
            
            if response.status_code == 200 and len(response.json()["data"]) > 0:
                response = response.json()
                pagination = response["pagination"]
                data = response["data"][0]["gps"]
                for entryIndex, entry  in enumerate(data):
                    temp = {
                        "latitude": entry["latitude"], 
                        "longitude": entry["longitude"],
                        "reverseGeo": entry["reverseGeo"]["formattedLocation"],
                        "speedMilesPerHour": entry["speedMilesPerHour"],
                        "isEcuSpeed": entry["isEcuSpeed"],
                        "headingDegrees": entry["headingDegrees"],
                        "elevation": py3dep.elevation_bycoords([entry["longitude"], entry["latitude"]], crs="epsg:4326"),
                        "timestamp": ciso8601.parse_datetime(entry["time"]).timestamp(),
                    }

                    try:
                        temp[decoration] = entry["decorations"][decoration]["value"]
                    except: pass
                    
                    if decorationIndex == 0 and entryIndex == 0:
                        state.append(temp)
                    else:
                        state[entryIndex].update(temp)
                        
                    hasNextPage = pagination["hasNextPage"]
                    after[decoration] = pagination["endCursor"]
            else:
                hasNextPage = False
                break
          
    if len(state) > 1:
        print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", state, after)
        sys.stdout.flush()   
  
    return {
        "data": state,
        "after": after
    }


@app.route('/healthcheck')
def healthcheck():
    return 'OK'

@app.route('/feed_test', methods=['POST'])
def feed_test():
    global counter
    
    if counter != len(testdata)-1:
        counter += 1
        
    if "after" not in testdata[counter]:
        return {"data": testdata[counter], "after": {}}
    else:
        return testdata[counter]
    

@app.route('/feed', methods=['POST'])
def feed():
    base_url = "https://api.samsara.com/fleet/vehicles/stats/feed"
    
    if "vehicleId" in request.args:
        vehicleId = request.args["vehicleId"]
    else:
        return "No vehicleId provided", 500
    
    return get_stats(base_url, ["ambientAirTemperatureMilliC", "engineStates", "evStateOfChargeMilliPercent"], vehicleId=vehicleId)
 
# main driver function
if __name__ == '__main__':
 
    # run() method of Flask class runs the application
    # on the local development server.
    app.run(host="0.0.0.0", port=5000, debug=True)