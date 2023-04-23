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

export interface feedResponseType {
  data: vehicleData[];
  after: { [key: string]: string }; //TODO: do not use any types
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

export interface routeData {
  summary: routeSummary;
  legs: routeLegData[];
}

export interface routeSummary {
  lengthInMeters: number;
  travelTimeInSeconds: number;
  trafficDelayInSeconds: number;
  trafficLengthInMeters: number;
  departureTime?: string;
  arrivalTime?: string;
  batteryConsumptionInkWh: number;
  remainingChargeAtArrivalInkWh: number;
  totalChargingTimeInSeconds: number;
}

export interface routeLegData {
  summary: routeLegSummary;
  points: {
    latitude: number;
    longitude: number;
  }[];
}

export interface routeLegSummary {
  lengthInMeters: number;
  travelTimeInSeconds: number;
  trafficDelayInSeconds: number;
  trafficLengthInMeters: number;
  batteryConsumptionInkWh: number;
  remainingChargeAtArrivalInkWh: number;
  chargingInformationAtEndOfLeg: {
    chargingConnectionInfo: routeLegChargingConnector;
    targetChargeInkWh: number;
    chargingTimeInSeconds: number;
    chargingParkName: string;
    chargingParkPowerInkW: number;
  };
}

export interface routeLegChargingConnector {
  chargingVoltageInV: number;
  chargingCurrentInA: number;
  chargingCurrentType: string;
  chargingPowerInkW: number;
  chargingPlugType: string;
}
