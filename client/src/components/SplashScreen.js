
import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleLogin = () => {
        auth.toLoginMenu();
    }

    const handleRegister = () => {
        auth.toRegisterMenu();
    }

    const handleGuest = () => {
        auth.loginGuest();
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
                onClick = {handleRegister}
                >Create<br/>Account</button>
            <button
                id="login-button"
                className="splash-screen-button"
                onClick = {handleLogin}
                >Log In</button>
            <button
                id="guest-button"
                className="splash-screen-button"
                onClick = {handleGuest}
                >Continue<br/>as Guest</button>
        </div>
        
    )
}