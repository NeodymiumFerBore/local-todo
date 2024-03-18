import { Google } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useEffect, useState } from "react";

// npm install @types/google.accounts
import type TokenClient from "@types/google.accounts";

// https://developers.google.com/drive/api/guides/appdata#node.js_1
// https://developers.google.com/drive/api/quickstart/js

export function GoogleGsiImplicitFlowUseEffect() {
  function requestToken() {
    client.requestAccessToken();
  }

  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState<TokenClient>(null);
  const [clientToken, setClientToken] = useState<TokenClient>(null);

  // https://react-native-google-signin.github.io/docs/setting-up/web
  useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://accounts.google.com/gsi/client";
    scriptTag.async = true;
    scriptTag.onload = () => {
      setLoaded(true);
      setClient(
        google.accounts.oauth2.initTokenClient({
          client_id:
            "79951541504-********************************.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/drive.appdata",
          callback: (response) => {
            //console.log(response);
            setClientToken(response);
          },
        })
      );
      console.log("gsi script loaded");
    };
    scriptTag.onerror = () => {
      console.error("Failed to load gsi script");
    };
    document.body.appendChild(scriptTag);
  }, []);

  return (
    <>
      <Button
        onClick={requestToken}
        disabled={!loaded}
        startDecorator={<Google />}
      >
        Sync with Google
      </Button>
      {/* {clientToken ? <p>{JSON.stringify(clientToken)}</p> : <></>} */}
    </>
  );
}
