import api, { route, storage } from "@forge/api";

export function defineGetEventInfo(resolver) {
  resolver.define("getEventInfo", async () => {
    try {
      console.log("running!");
      const data = await storage
        .entity("events")
        .query()
        .index("city")
        .getMany();
      return data;
    } catch (err) {
      console.error(`Error getting event data for event ${k}`, err);
      throw err;
    }
  });
}
