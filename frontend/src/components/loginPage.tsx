import LoginButton from "./login";
import {Hero} from "react-daisyui";

const ShowLoginPage = () => {  
  return(
    <Hero className="w-screen h-screen">
      <Hero.Content className="text-center">
        <div className="loginPage">
          <div className="loginPage__container">
            <div className="loginPage__container__logo">
              <img src={"./icons/cuteporthead"} alt="logo" />
            </div>
            <div className="loginPage__container__login">
              <LoginButton />
            </div>
          </div>
        </div>
      </Hero.Content>
    </Hero>
  );
};

export default ShowLoginPage;