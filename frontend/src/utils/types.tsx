export interface vehicleData {
  latitude: number;
  longitude: number;
  reverseGeo: string;
  speedMilesPerHour: number;
  isEcuSpeed?: boolean;
  headingDegrees: number;
  ambientAirTemperatureMilliC: number;
  engineStates: string;
  elevation: number;
  timestamp: number;
  evStateOfChargeMilliPercent: number;

  distanceTraveledMiles?: number;
  efficiency?: number;
  avgEfficiency?: number;
  elevationChange?: number;
  evStateOfChargeChanged: boolean;
}

export interface historicalVehicleData {
  current: vehicleData;
  previous?: vehicleData;
}

export interface bathroomData {
  latitude: number;
  longitude: number;
}

export interface restaurantData {
  latitude: number;
  longitude: number;
}

export interface chargerData {
  latitude: number;
  longitude: number;
  connectors: connectorData[];
  score: number;
  chargingOperator: chargingOperatorData;
}

export interface chargingOperatorData {
  name: string;
  phone?: string;
  website?: string;
}

export interface connectorData {
  connectorType: string; //TODO: make this an enum later
  ratedPowerKW: number;
  voltageV: number;
  currentA: number;
  currentType: string; //TODO: make this an enum later
}
