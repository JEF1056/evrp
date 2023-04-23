import { MapContainer, TileLayer } from "react-leaflet";
import "./App.css";
import "./leaflet/leaflet.css";
import Vehicle from "./components/vehicle";
import StatsModalComponent from "./components/statsModal/statsModal";
import ControlModalComponent from "./components/controlModal/controlModal";
import VehiclePathComponent from "./components/vehiclePath";
import EvStationsComponent from "./components/evStations";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SettingsDrawerComponent from "./components/settingsDrawer/settingsDrawer";
import LoadingScreen from "./components/loadingMapScreen";
import ShowLoginPage from "./components/loginPage";
import { useRecoilValue } from "recoil";
import { vehicleInfoState } from "./utils/atoms";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DestinationPathComponent from "./components/destinationPath";
import BathroomsComponent from "./components/bathrooms";
import RestaurantsComponent from "./components/restaurants";

function App() {
  useEffect(() => {
    console.log(process.env.NODE_ENV);
  }, []);

  const handle = useFullScreenHandle();
  const vehicleInfo = useRecoilValue(vehicleInfoState);
  const authenticated = useAuth0().isAuthenticated;

  return (
    <FullScreen handle={handle}>
      {authenticated === false ? (
        <ShowLoginPage />
      ) : vehicleInfo === undefined ? (
        <LoadingScreen />
      ) : (
        <SettingsDrawerComponent>
          <div className="relative">
            <div className="relative z-0">
              <MapContainer
                className="full-height-map"
                center={[
                  vehicleInfo.current.latitude,
                  vehicleInfo.current.longitude,
                ]}
                zoom={13}
                scrollWheelZoom={true}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url={
                    process.env.NODE_ENV === "development"
                      ? "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                      : "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=ef50a344-931b-4eef-98e5-8c000faab8b6"
                  }
                />

                <EvStationsComponent />

                <VehiclePathComponent />
                <DestinationPathComponent />
                <Vehicle />

              </MapContainer>
            </div>

            <div className="z-1">
              <ControlModalComponent fullScreenHandle={handle} />
              <StatsModalComponent />
            </div>
          </div>
        </SettingsDrawerComponent>
      )}
    </FullScreen>
  );
}

export default App;
