import { useEffect } from "react";
import { dataEndpoint } from "../utils/constants";
import { feedResponseType, vehicleData } from "../utils/types";
import { setFrame } from "../utils/tripFrameStorage";
import { useSetRecoilState } from "recoil";
import { vehicleInfoState } from "../utils/atoms";
import LoadingScreenComponent from "./loadingScreen";


function LoadingScreen() {
  const setVehicleInfo = useSetRecoilState(vehicleInfoState);

  useEffect(() => {
    const options = {
      method: "POST",
      body: "{}",
    };

    fetch(dataEndpoint, options)
      .then((response) => response.json())
      .then((response: feedResponseType) => {
        console.log(response);
        response.data.forEach((latest_info: vehicleData) => {
          var temp: vehicleData | undefined = undefined;

          temp = {
            latitude: latest_info.latitude,
            longitude: latest_info.longitude,
            distanceTraveledMiles: 0,
            reverseGeo: latest_info.reverseGeo,
            speedMilesPerHour: latest_info.speedMilesPerHour,
            isEcuSpeed: latest_info.isEcuSpeed,
            headingDegrees: latest_info.headingDegrees,
            engineStates:
              latest_info.speedMilesPerHour > 0
                ? "On"
                : latest_info.engineStates,
            elevation: latest_info.elevation,
            elevationChange: 0,
            timestamp: latest_info.timestamp,
            ambientAirTemperatureMilliC:
              latest_info.ambientAirTemperatureMilliC,
            evStateOfChargeMilliPercent:
              latest_info.evStateOfChargeMilliPercent,
            evStateOfChargeChanged: false,
          };

          setFrame(temp);
          setVehicleInfo({
            current: temp,
          });
        });
      })
      .catch((err) => console.error(err));
    return () => {};
  }, []);

  return (
    <LoadingScreenComponent />
  );
}

export default LoadingScreen;
