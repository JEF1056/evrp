import { Hero, Progress } from "react-daisyui";

const LoadingScreenComponent = () => {  
    return (
        <Hero className="w-screen h-screen">
            <Hero.Content className="text-center">
                <div className="max-w-md">
                <h1 className="text-5xl font-bold pb-6">EVEE</h1>
                <Progress color="primary" className="w-48" />
                </div>
            </Hero.Content>
        </Hero>
    );
  };

export default LoadingScreenComponent;
