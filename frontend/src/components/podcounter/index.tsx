import {
  Configuration,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import React from 'react';

function signInClickHandler(instance: IPublicClientApplication) {
  instance.loginRedirect();
}

// SignInButton Component returns a button that invokes a popup login when clicked
function SignInButton() {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal();
  return <button onClick={() => signInClickHandler(instance)}>Sign In</button>;
}

const msalConfig: Configuration = {
  auth: {
    clientId: 'a543563a-a72e-4348-9408-84ea499f7c50',
    authority: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47',
    redirectUri: 'headlamp://redirect',
    postLogoutRedirectUri: '/',
  },

  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    asyncPopups: false,
  },
};

const pca = new PublicClientApplication(msalConfig);

function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
}
console.log(pca);

function PodCounterRenderer() {
  const { desktopApi } = window;
  console.log('I am a desktopApi', desktopApi);
  const { instance } = useMsal();
  React.useEffect(() => {
    if (desktopApi) {
      desktopApi.receive('auth_code', (authConfig: { authCode: string; clientInfo: string }) => {
        const { authCode } = authConfig;
        console.log(authCode);
        instance
          .acquireTokenByCode({ code: authCode, redirectUri: 'headlamp://redirect' })
          .then(response => {
            console.log('acquire token by code completed ', response);
          })
          .catch(error => {
            console.log('acquiring token by code errror ', error);
          });
      });
    }
    instance
      .handleRedirectPromise()
      .then(token => {
        console.log('redirect promise token ', token);
      })
      .catch(error => {
        console.log('error in redirect promise ', error);
      });
  }, [desktopApi]);
  return (
    <>
      <AuthenticatedTemplate>
        <p>This will only render if a user is signed-in.</p>
        <WelcomeUser />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>This will only render if a user is not signed-in.</p>
        <SignInButton />
      </UnauthenticatedTemplate>
    </>
  );
}

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
function PodCounter() {
  return (
    <MsalProvider instance={pca}>
      <PodCounterRenderer />
    </MsalProvider>
  );
}

export default PodCounter;
