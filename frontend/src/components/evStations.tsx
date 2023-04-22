import { Marker, Popup, useMap } from "react-leaflet";
import { centerVehicleState } from "../utils/atoms";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { chargerData, connectorData } from "../utils/types";

import { Icon } from "leaflet";
import chargerSlowSvg from "../icons/charger-slow.svg";
import chargerFastSvg from "../icons/charger-fast.svg";
import chargerRapidSvg from "../icons/charger-rapid.svg";

const chargerSlowIcon = new Icon({
  iconUrl: chargerSlowSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

const chargerFastIcon = new Icon({
  iconUrl: chargerFastSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

const chargerRapidIcon = new Icon({
  iconUrl: chargerRapidSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

interface EvStationsProps {
  minKw: number;
}

function EvStationsComponent(props: EvStationsProps) {
  const centerVehicle = useRecoilValue(centerVehicleState);
  const [mapCenter, setMapCenter] = useState();
  const [evStations, setEvStations] = useState<chargerData[]>();

  const map = useMap();

  useEffect(() => {
    if (centerVehicle === false) {
      map.on("moveend", (event) => {
        if (event.sourceTarget.getCenter() !== event.target.getCenter()) {
          setMapCenter(event.target.getCenter());
        }
      });

      const bounds = map.getBounds();

      const base_url = `https://api.tomtom.com/search/2/poiSearch/charging%20station.json?`;
      const poiSearchParams = new URLSearchParams({
        limit: "100",
        categorySet: "7309",
        relatedPois: "all",
        countrySet: "US",
        topLeft: `${bounds.getNorthWest().lat},${bounds.getNorthWest().lng}`,
        btmRight: `${bounds.getSouthEast().lat},${bounds.getSouthEast().lng}`,
        minPowerKW: props.minKw.toString(),
        key: "6CyE7TqPGbhqdig0YIOxKcnwpSoI88PW",
      });

      if (centerVehicle === false) {
        fetch(base_url + poiSearchParams)
          .then((response) => response.json())
          .then((response: any) => {
            console.log(response);
            var temp: chargerData[] = response.results.map((result: any) => {
              return {
                latitude: result.position.lat,
                longitude: result.position.lon,
                connectors: result.chargingPark.connectors,
                score: result.score,
                chargingOperator: result.poi,
              };
            });

            setEvStations(temp);
          });
      }
    }
  }, [map, centerVehicle, mapCenter]);

  return (
    <>
      {evStations &&
        evStations.map((station: chargerData) => {
          let avgConnectorKw: number =
            station.connectors
              .map((connector: connectorData) => connector.ratedPowerKW)
              .reduce((a, b) => a + b) || 0 / station.connectors.length;

          var icon = chargerSlowIcon;
          if (avgConnectorKw < 50) {
            icon = chargerSlowIcon;
          } else if (avgConnectorKw >= 50 && avgConnectorKw < 125) {
            icon = chargerFastIcon;
          } else if (avgConnectorKw >= 125) {
            icon = chargerRapidIcon;
          } else {
            console.log(avgConnectorKw)
            console.log("Error: No icon found for connector");
          }

          return (
            <Marker
              position={[station.latitude, station.longitude]}
              icon={icon}
            >
              <Popup>
                {station.chargingOperator.name}
                <br />
                Avg handle speed: {avgConnectorKw}
                <br />
                Score: {station.score}
              </Popup>
            </Marker>
          );
        })}
    </>
  );
}

export default EvStationsComponent;
