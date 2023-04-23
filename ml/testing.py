import requests
from geopy.geocoders import Nominatim
geolocator = Nominatim(user_agent="evee")
location = geolocator.geocode("1639 Crenshaw Boulevard LA")
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
  "chargingModes": [
    {
      "chargingConnections": [
        {
          "facilityType": "Charge_380_to_480V_3_Phase_at_32A",
          "plugType": "IEC_62196_Type_2_Outlet"
        }
      ],
      "chargingCurve": [
        {
          "chargeInkWh": 6,
          "timeToChargeInSeconds": 360
        },
        {
          "chargeInkWh": 12,
          "timeToChargeInSeconds": 720
        },
        {
          "chargeInkWh": 28,
          "timeToChargeInSeconds": 1944
        },
        {
          "chargeInkWh": 40,
          "timeToChargeInSeconds": 4680
        }
      ]
    },
    {
      "chargingConnections": [
        {
          "facilityType": "Charge_200_to_240V_1_Phase_at_10A",
          "plugType": "Standard_Household_Country_Specific"
        }
      ],
      "chargingCurve": [
        {
          "chargeInkWh": 6,
          "timeToChargeInSeconds": 15624
        },
        {
          "chargeInkWh": 12,
          "timeToChargeInSeconds": 32652
        },
        {
          "chargeInkWh": 28,
          "timeToChargeInSeconds": 76248
        },
        {
          "chargeInkWh": 40,
          "timeToChargeInSeconds": 109080
        }
      ]
    }
  ]
}
response = requests.post(url, json = body)
# print(response.json()["data"][0])
