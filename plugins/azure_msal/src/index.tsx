import { registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import { PublicClientApplication } from "@azure/msal-browser";
import { Button } from '@material-ui/core';


const clientId = "6db1ca90-3080-4288-80e5-da0c3c63a89f"
const redirectUri = "http://localhost:3000/azure/callback"


const config = {
    auth: {
      clientId: clientId,
      redirectUri: redirectUri,
      postLogoutRedirectUri: "http://localhost:3000",
    },
};
  
function AzureLogin(){
    const loginRequest = {
        scopes: ["https://management.azure.com/user_impersonation"],
        prompt: "select_account",
      };
      
      let accountId = "";
      
      const myMsal = new PublicClientApplication(config);
    
    const handleLogin = () => {
        myMsal
        .loginPopup(loginRequest)
        .then(function (loginResponse) {
          accountId = loginResponse.account.homeAccountId;
            console.log("debug:",accountId);
            console.log("debug:",loginResponse.accessToken)
            fetch("https://management.azure.com/subscriptions?api-version=2020-01-01",{
                headers: {
                    authorization: `Bearer ${loginResponse.accessToken}`
                }
            }).then(res=>res.json()).then(res=>console.log(res)).catch(err=>console.log(err))
          // Display signed-in user content, call API, etc.
        })
        .catch(function (error) {
          //login failure
          console.log(error);
        });
    
    }

    return <Button onClick={()=>handleLogin()}>Login</Button>
}
  

function AzureCallback(){
    return <div>Azure Callback</div>
}

// registerRoute({
//     path: '/azure/callback',
//     name:"Azure Callback",
//     exact: true,
//     noAuthRequired: true,
//     useClusterURL: false,
//     sidebar: null,
//     hideAppBar: true,
//     component: () => <AzureCallback/>,
// })

registerAppBarAction(<AzureLogin/>);
