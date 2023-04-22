import { vehicleData } from "./types";
import {
  getLatestFrame,
  getOldestFrame,
  getFramesInOrder,
} from "./tripFrameStorage";

export function getAvgEfficiency(
  latestFrame?: vehicleData,
  milesTraveled?: number
) {
  if (latestFrame === undefined) {
    latestFrame = getLatestFrame(
      (frame: vehicleData) =>
        frame.efficiency !== undefined && frame.efficiency !== null
    );
  }

  let oldestFrame = getOldestFrame(
    (frame: vehicleData) =>
      frame.efficiency !== undefined && frame.efficiency !== null
  );

  let nonNullFrames = getFramesInOrder(
    (frame: vehicleData) =>
      frame.efficiency !== undefined && frame.efficiency !== null
  );

  let milesDriven =
    nonNullFrames.reduce(
      (acc, frame) => acc + frame.distanceTraveledMiles!,
      0
    ) + (milesTraveled || 0);

  if (latestFrame === undefined || oldestFrame === undefined) {
    return undefined;
  }

  let whUsed =
    ((oldestFrame!.evStateOfChargeMilliPercent -
      latestFrame!.evStateOfChargeMilliPercent) /
      100) *
    77 *
    1.1172413793103448275862068965517;

  return whUsed / milesDriven;
}

export function getEfficiency() {
  let latestFrame = getLatestFrame(
    (frame: vehicleData) =>
      frame.efficiency !== undefined && frame.efficiency !== null
  );

  if (latestFrame === undefined) {
    return undefined;
  }

  return latestFrame.efficiency!.toFixed(2);
}
