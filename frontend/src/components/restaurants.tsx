import { Marker, useMap } from "react-leaflet";
import { centerVehicleState } from "../utils/atoms";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { bathroomData} from "../utils/types";

import { Icon } from "leaflet";
import restaurantSvg from "../icons/restaurant.svg";

const bathroomIcon = new Icon({
  iconUrl: restaurantSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

interface BathroomProps {
  minKw: number;
}

function BathroomsComponent(props: BathroomProps) {
  const centerVehicle = useRecoilValue(centerVehicleState);
  const [mapCenter, setMapCenter] = useState();
  const [bathrooms, setBathrooms] = useState<bathroomData[]>();

  const map = useMap();

  useEffect(() => {
    if (centerVehicle === false) {
      map.on("moveend", (event: any) => {
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
            var temp: bathroomData[] = response.results.map((result: any) => {
              return {
                latitude: result.position.lat,
                longitude: result.position.lon,
              };
            });

            setBathrooms(temp);
          });
      }
    }
  }, [map, centerVehicle, mapCenter]);

  return (
    <>
      {bathrooms &&
        bathrooms.map((bathroom: bathroomData) => {

          return (
            <Marker
              position={[bathroom.latitude, bathroom.longitude]}
              icon={bathroomIcon}
            >
            </Marker>
          );
        })}
    </>
  );
}

export default BathroomsComponent;