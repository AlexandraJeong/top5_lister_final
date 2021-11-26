import { loginUser } from "../auth/auth-request-api";
import { useContext, useState } from 'react';
import AuthContext from '../auth';

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);

    const loginMenu = () => {
        auth.toLoginMenu();
    }

    const registerMenu = () => {
        auth.toRegisterMenu();
    }
    return (
        <div id="splash-screen">
            The Top 5<br />
            Lister
            <div id = "description-text">Utilize to create your own top 5 lists and view/respond to other's lists.</div>
            <div id = "name-text">Alexandra Jeong</div>
            <button
                id="create-account-button"
                className="splash-screen-button"
                onClick = {registerMenu}
                >Create<br/>Account</button>
            <button
                id="login-button"
                className="splash-screen-button"
                onClick = {loginMenu}
                >Log In</button>
            <button
                id="guest-button"
                className="splash-screen-button"
                //onClick = {loginAsGuest}
                >Continue<br/>as Guest</button>
        </div>
        
    )
}