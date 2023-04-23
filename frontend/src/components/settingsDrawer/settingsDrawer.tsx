import { useRecoilState } from "recoil";
import { showSettingsDrawerState } from "../../utils/atoms";
import { Drawer } from "react-daisyui";
import ChargeSpeedPicker from "./chargeSpeedPicker";
import DestinationChargePicker from "./destinationpercentagePicker";
import ChargePercentagePicker from "./chargePercentagePicker";
import LogoutButton from "../logout";
import Profile from "./profile";

interface SettingsDrawerComponentProps {
  children: React.ReactNode;
}

function SettingsDrawerComponent(props: SettingsDrawerComponentProps) {
  const [visible, setVisible] = useRecoilState(showSettingsDrawerState);

  return (
    <>
    <Drawer
      side={
       
        <div className="w-fit h-full menu p-4 overflow-y-auto w-96 bg-base-100 text-base-content
        flex flex-col gap-10">
           <b><h1 className="mt-10 text-3xl">Configurations:</h1></b>
        <hr/>
          <ChargeSpeedPicker />
          <DestinationChargePicker/>
          <ChargePercentagePicker/>

          <b><h1 className="md:mt-10 text-3xl">Profile:</h1></b>
        <hr/>
          <Profile />
          <LogoutButton/>
        </div>
      }
      onClickOverlay={() => {
        setVisible(!visible);
      }}
      open={visible}
    >
      {props.children}
    </Drawer>
    </>
  );
}

export default SettingsDrawerComponent;
