import { Range } from "react-daisyui";
import { useRecoilState } from "recoil";
import { mapMaxChargerSpeedState } from "../../utils/atoms";

function ChargePercentagePicker() {
  const [maxSpeed, setMaxSpeed] = useRecoilState(mapMaxChargerSpeedState);

  const speeds = [0, 50, 125, 250, 350];
  const step = Math.ceil(100 / (speeds.length - 1));

  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <div className="flex flex-row items-center">{maxSpeed} kw</div>
      <div className="flex flex-col w-full">
        <Range
          size="sm"
          step={step}
          onChange={(event) => {
            setMaxSpeed(speeds[parseInt(event.target.value) / step]);
          }}
          value={speeds.indexOf(maxSpeed) * step}
        />
      </div>
    </div>
  );
}

export default ChargePercentagePicker;
