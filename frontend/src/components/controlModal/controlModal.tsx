import { showSettingsDrawerState, vehicleInfoState } from "../../utils/atoms";
import { useRecoilState } from "recoil";
import { Card, Countdown, Select, Progress, Button } from "react-daisyui";
import { centerVehicleState, pathTypeState } from "../../utils/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMap,
  faLocationArrow,
  faGear,
  faBroom,
  faMaximize,
  faMinimize,
} from "@fortawesome/free-solid-svg-icons";
import { clearFrames } from "../../utils/tripFrameStorage";
import { getAvgEfficiency } from "../../utils/computeStatistics";
import { FullScreenHandle } from "react-full-screen";
import SearchBar from "./searchBar";

interface ControlModalComponentProps {
  fullScreenHandle: FullScreenHandle;
}

function ControlModalComponent(props: ControlModalComponentProps) {
  const [pathYypeState, setPathTypeState] = useRecoilState(pathTypeState);
  const [vehicleInfo, setVehicleInfo] = useRecoilState(vehicleInfoState);
  const [centerVehicle, setCenterVehicle] = useRecoilState(centerVehicleState);
  const [showSettingsDrawer, setShowSettingsDrawer] = useRecoilState(
    showSettingsDrawerState
  );

  const avgEfficiency = getAvgEfficiency();

  if (vehicleInfo === undefined) {
    return <></>;
  }

  return (
    <div className="flex w-screen justify-center lg:-justify-center">
      <Card className="w-11/12 lg:w-fit absolute top-4 lg:right-4 bg-base-100">
        <Card.Body className="px-6 py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-row items-center gap-2">
              <SearchBar />
              <Button
                className="btn-square"
                onClick={
                  props.fullScreenHandle.active
                    ? props.fullScreenHandle.exit
                    : props.fullScreenHandle.enter
                }
              >
                <FontAwesomeIcon
                  icon={props.fullScreenHandle.active ? faMinimize : faMaximize}
                />
              </Button>
            </div>

            <div className="flex flex-row items-center gap-2">
              <Select
                value={pathYypeState}
                onChange={(event) => {
                  console.log("huh");
                  setPathTypeState(event.target.value);
                }}
              >
                <Select.Option value={"EFF"}>Efficiency</Select.Option>
                <Select.Option value={"SOC"}>State of Charge</Select.Option>
                <Select.Option value={"SPD"}>Speed</Select.Option>
                <Select.Option value={"ELEV"}>Elevation</Select.Option>
                <Select.Option value={"ELEVGAIN"}>Elevation Gain</Select.Option>
              </Select>

              <Button
                className="btn-square"
                onClick={() => setCenterVehicle(!centerVehicle)}
              >
                <FontAwesomeIcon
                  icon={centerVehicle ? faMap : faLocationArrow}
                />
              </Button>

              <Button
                className="btn-square"
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              >
                <FontAwesomeIcon icon={faGear} />
              </Button>
              <Button
                className="btn-square"
                onClick={() => {
                  setVehicleInfo(undefined);
                  clearFrames();
                }}
              >
                <FontAwesomeIcon icon={faBroom} />
              </Button>
            </div>

            <div className="flex flex-row items-center gap-2 w-full">
              <div className="flex flex-row items-center">
                <Countdown
                  value={Math.round(
                    vehicleInfo.current.evStateOfChargeMilliPercent / 1000
                  )}
                />
                %
              </div>
              <Progress
                className="w-full progress-accent"
                max={100}
                value={Math.round(
                  vehicleInfo.current.evStateOfChargeMilliPercent / 1000
                )}
              />
              <div className="flex flex-row items-center">
                {avgEfficiency === undefined
                  ? "N/A"
                  : Math.round(
                      (77000 / avgEfficiency) *
                        (vehicleInfo.current.evStateOfChargeMilliPercent /
                          100000)
                    )}
                <span className="pl-1">mi</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ControlModalComponent;
