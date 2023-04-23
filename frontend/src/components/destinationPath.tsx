import { useRecoilValue } from "recoil";
import { routeLegData } from "../utils/types";
import { currentDestinationState } from "../utils/atoms";
import { Polyline } from "react-leaflet";
import RestaurantsComponent from "./restaurants";
import BathroomsComponent from "./bathrooms";

function DestinationPathComponent() {
  const currentDestination = useRecoilValue(currentDestinationState);

  if (currentDestination == undefined) {
    return <></>;
  }

  return (
    <>
      {currentDestination[0].legs.map((leg: routeLegData) => {
        var lastPoint = leg.points[leg.points.length - 1];

        return (
          <>
            <Polyline
              pathOptions={{ color: "#4287f5", dashArray: "4,8", weight: 6 }}
              positions={leg.points.map((point) => [
                point.latitude,
                point.longitude,
              ])}
            />
            <RestaurantsComponent
              latitude={lastPoint.latitude}
              longitude={lastPoint.longitude}
            />
            <BathroomsComponent
              latitude={lastPoint.latitude}
              longitude={lastPoint.longitude}
            />
          </>
        );
      })}
    </>
  );
}

export default DestinationPathComponent;
