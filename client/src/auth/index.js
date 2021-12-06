import React, { useContext,createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_GUEST: "LOGNI_GUEST",
    ERROR_MODAL: "ERROR_MODAL"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        isGuest: false,
        isError: false,
        errorMessage: null
    });
    const history = useHistory();
    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    isGuest: false,
                    isError: false,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isGuest: false,
                    isError: false,
                    errorMessage: null
                })
            }
            case AuthActionType.ERROR_MODAL: {
                return setAuth({
                    user: auth.user,
                    loggedIn: false,
                    isGuest: false,
                    isError: payload.isError,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isGuest: false,
                    isError: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isGuest: false,
                    isError: false,
                    errorMessage: null
                })
            }
            case AuthActionType.LOGIN_GUEST: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isGuest: true,
                    isError: false,
                    errorMessage: null
                })
            }            
            default:
                return auth;
        }
    }

    auth.closeModal = function(){
        authReducer({
            type: AuthActionType.ERROR_MODAL,
            payload: {
                isError: false,
                errorType: null
            }
        });
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }
    auth.toLoginMenu = function(){
        history.push("/login");
    }
    auth.toRegisterMenu = function(){
        history.push("/register");
    }
    
    auth.registerUser = async function(firstName, lastName, username, email, password, passwordVerify) {
        try{
        const response = await api.registerUser(firstName, lastName, email, username, password, passwordVerify);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
        }
    }
        catch(error){
            authReducer({
                type: AuthActionType.ERROR_MODAL,
                payload: {
                    isError: true,
                    errorMessage: error.response.data.errorMessage
                }
            });
        }
    }

    auth.loginGuest = async function (){
        let user = null;
        let response = null;
        try{
            response = await api.loginUser("guest", "1234567890");
        }catch(err){
            console.log("creating guest acct");
            response = await api.registerUser("first", "last", "guest", "guest", "1234567890", "1234567890");      
            if (response.status === 200) {
                console.log("logging guest in");
                response = await api.loginUser("guest", "1234567890");
            }
        }
        console.log("guest: "+response.data.user.email);//scrap
        user=response.data.user;
        authReducer({
            type: AuthActionType.LOGIN_GUEST,
            payload: user
        });
    }


    auth.loginUser = async function(username, password) {
        try{
        const response = await api.loginUser(username, password);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
        }
    }catch(error){
        authReducer({
            type: AuthActionType.ERROR_MODAL,
            payload: {
                isError: true,
                errorMessage: error.response.data.errorMessage
            }
        });
    }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        return initials;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };