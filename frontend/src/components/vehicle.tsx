import { useEffect } from "react";
import { Popup, useMap } from "react-leaflet";
import vehicleOnInMotionSvg from "../icons/vehicle-on-in-motion.svg";
import vehicleOffSvg from "../icons/vehicle-off.svg";
import vehicleOnStoppedSvg from "../icons/vehicle-on-stopped.svg";
import { Icon } from "leaflet";
import { useRecoilState, useRecoilValue } from "recoil";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import {
  getLatestFrame,
  getFramesInOrder,
  setFrame,
  setLastSeenUuids,
  getLastSeenUuids,
} from "../utils/tripFrameStorage";
import { getPreciseDistance, getRhumbLineBearing } from "geolib";
import { feedResponseType, vehicleData } from "../utils/types";
import { vehicleInfoState, centerVehicleState } from "../utils/atoms";
import { getAvgEfficiency } from "../utils/computeStatistics";
import { dataEndpoint, vehicleAnimationSpeed } from "../utils/constants";

const vehicleOnInMotionIcon = new Icon({
  iconUrl: vehicleOnInMotionSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const vehicleOffIcon = new Icon({
  iconUrl: vehicleOffSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const vehicleOnStoppedIcon = new Icon({
  iconUrl: vehicleOnStoppedSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

console.log(dataEndpoint);

var test: any[] = [];

function getEfficiency(currentEvStateOfChargeMilliPercent: number) {
  let latestFrame = getLatestFrame();

  if (
    latestFrame !== undefined &&
    latestFrame.evStateOfChargeMilliPercent !==
      currentEvStateOfChargeMilliPercent
  ) {
    let whUsed =
      ((latestFrame.evStateOfChargeMilliPercent -
        currentEvStateOfChargeMilliPercent) /
        100) *
      77 *
      1.1172413793103448275862068965517;

    let affectedFrames = getFramesInOrder(
      (frame: vehicleData) =>
        frame.efficiency === undefined || frame.efficiency === null
    );

    console.log(
      whUsed,
      latestFrame.evStateOfChargeMilliPercent,
      currentEvStateOfChargeMilliPercent
    );

    if (affectedFrames) {
      let distanceTraveledMiles = affectedFrames
        .map((frame: vehicleData) => frame.distanceTraveledMiles || 0)
        .reduce((a, b) => a + b, 0);

      console.log(distanceTraveledMiles);

      affectedFrames.forEach((frame: vehicleData) => {
        frame.efficiency = whUsed / distanceTraveledMiles;
        setFrame(frame);
      });

      return whUsed / distanceTraveledMiles;
    }
  }

  return undefined;
}

function VehicleComponent() {
  const map = useMap();

  const [vehicleInfo, setVehicleInfo] = useRecoilState(vehicleInfoState);
  const centerVehicle = useRecoilValue(centerVehicleState);

  useEffect(() => {
    function getAlerts() {
      const options = {
        method: "POST",
        body: JSON.stringify(getLastSeenUuids()),
      };

      fetch(dataEndpoint, options)
        .then((response) => response.json())
        .then((response: feedResponseType) => {
          test = [...test, response];
          //   console.log(test);

          if (response.data.length > 1) {
            console.log(response);
          }
          setLastSeenUuids(response.after);

          response.data.forEach((latest_info: vehicleData) => {
            var temp: vehicleData | undefined = undefined;
            let last_info: vehicleData | undefined = getLatestFrame();

            if (last_info !== undefined) {
              let distanceTraveledMiles =
                getPreciseDistance(
                  {
                    latitude: latest_info.latitude,
                    longitude: latest_info.longitude,
                  },
                  {
                    latitude: last_info.latitude,
                    longitude: last_info.longitude,
                  },
                  0.01
                ) *
                0.000621371 *
                1.1145272867025365103766333589547;
              let headingDegrees = getRhumbLineBearing(
                {
                  latitude: latest_info.latitude,
                  longitude: latest_info.longitude,
                },
                { latitude: last_info.latitude, longitude: last_info.longitude }
              );
              let elevationChange = latest_info.elevation - last_info.elevation;
              let efficiency = getEfficiency(
                latest_info.evStateOfChargeMilliPercent
              );
              let avgEfficiency = getAvgEfficiency(
                latest_info,
                distanceTraveledMiles
              );

              temp = {
                latitude: latest_info.latitude,
                longitude: latest_info.longitude,
                distanceTraveledMiles: distanceTraveledMiles,
                reverseGeo: latest_info.reverseGeo,
                speedMilesPerHour: latest_info.speedMilesPerHour,
                isEcuSpeed: latest_info.isEcuSpeed,
                headingDegrees: latest_info.headingDegrees
                  ? latest_info.headingDegrees
                  : headingDegrees,
                engineStates:
                  latest_info.speedMilesPerHour > 0 ||
                  last_info.speedMilesPerHour > 0
                    ? "On"
                    : latest_info.engineStates,
                elevation: latest_info.elevation,
                elevationChange: elevationChange,
                efficiency: efficiency,
                avgEfficiency: avgEfficiency,
                timestamp: latest_info.timestamp,
                ambientAirTemperatureMilliC:
                  latest_info.ambientAirTemperatureMilliC,
                evStateOfChargeMilliPercent:
                  latest_info.evStateOfChargeMilliPercent,
                evStateOfChargeChanged: efficiency === undefined ? false : true,
              };

              setFrame(temp);
              setVehicleInfo({
                current: temp,
                previous: last_info,
              });
            } else {
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
            }
          });
        })
        .catch((err) => console.error(err));
    }
    getAlerts();
    const interval = setInterval(() => getAlerts(), vehicleAnimationSpeed);
    return () => {
      clearInterval(interval);
    };
  }, [setVehicleInfo]);

  if (vehicleInfo !== undefined) {
    if (centerVehicle) {
      map.setView(
        [
          vehicleInfo.current.latitude -
            (window.innerWidth < 768
              ? 3.5545023696682464454976303317536e-6 * window.innerHeight
              : 0),
          vehicleInfo.current.longitude -
            (window.innerWidth > 768
              ? 4.1666666666666666666666666666667e-6 * window.innerWidth
              : 0),
        ],
        15,
        {
          animate: true,
          duration: (vehicleAnimationSpeed / 1000) * 1.2,
        }
      );
    }

    return (
      <LeafletTrackingMarker
        icon={
          vehicleInfo.current.engineStates === "On"
            ? vehicleInfo.current.speedMilesPerHour !== undefined &&
              vehicleInfo.current.speedMilesPerHour > 0
              ? vehicleOnInMotionIcon
              : vehicleOnStoppedIcon
            : vehicleOffIcon
        }
        position={[vehicleInfo.current.latitude, vehicleInfo.current.longitude]}
        previousPosition={
          vehicleInfo.previous && [
            vehicleInfo.previous.latitude,
            vehicleInfo.previous.longitude,
          ]
        }
        duration={vehicleAnimationSpeed * 1.2}
      >
        <Popup>
          SOC: {vehicleInfo.current.evStateOfChargeMilliPercent / 1000}%<br />
          On?: {vehicleInfo.current.engineStates}
          <br />
          Heading: {vehicleInfo.current.headingDegrees}°
        </Popup>
      </LeafletTrackingMarker>
    );
  }

  return <></>;
}

export default VehicleComponent;
