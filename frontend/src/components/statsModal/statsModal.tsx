import { vehicleInfoState } from "../../utils/atoms";
import { useRecoilValue } from "recoil";
import { Tabs } from "react-daisyui";
import { useState } from "react";
import StatsDataComponent from "./stats";
import ChartsDataComponent from "./charts";

function StatsModalComponent() {
  const vehicleInfo = useRecoilValue(vehicleInfoState);
  const [tabValue, setTabValue] = useState(0);

  const tabComponent = () => {
    switch (tabValue) {
      case 0:
        return <StatsDataComponent />;
      case 1:
        return <ChartsDataComponent />;
      default:
        return <StatsDataComponent />;
    }
  };

  if (vehicleInfo !== undefined) {
    return (
      <div className="flex w-screen justify-center">
        <div className="w-11/12 lg:w-fit absolute bottom-4 lg:right-4 py-none">
          <Tabs
            variant="bordered"
            size="md"
            value={tabValue}
            onChange={setTabValue}
            className="bg-primary rounded-t-lg"
          >
            <Tabs.Tab value={0}>Stats</Tabs.Tab>
            <Tabs.Tab value={1}>Charts</Tabs.Tab>
            <Tabs.Tab value={2}>Destinations</Tabs.Tab>
          </Tabs>

          {tabComponent()}

          <p className="px-6 py-2 bg-primary rounded-b-lg">
            Last updated:{" "}
            {new Date(vehicleInfo.current.timestamp * 1000).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return <></>;
}

export default StatsModalComponent;
