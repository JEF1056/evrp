import requests
from geopy.geocoders import Nominatim
geolocator = Nominatim(user_agent="evee")
location = geolocator.geocode("Pismo Beach")
print(location.latitude)
print(location.longitude)
# #samsara
url = "https://api.samsara.com/fleet/vehicles/stats/feed?types=gps&decorations=evStateOfChargeMilliPercent,evAverageBatteryTemperatureMilliCelsius"
headers = {
    "accept": "application/json",
    "authorization": "Bearer samsara_api_5DrtQSYHOPAZtoWfekflfutuTmSjWc",
}
response = requests.get(url, headers=headers)
gps = response.json()["data"][0]["gps"][0]
curr_lat = str(gps["latitude"])
curr_long = str(gps["longitude"])

dest_lat = str(location.latitude)
dest_long = str(location.longitude)
print(response.text)
#1639 Crenshaw Boulevard LA
#2030 Sawtelle Blvd
#4991 La Palma Ave
# #tomtom
url = "".join(["https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/", 
              curr_lat, "%2C", curr_long, "%3A", dest_lat, "%2C", dest_long, 
              "/json?vehicleEngineType=electric&constantSpeedConsumptionInkWhPerHundredkm=50.0%2C6.5%3A100.0%2C8.5&currentChargeInkWh=10&maxChargeInkWh=40&minChargeAtDestinationInkWh=5.2&minChargeAtChargingStopsInkWh=1.5&key=6CyE7TqPGbhqdig0YIOxKcnwpSoI88PW"])

body = {
  "chargingParameters": {
      "batteryCurve": [
        {
          "stateOfChargeInkWh": 50.0,
          "maxPowerInkW": 200
        },
        {
          "stateOfChargeInkWh": 70.0,
          "maxPowerInkW": 100
        },
        {
          "stateOfChargeInkWh": 80.0,
          "maxPowerInkW": 40
        }
      ],
      "chargingConnectors": [
        {
          "currentType": "AC3",
          "plugTypes": [
            "IEC_62196_Type_1_Outlet",
            "IEC_62196_Type_2_Connector_Cable_Attached",
            "Combo_to_IEC_62196_Type_2_Base"
          ],
          "efficiency": 0.9,
          "baseLoadInkW": 0.2,
          "maxPowerInkW": 11
        },
        {
          "currentType": "DC",
          "plugTypes": [
            "IEC_62196_Type_1_Outlet",
            "IEC_62196_Type_1_Connector_Cable_Attached",
            "Combo_to_IEC_62196_Type_1_Base"
          ],
          "voltageRange": {
            "minVoltageInV": 0,
            "maxVoltageInV": 500
          },
          "efficiency": 0.9,
          "baseLoadInkW": 0.2,
          "maxPowerInkW": 180
        },
        {
          "currentType": "DC",
          "plugTypes": [
            "IEC_62196_Type_1_Outlet",
            "IEC_62196_Type_1_Connector_Cable_Attached",
            "Combo_to_IEC_62196_Type_1_Base"
          ],
          "voltageRange": {
            "minVoltageInV": 500,
            "maxVoltageInV": 2000
          },
          "efficiency": 0.9,
          "baseLoadInkW": 0.2
        }
      ],
      "chargingTimeOffsetInSec": 60
	}
}

response = requests.post(url, json = body)
print(response.json())
print(response.json()["data"][0])
