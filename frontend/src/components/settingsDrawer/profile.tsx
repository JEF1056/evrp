import { Avatar } from "react-daisyui";
import { useAuth0 } from "@auth0/auth0-react";

function Profile (){
    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return <div>Please log in to view your profile.</div>;
    }

    return(
        <div className=" flex flex-col items-center">
        <Avatar src={user && user.picture}/>
        <h1 className="md:text-lg md:p-3">{user && user.name}</h1>
        </div>
    );
}

export default Profile;