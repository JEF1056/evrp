import { vehicleInfoState } from "../../utils/atoms";
import { useRecoilValue } from "recoil";
import { Stats } from "react-daisyui";
import { getFramesInOrder } from "../../utils/tripFrameStorage";
import { getEfficiency, getAvgEfficiency } from "../../utils/computeStatistics";
import { vehicleData } from "../../utils/types";

function getMilesTraveled() {
  let nonNullFrames = getFramesInOrder(
    (frame: vehicleData) =>
      frame.distanceTraveledMiles !== undefined &&
      frame.distanceTraveledMiles !== null
  );

  let milesDriven = nonNullFrames
    .map((frame: vehicleData) => frame.distanceTraveledMiles || 0)
    .reduce((a, b) => a + b, 0);

  return milesDriven;
}

function StatsDataComponent() {
  const vehicleInfo = useRecoilValue(vehicleInfoState);

  const efficiency = getEfficiency();
  const avgEfficiency = getAvgEfficiency();
  const milesTraveled = getMilesTraveled();
  const co2SavedPerMile = milesTraveled * 303

  if (vehicleInfo !== undefined) {
    return (
      <Stats className='no-scrollbar rounded-none w-full pb-1 stats-vertical max-h-[14rem] md:max-h-[100rem]'>
        <Stats.Stat>
          <Stats.Stat.Item variant="title">Speed</Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {vehicleInfo.current.speedMilesPerHour.toFixed(2)} mph
          </Stats.Stat.Item>
          <Stats.Stat.Item variant="desc">
            Battery inlet at{" "}
            {((vehicleInfo.current.ambientAirTemperatureMilliC / 1000) * 9) /
              5 +
              32}{" "}
            °F
          </Stats.Stat.Item>
        </Stats.Stat>

        <Stats.Stat>
          <Stats.Stat.Item variant="title">Efficiency</Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {efficiency ? efficiency + " wh/mi" : "No data"}
          </Stats.Stat.Item>
          <Stats.Stat.Item variant="desc">
            {avgEfficiency
              ? `Avg ${avgEfficiency.toFixed(2)} wh/mi | aka ${(
                  1 /
                  (avgEfficiency / 1000)
                ).toFixed(2)} mi/kwh`
              : "No average"}
          </Stats.Stat.Item>
        </Stats.Stat>

        <Stats.Stat>
          <Stats.Stat.Item variant="title">Elevation</Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {vehicleInfo.current.elevation.toFixed(2)} ft
          </Stats.Stat.Item>
          {/* {vehicleInfo.current.elevationChange !== undefined && (
                <Stats.Stat.Item variant="desc">
                  {vehicleInfo.current.elevationChange > 0 ? "↗" : "↘"}{" "}
                  {vehicleInfo.current.elevationChange.toFixed(2)} ft since last
                  update
                </Stats.Stat.Item>
              )} */}
        </Stats.Stat>

        <Stats.Stat>
          <Stats.Stat.Item variant="title">Distance Traveled</Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {milesTraveled.toFixed(2)} miles
          </Stats.Stat.Item>
        </Stats.Stat>

        <Stats.Stat>
          <Stats.Stat.Item variant="title">CO2 Saved</Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            {co2SavedPerMile.toFixed(2)} grams
          </Stats.Stat.Item>
        </Stats.Stat>
      </Stats>
    );
  }

  return <></>;
}

export default StatsDataComponent;
