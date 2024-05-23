# Calendly Slack Integration

## Description

Communication between Calendly and Slack by notifying users in a Slack channel about newly booked events. Additionally, if someone reacts to the notification message in Slack, an email is sent to that individual. This integration enhances team communication and ensures timely responses to scheduled events.

## Installation

1. Clone the repository.
2. Install dependencies using `yarn install`.

## Usage

1. Set up environment variables by creating a `.env` file based on the provided `sample.env`.
2. Run the server using `yarn dev`.

## Flow and Functionality

1. **User Authentication**: Users can authenticate their Calendly and Slack accounts through OAuth2.
2. **Calendly Connection**: Users can connect their Calendly accounts with the application.
3. **Slack Connection**: Users can connect their Slack accounts with the application.
4. **Calendly Event Trigger**: The system checks for new events booked on Calendly via this trigger.
5. **Slack Notification**: Upon detecting a new event, the system sends a notification message to a designated Slack channel.
6. **Slack Reaction Handling**: If someone reacts to the notification message with a predefined reaction (e.g., thumbs-up), the system sends an email to that individual.
7. **Email Notification**: The system sends an email to the user who reacted to the Slack message, notifying them of the event these are triggered by slack webhooks.

## Routes

- **POST** `/api/auth/google/login`: Initiates Google OAuth2 login flow.
- **GET** `/api/auth/google/callback`: Callback route for handling Google OAuth2 authentication.
- **POST** `/api/user/connect-calendly`: Endpoint to connect Calendly account with the application.
- **GET** `/api/user/cbc`: Callback route for Calendly OAuth2 authentication.
- **POST** `/api/user/webhook`: Webhook endpoint to handle Slack events.
- **POST** `/api/user/trigger`: Endpoint to trigger the check for Calendly events. It can be triggerred by third party cron services

## Middleware

- `verifyAccessToken`: Middleware to verify the validity of the access token.

## Environment Variables

The application requires the environment variables to be set please check sample.env file
