/*
import LoginButton from "./login";
import {Hero} from "react-daisyui";

const ShowLoginPage = () => {  
  return(
    <Hero className="w-screen h-screen">
      <Hero.Content className="flex-col lg:flex-row">
        <img src={"/babyelectricplug-removebg-preview.png"} alt="logo" />
          <div>
            <div className="loginPage__container__login">
              <h1 className="prose prose-slate prose-xl">EVEE</h1>
              <LoginButton />
            </div>
          </div>
      </Hero.Content>
    </Hero>
  );
};

export default ShowLoginPage;
*/
import LoginButton from "./login";
import { Hero } from "react-daisyui";

const ShowLoginPage = () => {
  return (
    <Hero className="w-screen h-screen">
      <Hero.Content className="flex-col lg:flex-row">
        <img src={"/babyelectricplug-removebg-preview.png"} alt="logo" />
        <div className="loginPage__container__login flex flex-col justify-center items-center gap-4">
          <h1 className="text-5xl font-bold text-center text-orange-200">EVEE</h1>
          <LoginButton />
        </div>
      </Hero.Content>
    </Hero>
  );
};

export default ShowLoginPage;