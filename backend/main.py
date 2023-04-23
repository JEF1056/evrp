import requests
from flask import Flask, request
from flask_cors import CORS
import py3dep
import ciso8601
import sys
import json
from env import *
from geopy.geocoders import Nominatim

# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)
CORS(app)

global counter
counter = 0
testdata = json.load(open("testdata8.json", "r"))

headers = {"accept": "application/json", "authorization": "Bearer " + samsara_api_key}


def get_stats(base_url, decorations=None, vehicleId=None):
    state = []

    if decorations == None:
        return None

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
                "vehicleIds": vehicleId,
            }

            if decoration in after:
                params["after"] = after[decoration]

            response = requests.get(base_url, headers=headers, params=params)

            if response.status_code == 200 and len(response.json()["data"]) > 0:
                response = response.json()
                pagination = response["pagination"]
                data = response["data"][0]["gps"]
                for entryIndex, entry in enumerate(data):
                    temp = {
                        "latitude": entry["latitude"],
                        "longitude": entry["longitude"],
                        "reverseGeo": entry["reverseGeo"]["formattedLocation"],
                        "speedMilesPerHour": entry["speedMilesPerHour"],
                        "isEcuSpeed": entry["isEcuSpeed"],
                        "headingDegrees": entry["headingDegrees"],
                        "elevation": py3dep.elevation_bycoords(
                            [entry["longitude"], entry["latitude"]], crs="epsg:4326"
                        ),
                        "timestamp": ciso8601.parse_datetime(entry["time"]).timestamp(),
                    }

                    try:
                        temp[decoration] = entry["decorations"][decoration]["value"]
                    except:
                        pass

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
        print(
            "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
            state,
            after,
        )
        sys.stdout.flush()

    return {"data": state, "after": after}


@app.route("/route_to")
def route_to():
    vehicleId = request.args.get("vehicleId")
    desination = request.args.get("desination")
    # chargingLevel = request.args.get("chargingLevel") # 1 or 2

    if vehicleId == None or desination == None:
        return "No vehicleId or desination provided", 400

    base_url = "https://api.samsara.com/fleet/vehicles/stats/feed"
    routing_base_url = "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/"

    params = {
        "types": "gps",
        "decorations": "evStateOfChargeMilliPercent",
        "vehicleIds": vehicleId,
    }

    response = requests.get(base_url, headers=headers, params=params)
    if response.status_code == 200:
        current_data = response.json()["data"][0]
        curr_lat = str(current_data["gps"][0]["latitude"])
        curr_long = str(current_data["gps"][0]["longitude"])

        try:
            geolocator = Nominatim(user_agent="Evee")
            location = geolocator.geocode(desination)
            dest_lat = str(location.latitude)
            dest_long = str(location.longitude)
        except:
            return "Could not get latLong for destination. Try again!", 500

        routing_base_url = f"https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/{curr_lat}%2C{curr_long}%3A{dest_lat}%2C{dest_long}/json"

        params = {
            "routeType": "fastest",
            "traffic": "true",
            "avoid": "tollRoads",
            "travelMode": "car",
            "vehicleWeight": 2212.17,
            "vehicleLength": 4.5847,
            "vehicleHeight": 1.65354,
            "vehicleWidth": 1.85166,
            "vehicleCommercial": False,
            "vehicleEngineType": "electric",
            "currentChargeInkWh": (
                current_data["decorations"]["evStateOfChargeMilliPercent"]["value"]
                / 100000
            )
            * 77,
            "maxChargeInkWh": 77,
            "auxiliaryPowerInkW": 0.5,
            "minChargeAtDestinationInkWh": 11.55,  # 15%
            "minChargeAtChargingStopsInkWh": 3.85,  # 5%
        }

        body = {
            "chargingParameters": {
                "batteryCurve": [
                    {"stateOfChargeInkWh": 5.0, "maxPowerInkW": 185},
                    {"stateOfChargeInkWh": 30.0, "maxPowerInkW": 175},
                    {"stateOfChargeInkWh": 50.0, "maxPowerInkW": 140},
                    {"stateOfChargeInkWh": 70.0, "maxPowerInkW": 85},
                    {"stateOfChargeInkWh": 80.0, "maxPowerInkW": 40},
                ],
                "chargingConnectors": [
                    {
                        "currentType": "AC3",
                        "plugTypes": [
                            "IEC_62196_Type_1_Outlet",
                            "IEC_62196_Type_2_Connector_Cable_Attached",
                            "Combo_to_IEC_62196_Type_2_Base",
                        ],
                        "efficiency": 0.9,
                        "baseLoadInkW": 0.2,
                        "maxPowerInkW": 11,
                    },
                    {
                        "currentType": "DC",
                        "plugTypes": [
                            "IEC_62196_Type_1_Outlet",
                            "IEC_62196_Type_1_Connector_Cable_Attached",
                            "Combo_to_IEC_62196_Type_1_Base",
                        ],
                        "voltageRange": {"minVoltageInV": 0, "maxVoltageInV": 500},
                        "efficiency": 0.95,
                        "baseLoadInkW": 0.2,
                        "maxPowerInkW": 180,
                    },
                ],
                "chargingTimeOffsetInSec": 60,
            }
        }
        
        response = requests.post(routing_base_url, json=body, params=params)
        if response.status_code == 200:
            response.json()
        else:
            return "Failed to get route. " + response.content, 500


@app.route("/healthcheck")
def healthcheck():
    return "OK"


@app.route("/feed_test", methods=["POST"])
def feed_test():
    global counter

    if counter != len(testdata) - 1:
        counter += 1

    if "after" not in testdata[counter]:
        return {"data": testdata[counter], "after": {}}
    else:
        return testdata[counter]


@app.route("/feed", methods=["POST"])
def feed():
    base_url = "https://api.samsara.com/fleet/vehicles/stats/feed"

    if "vehicleId" in request.args:
        vehicleId = request.args["vehicleId"]
    else:
        return "No vehicleId provided", 500

    return get_stats(
        base_url,
        ["ambientAirTemperatureMilliC", "engineStates", "evStateOfChargeMilliPercent"],
        vehicleId=vehicleId,
    )


# main driver function
if __name__ == "__main__":
    # run() method of Flask class runs the application
    # on the local development server.
    app.run(host="0.0.0.0", port=5000, debug=True)
