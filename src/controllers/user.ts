import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { log, error } from "../utils/logger";
import { responseHandler, throwError } from "../utils/handler";
import {
  getCalendlyToken,
  updateCalendlyToken,
  updateLastEventCheckTime,
  updateSlackDetails,
} from "../services/user";
import {
  exchangeCalendlyCodeForToken,
  generateCalendlyOAuthUrl,
  subscribeToCalendlyWebhook,
} from "../config/calendly";
import {
  exchangeSlackCodeForToken,
  generateSlackOAuthUrl,
} from "../config/slack";
import { handleReactionAdded, sendSlackMessage } from "../utils/slack";

export const calendlyOAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { id: userId } = req.user;
    const authUrl = generateCalendlyOAuthUrl(userId);
    const response = responseHandler(200, "Calendly auth URL.", authUrl);
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

export const calendlyOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state } = req.query;
    const data = await exchangeCalendlyCodeForToken(code as string);
    // await subscribeToCalendlyWebhook(accessToken);
    console.log(data);

    await updateCalendlyToken(
      state!.toString(),
      data.refresh_token,
      data.owner
    );

    const response = responseHandler(200, "Calendly OAuth successful.");
    res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

export const slackOAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { id: userId } = req.user;
    const authUrl = generateSlackOAuthUrl(userId);
    const response = responseHandler(200, "Slack auth URL.", authUrl);
    return res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

export const slackOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state } = req.query;
    const { accessToken, userId, incomingWebhookUrl } =
      await exchangeSlackCodeForToken(code as string);

    await updateSlackDetails(
      state!.toString(),
      accessToken,
      userId,
      incomingWebhookUrl
    );

    const response = responseHandler(200, "Slack OAuth successful.");
    res.status(response.statusCode).json(response);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

export const checkCalendlyEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: userId } = req.user;
    let { token, lastEventCheckTime, uri } = await getCalendlyToken(userId);
    const calendlyApiUrl = "https://api.calendly.com/scheduled_events";
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Check if the URI has the required user parameter
    if (!uri) {
      throw new Error("Calendly user URI is missing");
    }

    // Fetch events from Calendly
    const response = await axios.get(calendlyApiUrl, {
      headers,
      params: {
        user: uri, // Pass the user URI as a parameter
      },
    });

    if (response.status !== 200) {
      throw new Error(
        `Error fetching events from Calendly: ${response.statusText}`
      );
    }

    const events = response.data.collection;

    // If lastEventCheckTime is null, consider all events as new events
    let newEvents;
    if (lastEventCheckTime) {
      newEvents = events.filter((event: any) => {
        const eventCreatedAt = new Date(event.created_at).toISOString();
        return eventCreatedAt > lastEventCheckTime;
      });
    } else {
      newEvents = events;
    }

    if (newEvents.length > 0) {
      // Find the latest created_at timestamp among the new events
      const latestEventCreatedAt = newEvents.reduce(
        (latest: string, event: any) => {
          const eventCreatedAt = new Date(event.created_at).toISOString();
          return eventCreatedAt > latest ? eventCreatedAt : latest;
        },
        lastEventCheckTime || ""
      );

      await updateLastEventCheckTime(userId, latestEventCreatedAt);
    }

    for (const event of newEvents) {
      const meetingDetails = `${event.start_time} - ${event.name}`;
      const timestamp = await sendSlackMessage(meetingDetails);
    }

    const responseMessage = responseHandler(
      200,
      "Calendly events checked successfully."
    );
    res.status(responseMessage.statusCode).json(responseMessage);
  } catch (err) {
    error(req, err);
    next(err);
  }
};

export const handleSlackEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Verify the request signature
    const { headers, body } = req;
    const {
      "x-slack-signature": signature,
      "x-slack-request-timestamp": timestamp,
    } = headers;

    // Check if it's a URL verification challenge
    if (body.type === "url_verification") {
      const challenge = body.challenge;
      res.status(200).send(challenge);
      return;
    }
    const eventData = body.event;
    switch (eventData.type) {
      case "reaction_added":
        await handleReactionAdded(eventData);
        break;
      default:
        console.log("Received unsupported event type:", eventData.type);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("Error handling Slack event:", err);
    res.sendStatus(500);
  }
};
