import express, { Router } from "express";
import {
  calendlyOAuth,
  calendlyOAuthCallback,
  checkCalendlyEvents,
  handleSlackEvent,
  slackOAuth,
  slackOAuthCallback,
} from "../controllers/user";
import { verifyAccessToken } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/connect-calendly", verifyAccessToken, calendlyOAuth);
// router.post("/connect-slack", verifyAccessToken, slackOAuth);

router.get("/cbc", calendlyOAuthCallback);
// router.get("/cbs", slackOAuthCallback);

router.post("/webhook", handleSlackEvent);

router.post("/trigger", verifyAccessToken, checkCalendlyEvents);

export default router;
