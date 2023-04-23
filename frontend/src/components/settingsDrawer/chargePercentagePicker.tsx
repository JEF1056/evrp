import { Range } from "react-daisyui";
import { useRecoilState } from "recoil";
import { maxChargerPercentageState } from "../../utils/atoms";

function ChargePercentagePicker() {
    const [maxChargePercentage, setMaxChargePercentage] = useRecoilState(maxChargerPercentageState);

    return (
        <div>
            <h1 className="pl-1 pb-2"><b>Charge lvl at charger:</b> {maxChargePercentage} %</h1>
            <input type="range" min="0" max="80" className="range range-accent"
                onChange={(event) => {
                    setMaxChargePercentage(parseInt(event.target.value));
                }}
            />
        </div>
    );
}

export default ChargePercentagePicker;
