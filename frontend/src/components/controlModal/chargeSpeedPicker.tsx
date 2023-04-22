import { Range } from "react-daisyui";
import { useRecoilState } from "recoil";
import { mapMaxChargerSpeedState } from "../../utils/atoms";

function ChargeSpeedPicker() {
  const [maxSpeed, setMaxSpeed] = useRecoilState(mapMaxChargerSpeedState);

  const speeds = [0, 50, 125, 250, 350];

  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <div className="flex flex-row items-center">{maxSpeed} kw</div>
      <Range step={Math.ceil(100/speeds.length)} onChange={(event) => console.log(event)} />
    </div>
  );
}

export default ChargeSpeedPicker;
