import { Range } from "react-daisyui";
import { useRecoilState } from "recoil";
import { maxDestinationPercentageState } from "../../utils/atoms";

function DestinationChargePicker() {
  const [maxDestPercentage, setMaxDestPercentage] = useRecoilState(maxDestinationPercentageState);

  return (
    <div>
    <h1 className="pl-1 pb-2"><b>Charge lvl at destination:</b> {maxDestPercentage} %</h1>
      <input type="range" min="0" max="80" className="range range-accent" 
        onChange={(event) => {
            setMaxDestPercentage(parseInt(event.target.value));
          }}
      />
    </div>
  );
}

export default DestinationChargePicker;
