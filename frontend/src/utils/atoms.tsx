import { atom } from "recoil";
import { historicalVehicleData } from "./types";
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

export const showSettingsDrawerState = atom<boolean>({
    key: "showSettingsDrawerState",
    default: false,
});