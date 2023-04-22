import { useRecoilValue } from "recoil";
import { getFramesInOrder } from "../utils/tripFrameStorage";
import { vehicleData } from "../utils/types";
import { pathTypeState, vehicleInfoState } from "../utils/atoms";
import { Polyline, Tooltip } from "react-leaflet";
// import { Icon } from "leaflet";
// import startingPointIconSvg from "../icons/location-dot-solid.svg";
// import endingPointIconSvg from "../icons/flag-checkered-solid.svg";

// const startingPointIcon = new Icon({
//   iconUrl: startingPointIconSvg,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const endingPointIcon = new Icon({
//   iconUrl: endingPointIconSvg,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

function getColor(value?: number) {
  // value from 0 to 1
  if (value !== undefined) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,45%)"].join("");
  } else {
    return "hsl(0, 0%, 60%)";
  }
}

function VehiclePathComponent() {
  useRecoilValue(vehicleInfoState);
  const pathType = useRecoilValue(pathTypeState);

  const getSegmentColor = (segment: vehicleData) => {
    const max_efficiency = 1000;
    const min_efficiency = -1000;
    const max_elevation_gain = 30;
    const min_elevation_gain = -30;

    if (pathType === "SOC") {
      return 1 - segment.evStateOfChargeMilliPercent / 100000;
    } else if (pathType === "EFF") {
      if (segment.efficiency === undefined) {
        return undefined;
      }

      if (segment.efficiency > 0) {
        return segment.efficiency > max_efficiency
          ? 1
          : segment.efficiency / max_efficiency;
      } else if (segment.efficiency <= 0) {
        return segment.efficiency < min_efficiency
          ? -1
          : 1 - segment.efficiency / min_efficiency - 1;
      }
    } else if (pathType === "ELEV") {
      return segment.elevation / 600;
    } else if (pathType === "ELEVGAIN") {
      if (segment.elevationChange === undefined) {
        return undefined;
      }

      if (segment.elevationChange && segment.elevationChange > 0) {
        return segment.elevationChange > max_elevation_gain
          ? 1
          : segment.elevationChange / max_elevation_gain;
      } else if (segment.elevationChange && segment.elevationChange <= 0) {
        return segment.elevationChange < min_elevation_gain
          ? -1
          : 1 - segment.elevationChange / min_elevation_gain - 1;
      }
    } else if (pathType === "SPD") {
      return segment.speedMilesPerHour / 112;
    }
  };

  const getSegmentInfo = (segment: vehicleData) => {
    if (pathType === "SOC") {
      return segment.evStateOfChargeMilliPercent / 1000 + "%";
    } else if (pathType === "EFF") {
      return segment.efficiency + " wh/mi";
    } else if (pathType === "ELEV") {
      return segment.elevation + " feet above sea level";
    } else if (pathType === "ELEVGAIN") {
      return segment.elevationChange + " feet";
    } else if (pathType === "SPD") {
      return segment.speedMilesPerHour + " mi/hr";
    }

    return 0;
  };

  const trip = getFramesInOrder();

  return (
    <>
      {trip.map((segment: vehicleData, index: number) => {
        if (index === trip.length - 1) {
          return <></>;
        }

        const color = getColor(getSegmentColor(segment));

        return (
          <Polyline
            pathOptions={{ color: color }}
            positions={[
              [segment.latitude, segment.longitude],
              [trip[index + 1].latitude, trip[index + 1].longitude],
            ]}
          >
            <Tooltip>{getSegmentInfo(segment)}</Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}

export default VehiclePathComponent;
