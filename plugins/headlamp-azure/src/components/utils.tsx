

export const clientId = "6db1ca90-3080-4288-80e5-da0c3c63a89f"
export const redirectUri = "http://localhost:3000/azure/callback"


export function isTokenValid(): boolean {
    const creds = localStorage.getItem("azure_creds")
    const tokens = JSON.parse(creds)
    return Date.now() < (tokens?.expires_on * 1000)
}


export async function accessToken(): Promise<string> {

    const creds = localStorage.getItem("azure_creds")
    const tokens = JSON.parse(creds)
    console.log("debug: checking if token is valid", Date.now(), tokens?.expires_on * 1000, Date.now() > (tokens?.expires_on * 1000), isTokenValid(), tokens?.access_token)
    if (isTokenValid()) {
        return tokens?.access_token || ""
    }

    // use refresh token to get new token
    const url = `https://login.microsoftonline.com/common/oauth2/token?api-version=1.0`;
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('client_secret', "");
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', tokens?.refresh_token);

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    })

    const data = await response.json()
    localStorage.setItem("azure_creds", JSON.stringify(data))
    return data?.access_token || ""
}
