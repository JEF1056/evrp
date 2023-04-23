import { Table, Mask, Badge, Button, Stats, Checkbox } from "react-daisyui";
import { useRecoilValue } from "recoil";
import { vehicleInfoState } from "../../utils/atoms";
import { historicalVehicleData } from "../../utils/types";

function ChargeReadinessComponent() {

    const chargeInfo = useRecoilValue(vehicleInfoState)
    
    let charge;
    let temperature;
    if (chargeInfo === undefined) {
        return <div>Loading charge readiness...</div>;
    } else if (chargeInfo.current === undefined) {
        return <div>Loading charge readiness...</div>;
    } else {
      charge = chargeInfo.current.evStateOfChargeMilliPercent/1000;
      temperature = chargeInfo.current.ambientAirTemperatureMilliC/1000;
    }


    return(

        <Table className="rounded-none w-full">
          <Table.Body >
            <Table.Row>
              <Checkbox checked={charge > 80 ? true : false} disabled={true} className="float-right" />
                <div>
                  <div className="font-bold">State of Charge</div>
                  <div className="text-sm opacity-50">Below 15%</div>
                </div>
            </Table.Row>
  
            <Table.Row>
              <Checkbox checked={temperature > 69 && temperature < 91 ? true : false} color="error" disabled={true} className="float-right" />
                <div>
                  <div className="font-bold">Battery Temperature</div>
                  <div className="text-sm opacity-50">Between 70-90°F</div>
                </div>
              
            </Table.Row>
  
          </Table.Body>
  
        </Table>
    
    )
}

export default ChargeReadinessComponent;