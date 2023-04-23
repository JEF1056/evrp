import { Range } from "react-daisyui";
import { useRecoilState } from "recoil";
import { mapMaxChargerSpeedState } from "../../utils/atoms";

function ChargeSpeedPicker() {
  const [maxSpeed, setMaxSpeed] = useRecoilState(mapMaxChargerSpeedState);

  const speeds = [0, 50, 125, 250, 350];
  const step = Math.ceil(100 / (speeds.length - 1));

  return (
    <div>
      <h1 className="pl-1 pb-2"><b>Charger minimum speed:</b> {maxSpeed} kW</h1>
      <Range
        className="range range-accent"
        size="sm"
        step={step}
        onChange={(event) => {
          setMaxSpeed(speeds[parseInt(event.target.value) / step]);
        }}
        value={speeds.indexOf(maxSpeed) * step}
      />
    </div>

  );
}

export default ChargeSpeedPicker;
