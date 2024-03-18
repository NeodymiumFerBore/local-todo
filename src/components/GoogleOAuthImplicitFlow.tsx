import { AddToDrive, Google } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";

// npm install @react-oauth/google @types/google.accounts
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import { useState } from "react";

export function GoogleOAuthImplicitFlow() {
  // default scopes: email profile openid
  const [loggedIn, setLoggedIn] = useState(Boolean);
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>();

  const login = useGoogleLogin({
    overrideScope: true, // Without this, we would also request scopes email, profile and openid
    scope: "https://www.googleapis.com/auth/drive.appdata",
    onSuccess: (res) => {
      console.log(res);
      setLoggedIn(true);
      setTokenResponse(res);
    },
  });
  function logout() {
    if (loggedIn) {
      googleLogout();
      // revoke() completely "unregister" the app as trusted by the user
      // if (tokenResponse) {
      //   google?.accounts?.oauth2?.revoke(tokenResponse.access_token, () => {
      console.log("Logged out");
      setLoggedIn(false);
      //   });
      // }
    }
  }

  function listAppData() {
    // https://developers.google.com/drive/api/guides/appdata#node.js
  }

  return (
    // For some reasons, Google won't let us use their managed, pre-designed button with implicit flow
    // So, we have to use a custom one...
    <Stack direction="row" spacing={1}>
      <Button
        startDecorator={<Google />}
        onClick={() => (loggedIn ? logout() : login())}
      >
        {loggedIn ? "Custom signoff" : "Custom Google signin"}
      </Button>
      {loggedIn ? (
        <Button onClick={listAppData}>
          <AddToDrive />
        </Button>
      ) : (
        <></>
      )}
    </Stack>
  );
}
