import axios from "axios";
import { updateCalendlyToken } from "../services/user";

export const CALENDLY_CLIENT_ID = process.env.CALENDLY_CLIENT_ID || "";
export const CALENDLY_CLIENT_SECRET = process.env.CALENDLY_CLIENT_SECRET || "";
export const CALENDLY_REDIRECT_URI = `${process.env.APP_URL}/api/user/cbc`;

export const generateCalendlyOAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: CALENDLY_CLIENT_ID,
    redirect_uri: CALENDLY_REDIRECT_URI,
    state,
    response_type: "code",
  });

  return `https://calendly.com/oauth/authorize?${params.toString()}`;
};

export const exchangeCalendlyCodeForToken = async (code: string) => {
  const data = {
    grant_type: "authorization_code",
    client_id: CALENDLY_CLIENT_ID,
    client_secret: CALENDLY_CLIENT_SECRET,
    redirect_uri: CALENDLY_REDIRECT_URI,
    code,
  };

  const response = await axios.post(
    "https://auth.calendly.com/oauth/token",
    data
  );
  return response.data;
};

export const exchangeRefreshTokenForAccessToken = async (
  userId: string,
  refreshToken: string
) => {
  const data = {
    grant_type: "refresh_token",
    client_id: CALENDLY_CLIENT_ID,
    client_secret: CALENDLY_CLIENT_SECRET,
    refresh_token: refreshToken,
  };

  const response = await axios.post(
    "https://auth.calendly.com/oauth/token",
    data
  );
  // console.log(response.data, "========================================");
  await updateCalendlyToken(
    userId,
    response.data.refresh_token,
    response.data.owner
  );
  return response.data.access_token;
};

export const subscribeToCalendlyWebhook = async (accessToken: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const data = {
    url: `${process.env.APP_URL}/calendly-webhook`,
    events: ["invitee.created"],
  };

  await axios.post("https://calendly.com/api/v1/hooks", data, config);
};
