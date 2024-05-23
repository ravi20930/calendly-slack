import { WebClient } from "@slack/web-api";
import { sendEmailNotification } from "./email";

const { SLACK_BOT_TOKEN, SLACK_CHANNEL_ID } = process.env;

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export async function sendSlackMessage(message: string): Promise<string> {
  const result = await slackClient.chat.postMessage({
    channel: SLACK_CHANNEL_ID!.toString(),
    text: message,
  });
  return result.ts || "";
}

async function getUserEmail(userId: string): Promise<string | null> {
  const result = await slackClient.users.info({ user: userId });
  const user = result.user;
  if (user && user.profile && user.profile.email) {
    return user.profile.email;
  }
  return null;
}

export async function handleReactionAdded(eventData: any): Promise<void> {
  const { user, reaction, item } = eventData;
  if (reaction === "+1") {
    // slack is not giving email of the user we will have to store
    let email = await getUserEmail(user);
    email = "ravi20930@gmail.com";
    if (email) {
      const meetingDetails = `You reacted to a message with a thumbs-up emoji.`;
      await sendEmailNotification(meetingDetails, email);
      return;
    }
  }
  return;
}
