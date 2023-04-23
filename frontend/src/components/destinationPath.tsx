import { useRecoilValue } from "recoil";
import { routeLegData } from "../utils/types";
import { currentDestinationState } from "../utils/atoms";
import { Polyline } from "react-leaflet";

function DestinationPathComponent() {
  const currentDestination = useRecoilValue(currentDestinationState);

  if (currentDestination == undefined) {
    return <></>;
  }

  console.log(currentDestination);

  return (
    <>
      {currentDestination[0].legs.map((leg: routeLegData) => {
        return (
          <Polyline
            pathOptions={{ color: "#4287f5", dashArray: "4,8", weight: 6 }}
            positions={leg.points.map((point) => [
              point.latitude,
              point.longitude,
            ])}
          />
        );
      })}
    </>
  );
}

export default DestinationPathComponent;
