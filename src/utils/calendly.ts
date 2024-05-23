import Calendly from "node-calendly";

export async function fetchNewCalendlyEvents(
  token: string,
  lastEventCheckTime: string
) {
  const calendly = new Calendly(token, {
    baseUri: "https://calendly.com/api/v1",
  });
  const events = await calendly.scheduled_events.list();

  const newEvents = events.collection.filter((event: any) => {
    const eventStartTime = new Date(event.start_time).toISOString();
    return eventStartTime > lastEventCheckTime;
  });

  return newEvents;
}
