import { Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { bathroomData } from "../utils/types";

import { Icon } from "leaflet";
import bathroomSvg from "../icons/bathroom.svg";

const bathroomIcon = new Icon({
  iconUrl: bathroomSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

interface BathroomsComponentProps {
  latitude: number;
  longitude: number;
}

function BathroomsComponent(props: BathroomsComponentProps) {
  const [bathrooms, setBathrooms] = useState<bathroomData[]>();

  const map = useMap();

  useEffect(() => {
    var temp: bathroomData[];

    const base_url = `https://api.tomtom.com/search/2/poiSearch/bathroom.json?`;
    const poiSearchParams = new URLSearchParams({
      limit: "100",
      categorySet: "9932005",
      relatedPois: "all",
      countrySet: "US",
      radius: "10000",
      lat: props.latitude.toString(),
      lon: props.longitude.toString(),
      key: "6CyE7TqPGbhqdig0YIOxKcnwpSoI88PW",
    });

    fetch(base_url + poiSearchParams)
      .then((response) => response.json())
      .then((response: any) => {
        console.log(response);
        temp = response.results.map((result: any) => {
          return {
            latitude: result.position.lat,
            longitude: result.position.lon,
          };
        });

        console.log(temp);
        setBathrooms(temp);
      });
  }, [map]);

  return (
    <>
      {bathrooms &&
        bathrooms.map((bathroom: bathroomData) => {
          return (
            <Marker
              position={[bathroom.latitude, bathroom.longitude]}
              icon={bathroomIcon}
            />
          );
        })}
    </>
  );
}

export default BathroomsComponent;
