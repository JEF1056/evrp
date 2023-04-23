import { statsTabState, vehicleInfoState } from "../../utils/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { Card, Tabs } from "react-daisyui";
import StatsDataComponent from "./stats";
import ChartsDataComponent from "./charts";
import RoutesDataComponent from "./routes";

function StatsModalComponent() {
  const vehicleInfo = useRecoilValue(vehicleInfoState);
  const [tabValue, setTabValue] = useRecoilState(statsTabState);

  const tabComponent = () => {
    switch (tabValue) {
      case 0:
        return <StatsDataComponent />;
      case 1:
        return <ChartsDataComponent />;
      case 2:
        return <RoutesDataComponent />;
      default:
        return (
          <Card className="rounded-none bg-base-100 overflow-y-scroll no-scrollbar">
            <Card.Body>
              <Card.Title>Oops! This card wasn't found.</Card.Title>
            </Card.Body>
          </Card>
        );
    }
  };

  if (vehicleInfo !== undefined) {
    return (
      <div className="flex w-screen justify-center">
        <div className="w-11/12 rounded-none absolute bottom-4 md:left-4 md:w-1/4">
          <Tabs
            variant="bordered"
            size="md"
            value={tabValue}
            onChange={setTabValue}
            className="bg-primary rounded-t-lg overflow-x-scroll no-scrollbar"
          >
            <Tabs.Tab value={0}>Stats</Tabs.Tab>
            <Tabs.Tab value={1}>Charts</Tabs.Tab>
            <Tabs.Tab value={2}>Routes</Tabs.Tab>
            <Tabs.Tab value={3}>Charge Readiness</Tabs.Tab>
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
