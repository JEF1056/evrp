import { Button, Steps } from "react-daisyui";
import { useRecoilValue } from "recoil";
import { currentDestinationState } from "../../utils/atoms";
import { routeData } from "../../utils/types";

function RoutesDataComponent() {
  const destinations = useRecoilValue(currentDestinationState);
  if (destinations === undefined) {
    return <>No destination entered</>;
  }

  return (
    <div className="overflow-y-auto max-h-[14rem] w-full bg-white md:max-h-[100rem]">
      <ul className="steps steps-vertical">
        {destinations.map((routeData: routeData) =>
          routeData.legs.map((routeLegData) => (
            <li data-content="" className="step step-primary">
              [{routeLegData.summary.lengthInMeters},
              {routeLegData.summary.travelTimeInSeconds/3600},
              {routeLegData.summary.trafficDelayInSeconds/3600}, 
              {routeLegData.summary.trafficLengthInMeters},
              {(routeLegData.summary.batteryConsumptionInkWh/77) * 100},
              {(routeLegData.summary.remainingChargeAtArrivalInkWh/77) * 100},
              <button className="btn" onClick={()=> window.open("https://www.google.com/maps?saddr=Current+Location&daddr="+routeLegData.points[routeLegData.points.length - 1].latitude + "," +routeLegData.points[routeLegData.points.length - 1].longitude, "_blank")}>Button</button>]
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
// [destination.legs[0].summary.lengthInMeters]
//{routeLegData.summary.chargingInformationAtEndOfLeg.chargingParkName},
//{routeLegData.summary.chargingInformationAtEndOfLeg.chargingParkPowerInkW}
export default RoutesDataComponent;
