import { Button } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useState } from 'react';
import { clientId, redirectUri } from './utils';
import { withMsal,useIsAuthenticated } from "@azure/msal-react";
import { Configuration,  PublicClientApplication,RedirectRequest } from "@azure/msal-browser";


const config:Configuration ={
    auth:{
        clientId: clientId,
        authority: "https://login.microsoftonline.com/common",
        redirectUri: redirectUri,
        
    },
}

function login(){
    const isAuthenticated = useIsAuthenticated()
    console.log("debug: isAuthenticated", isAuthenticated)
    const msalInstance = new PublicClientApplication(config)

    const loginRequest:RedirectRequest = {
        redirectUri: redirectUri,
        prompt: "select_account",
        scopes:["openid","profile","User.Read"],
    }

    return <button onClick={()=>msalInstance.loginRedirect(loginRequest)}>Login</button>
}

export function AzureLogin(){
    return login()
}

/*
function loginUrl(): string {
    const queryParams = new URLSearchParams();
    queryParams.append('response_type', 'code');
    queryParams.append('client_id', clientId);
    queryParams.append('redirect_uri', redirectUri);
    queryParams.append('state', 'test');
    queryParams.append('prompt', 'select_account');
    queryParams.append('sso_reload', 'true');


    queryParams.append('code_challenge', 'j6xg4T4BOnAqXZEiclkZe_h1wgwFdzV88y1WLy14Wn8');
    queryParams.append('code_challenge_method', 'S256');

    return `https://login.microsoftonline.com/common/oauth2/authorize?${queryParams.toString()}`
}



function isLoggedIn(): boolean {
    const creds = localStorage.getItem("azure_creds")
    const tokens = JSON.parse(creds)
    if (tokens) {
        return tokens?.access_token !== ""
    }
    return false
}

function logout() {
    localStorage.removeItem("azure_creds")
}



export function AzureLogin() {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const menuItems = []
    if (isLoggedIn()) {
        menuItems.push(<MenuItem onClick={() => { window.location.href = "/azure/clusters" }}>Choose Clusters</MenuItem>)
        menuItems.push(<MenuItem onClick={() => { logout(); handleClose() }}>Logout</MenuItem>)
    } else {
        menuItems.push(<MenuItem onClick={() => { window.location.href = loginUrl() }}>Login</MenuItem>)
    }

    return (
        <>
            <Button onClick={(e) => { handleClick(e) }}>
                <img src="https://code.benco.io/icon-collection/azure-docs/azure.svg" alt="Azure menu" height="40em" width="40em" />
            </Button>
            <Menu
                style={{ paddingTop: "50em" }}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {menuItems}
            </Menu>
        </>
    )
}
*/