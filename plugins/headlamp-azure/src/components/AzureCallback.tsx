import { useEffect } from 'react'
import { clientId, redirectUri } from './utils';

async function fetchToken(code: string) {


    const resource = "https://management.core.windows.net/"
    const tenantId = 'common';
    const formData = new FormData();


    formData.append('client_id', clientId);
    formData.append('client_secret', "");
    formData.append('resource', resource);
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', redirectUri);

    const codeVerifier = 'szBvEb_4BIAqMvhz69GbVJF3YuapKId6oZXENblaPDN_bnOp~_vF7CejCHkETShnyeol0VQX_cOUxaKnwgf.iZ5fIECHeVnMiNH_AHUUWWrb6~w1XS4BsoZwGbqhqoDj';
    formData.append('code_verifier', codeVerifier);

    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/token?api-version=1.0`;


    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    })
    return response.json()
}


export function AzureCallback() {

    useEffect(() => {
        (async () => {
            try {
                const code = new URLSearchParams(window.location.search.substring(1)).get('code');
                console.log("debug: code", code)
                const token = await fetchToken(code)
                localStorage.setItem("azure_creds", JSON.stringify(token))
                console.log("debug: token", token)
                window.location.href = "/azure/clusters"
            } catch (err) {
                console.log("debug: error", err)
            }
        })();
    })

    return (<h1>Login Successful redirecting to setup page</h1>)
}
