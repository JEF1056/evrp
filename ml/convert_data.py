import os
import json
import pandas
from datetime import datetime
import matplotlib.pyplot as plt

final = []

for file in os.listdir("frontend/src/dataset"):
    for trip in json.load(open(os.path.join("frontend/src/dataset", file), "r")):
        evConsumedEnergyKiloWhSinceLastFrame = None
        counter = 0
        for entry in trip:
            entry["date"] = datetime.fromtimestamp(entry["timestamp"]).strftime('%Y-%m-%d %H:%M:%S')
            final.append(entry)
            
            # if evConsumedEnergyKiloWhSinceLastFrame is not None and "evConsumedEnergyKiloWhSinceLastFrame" in entry and entry["evConsumedEnergyKiloWhSinceLastFrame"] != 0:
            #     for i in range(counter + 1):
            #         final[-1-i]["evConsumedEnergyKiloWhSinceLastFrame"] = evConsumedEnergyKiloWhSinceLastFrame / (counter + 1)
            #         final[-1-i]["efficency"] = (final[-1-i]["milesTraveledSinceFrame"] if "milesTraveledSinceFrame" in final[-1-i] else 0) / final[-1-i]["evConsumedEnergyKiloWhSinceLastFrame"]
            #     counter = 0
            #     evConsumedEnergyKiloWhSinceLastFrame is None
            # else:  
            #     counter += 1
                    
            # if evConsumedEnergyKiloWhSinceLastFrame is None and "evConsumedEnergyKiloWhSinceLastFrame" in entry and entry["evConsumedEnergyKiloWhSinceLastFrame"] != 0:
            #     evConsumedEnergyKiloWhSinceLastFrame = entry["evConsumedEnergyKiloWhSinceLastFrame"]

        
df = pandas.DataFrame(final)
print(df.head)
df.sort_values('timestamp', inplace=True)

target_column = "efficency"
df.insert(len(df.columns)-1, target_column, df.pop(target_column))

df.insert(0, "date", df.pop("date"))
df.drop("datetime", "columns", inplace=True)
df.drop("timestamp", "columns", inplace=True)
df.drop("gpsDistanceMeters", "columns", inplace=True)
df.drop("reverseGeo", "columns", inplace=True)
df.drop("evConsumedEnergyKiloWhSinceLastFrame", "columns", inplace=True)
df.drop("latitude", "columns", inplace=True)
df.drop("longitude", "columns", inplace=True)
df.drop("isEcuSpeed", "columns", inplace=True)
df.drop("engineStates", "columns", inplace=True)
df.drop("engineRpm", "columns", inplace=True)
df.drop("headingDegrees", "columns", inplace=True)
df.drop("timeSinceLastFrame", "columns", inplace=True)
# df.drop("milesTraveledSinceFrame", "columns", inplace=True)
df.drop("evStateOfChargeMilliPercent", "columns", inplace=True)
df.drop("elevation", "columns", inplace=True)
# df.drop("ambientAirTemperatureMilliC", "columns", inplace=True)

# df["evStateOfChargeMilliPercent"] = df["evStateOfChargeMilliPercent"] / 1000

df["efficency"] = df.efficency.round(2)
print(df.head)
print(df["efficency"].max())
print(df["efficency"].min())
print(df["efficency"].mean())
print(df["efficency"].mode()[0])

df["ambientAirTemperatureMilliC"] = df["ambientAirTemperatureMilliC"].fillna(df["ambientAirTemperatureMilliC"].mean())
df["ambientAirTemperatureMilliC"] = df["ambientAirTemperatureMilliC"] / 1000
df.dropna(inplace=True)

# plt.title("SOC over time") 
# plt.xlabel("time") 
# plt.ylabel("state of charge")
# plt.plot(df["timestamp"], df["efficency"])
# plt.plot(df["timestamp"], df["speedMilesPerHour"])
# plt.plot(df["timestamp"], df["ambientAirTemperatureMilliC"])
# plt.show()

df.to_csv('socPredictionDataset.csv', index=False)