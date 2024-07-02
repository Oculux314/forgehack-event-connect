import api, { route, storage } from "@forge/api";

export function defineSetEventInfo(resolver) {
  resolver.define("setEventInfo", async (res) => {
    const allEvents = res.payload;

    for (const [k, v] of Object.entries(allEvents)) {
      try {
        console.log(`attempting to populate event ${k}`);
        await storage
          .entity("events")
          .set(k, v)
          .then(() => {
            console.log(`Data set for event ${k}`);
          });
      } catch (error) {
        console.error(`Error setting event data for event ${k}`, error);
        throw error;
      }
    }
  });
}
