import { Button, Steps } from "react-daisyui";
import { useRecoilValue } from "recoil";
import { currentDestinationState } from "../../utils/atoms";
import { routeData } from "../../utils/types";

function RoutesDataComponent() {
  const destinations = useRecoilValue(currentDestinationState);
  if (destinations === undefined) {
    return <div className="overflow-y-auto max-h-[14rem] w-full bg-white md:max-h-[100rem]">No destination entered</div>;
  }

  return (
    <div className="overflow-y-auto max-h-[14rem] w-full bg-white md:max-h-[100rem]">
    <ul className="steps steps-vertical w-full">
      {destinations.map((routeData: routeData) => {
        return (
          <div>
            {routeData.legs.map((routeLegData) => {
              return (
                <li data-content="" className="step step-primary w-full">
                  <div >
                    <p className="text-lg pl-2 text-left" 
                      onClick={() => window.open("https://www.google.com/maps?saddr=Current+Location&daddr=" + routeLegData.points[routeLegData.points.length - 1].latitude + "," + routeLegData.points[routeLegData.points.length - 1].longitude, "_blank")}
                      >{routeLegData.summary.chargingInformationAtEndOfLeg === undefined ? "Destination":routeLegData.summary.chargingInformationAtEndOfLeg.chargingParkName}</p>
                    <p className="text-sm pl-2 text-left opacity-50">{routeLegData.summary.lengthInMeters} meters</p>
                    <p className="text-sm pl-2 text-left opacity-50">{(routeLegData.summary.travelTimeInSeconds / 3600).toFixed(2)} s</p>
                    <p className="text-sm pl-2 text-left opacity-50">{((routeLegData.summary.remainingChargeAtArrivalInkWh / 77) * 100).toFixed(2)} %</p>
                  </div>
                </li>
              );
            })}
          </div>
        );
      })}
    </ul>
  </div>
  );
}
// [destination.legs[0].summary.lengthInMeters]
//{routeLegData.summary.chargingInformationAtEndOfLeg.chargingParkName},
//{routeLegData.summary.chargingInformationAtEndOfLeg.chargingParkPowerInkW}
export default RoutesDataComponent;
