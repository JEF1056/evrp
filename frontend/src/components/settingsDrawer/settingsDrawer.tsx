import { useRecoilState } from "recoil";
import { showSettingsDrawerState } from "../../utils/atoms";
import { Drawer } from "react-daisyui";
import ChargeSpeedPicker from "./chargeSpeedPicker";
import DestinationChargePicker from "./destinationpercentagePicker";

interface SettingsDrawerComponentProps {
  children: React.ReactNode;
}

function SettingsDrawerComponent(props: SettingsDrawerComponentProps) {
  const [visible, setVisible] = useRecoilState(showSettingsDrawerState);

  return (
    <Drawer
      side={
        <div className="menu p-4 overflow-y-auto w-96 bg-base-100 text-base-content">
          <ChargeSpeedPicker />
          <DestinationChargePicker/>
        </div>
      }
      onClickOverlay={() => {
        setVisible(!visible);
      }}
      open={visible}
    >
      {props.children}
    </Drawer>
  );
}

export default SettingsDrawerComponent;
