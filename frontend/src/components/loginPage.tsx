import LoginButton from "./login";
import {Hero} from "react-daisyui";

const ShowLoginPage = () => {  
  return(
    <Hero className="w-screen h-screen">
      <Hero.Content className="flex-col lg:flex-row">
        <img src={"/cuteporthead.png"} alt="logo" />
          <div>
            <div className="loginPage__container__login">
              <LoginButton />
            </div>
          </div>
      </Hero.Content>
    </Hero>
  );
};

export default ShowLoginPage;