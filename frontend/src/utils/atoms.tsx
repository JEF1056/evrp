import { atom } from "recoil";
import { historicalVehicleData, routeData } from "./types";
import { recoilPersist } from "recoil-persist";
import { LatLng } from "leaflet";

const { persistAtom } = recoilPersist();

export const centerVehicleState = atom<boolean>({
  key: "centerState",
  default: true,
  effects_UNSTABLE: [persistAtom],
});

export const pathTypeState = atom<string>({
  key: "pathTypeState",
  default: "EFF",
  effects_UNSTABLE: [persistAtom],
});

export const vehicleInfoState = atom<historicalVehicleData | undefined>({
  key: "vehicleInfoState",
  default: undefined,
});

export const mapMaxChargerSpeedState = atom<number>({
  key: "mapMaxChargerSpeedState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const maxChargerPercentageState = atom<number>({
  key: "maxChargerPercentageState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const maxDestinationPercentageState = atom<number>({
  key: "maxDestinationPercentageState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const showSettingsDrawerState = atom<boolean>({
  key: "showSettingsDrawerState",
  default: false,
});

export const statsTabState = atom<number>({
  key: "statsTabState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const currentDestinationState = atom<routeData[] | undefined>({
  key: "currentDestinationState",
  default: undefined,
});
