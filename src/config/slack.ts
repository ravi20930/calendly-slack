import axios from "axios";

export const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID || "";
export const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET || "";

export const generateSlackOAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: SLACK_CLIENT_ID,
    scope: "incoming-webhook",
    redirect_uri: `${process.env.APP_URL}/api/user/cbs`,
    state,
  });

  return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
};

export const exchangeSlackCodeForToken = async (code: string) => {
  const data = {
    code,
    client_id: SLACK_CLIENT_ID,
    client_secret: SLACK_CLIENT_SECRET,
  };

  const response = await axios.post(
    "https://slack.com/api/oauth.v2.access",
    data
  );
  return {
    accessToken: response.data.access_token,
    userId: response.data.user_id,
    incomingWebhookUrl: response.data.incoming_webhook.url,
  };
};
