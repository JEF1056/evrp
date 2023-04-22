import { vehicleData } from "./types";

const vehicleDataPrefix = "vdata-";

export function getFrame(timestamp: number) {
  return JSON.parse(
    localStorage.getItem(vehicleDataPrefix + timestamp.toString())!
  )!;
}

export function getLatestFrame(
  filter?: (frame: vehicleData) => boolean
): vehicleData | undefined {
  let filteredFrames = getFramesInOrder(filter);
  if (filteredFrames.length > 0) {
    let timestmaps = filteredFrames.map((frame) => frame.timestamp);
    let lastTimestamp = Math.max(...timestmaps);
    return getFrame(lastTimestamp);
  }

  return undefined;
}

export function getOldestFrame(
  filter?: (frame: vehicleData) => boolean
): vehicleData | undefined {
  let filteredFrames = getFramesInOrder(filter);
  if (filteredFrames.length > 0) {
    let timestmaps = filteredFrames.map((frame) => frame.timestamp);
    let lastTimestamp = Math.min(...timestmaps);
    return getFrame(lastTimestamp);
  }

  return undefined;
}

export function getFramesInOrder(
  filter?: (frame: vehicleData) => boolean
): vehicleData[] {
  let historicalTimestamps = Object.entries(localStorage);
  if (historicalTimestamps.length > 0) {
    let sortedTimestamps = historicalTimestamps
      .filter((ts) => {
        if (ts[0].startsWith(vehicleDataPrefix)) {
          return ts[0];
        }

        return undefined;
      })
      .map((ts) => parseFloat(ts.toString().slice(vehicleDataPrefix.length)))
      .sort();

    let frames: vehicleData[] = [];

    sortedTimestamps.forEach((timestamp, _) => {
      var passFilter = true;
      let frame = getFrame(timestamp);

      if (filter) {
        passFilter = filter(frame);
      }

      if (passFilter) {
        frames.push(frame);
      }
    });

    return frames;
  }

  return [];
}

export function setFrame(frame: vehicleData) {
  localStorage.setItem(
    vehicleDataPrefix + frame.timestamp.toString(),
    JSON.stringify(frame)
  );

  clearFrames((f: vehicleData) => f.timestamp > frame.timestamp);
}

export function clearFrames(filter?: (frame: vehicleData) => boolean) {
  let filteredFrames = getFramesInOrder(filter);

  filteredFrames.forEach((frame: vehicleData) => {
    localStorage.removeItem(vehicleDataPrefix + frame.timestamp.toString());
  });
}

export function getLastSeenUuids() {
  let data = localStorage.getItem("after");

  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      localStorage.setItem("after", "{}")
    }
  }

  return {};
}

export function setLastSeenUuids(data: { [key: string]: string }) {
  if (data !== undefined) {
    localStorage.setItem("after", JSON.stringify(data));
  }
}
