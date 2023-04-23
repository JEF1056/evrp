import { Range } from "react-daisyui";
import { useRecoilState } from "recoil";
import { mapMaxChargerSpeedState } from "../../utils/atoms";

function DestinationChargePicker() {
  const [maxPercentage, setMaxPercentage] = useRecoilState(mapMaxChargerSpeedState);

  const speeds = [0, 10, 125, 250, 350];
  const step = Math.ceil(100 / (speeds.length - 1));

  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <div className="flex flex-row items-center">{maxPercentage} %</div>
      <div className="flex flex-col w-full">
      <input type="range" min="0" max="100" className="range range-accent" 
        // onChange={(event) => {
        //     setMaxPercentage(event.target.value);
        //   }}
      />
      </div>
    </div>
  );
}

export default DestinationChargePicker;
