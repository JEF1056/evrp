import { Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { restaurantData, routeLegData } from "../utils/types";

import { Icon } from "leaflet";
import restaurantSvg from "../icons/restaurant.svg";

const restaurantIcon = new Icon({
  iconUrl: restaurantSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

interface RestaurantsComponentProps {
  latitude: number;
  longitude: number;
}

function RestaurantsComponent(props: RestaurantsComponentProps) {
  const [restaurants, setRestaurants] = useState<restaurantData[]>();

  const map = useMap();

  useEffect(() => {
    var temp: restaurantData[];

    const base_url = `https://api.tomtom.com/search/2/poiSearch/food.json?`;
    const poiSearchParams = new URLSearchParams({
      limit: "100",
      categorySet: "7315",
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
        setRestaurants(temp);
      });
  }, [map]);

  return (
    <>
      {restaurants &&
        restaurants.map((restaurant: restaurantData) => {
          return (
            <Marker
              position={[restaurant.latitude, restaurant.longitude]}
              icon={restaurantIcon}
            />
          );
        })}
    </>
  );
}

export default RestaurantsComponent;
