import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    if (auth.loggedIn||auth.isGuest)
        return <HomeScreen />
    else
        return <SplashScreen />
}