import { throwError } from "../utils/handler";
import { User } from "../models";
import { exchangeRefreshTokenForAccessToken } from "../config/calendly";

export const profile = async (userId: string) => {
  return User.findByPk(userId, { attributes: ["id", "email"] });
};

export const findOrCreateByGoogleId = async (
  googleId: string,
  email: string
): Promise<User> => {
  let user = await User.findOne({ where: { googleId } });

  if (!user) {
    user = User.build({
      googleId,
      email,
    });
    await user.save();
  }

  return user;
};

export const updateCalendlyToken = async (
  userId: string,
  token: string,
  uri: string
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throwError(404, "User not found");
  }
  user!.calendlyRefreshToken = token;
  user!.cUri = uri;
  await user!.save();
  return user;
};

export const updateSlackDetails = async (
  userId: string,
  accessToken: string,
  slackUserId: string,
  incomingWebhookUrl: string
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throwError(404, "User not found");
  }
  user!.slackAccessToken = accessToken;
  user!.slackUserId = slackUserId;
  user!.slackIncomingWebhookUrl = incomingWebhookUrl;
  return await user!.save();
};

export const getCalendlyToken = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throwError(404, "User not found");
  }
  if (!user!.calendlyRefreshToken) {
    throwError(404, "Calendly not connected.");
  }
  const at = await exchangeRefreshTokenForAccessToken(
    userId,
    user!.calendlyRefreshToken!
  );

  return {
    token: at,
    lastEventCheckTime: user!.lastEventCheckTime,
    uri: user!.cUri,
  };
};

export const updateLastEventCheckTime = async (
  userId: string,
  time: string
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throwError(404, "User not found");
  }
  if (!user!.calendlyRefreshToken) {
    throwError(404, "Calendly not connected.");
  }
  user!.lastEventCheckTime = time;
  await user!.save();
};
