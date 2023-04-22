import { MapContainer, TileLayer } from "react-leaflet";
import "./App.css";
import "./leaflet/leaflet.css";
import Vehicle from "./components/vehicle";
import StatsModalComponent from "./components/statsModal/statsModal";
import ControlModalComponent from "./components/controlModal";
import VehiclePathComponent from "./components/vehiclePath";
import EvStationsComponent from "./components/evStations";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function App() {
  console.log(process.env.NODE_ENV);
  const handle = useFullScreenHandle();

  return (
    <FullScreen handle={handle}>
      <div className="relative">
        <div className="relative z-0">
          <MapContainer
            className="full-height-map"
            center={[0, 0]}
            zoom={13}
            scrollWheelZoom={true}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url={
                process.env.NODE_ENV === "development"
                  ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                  : "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=ef50a344-931b-4eef-98e5-8c000faab8b6"
              }
            />

            <EvStationsComponent minKw={0} />

            <VehiclePathComponent />
            <Vehicle />
          </MapContainer>
        </div>

        <div className="z-1">
          <ControlModalComponent fullScreenHandle={handle} />
          <StatsModalComponent />
        </div>
      </div>
    </FullScreen>
  );
}

export default App;
