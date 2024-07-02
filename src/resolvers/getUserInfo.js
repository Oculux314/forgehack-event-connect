import api, { route, storage } from "@forge/api";

export function defineGetUserInfo(resolver) {
  resolver.define("getUserInfo", async () => {
    const response = await api
      .asUser()
      .requestConfluence(route`/wiki/rest/api/user/current`, {
        headers: {
          Accept: "application/json",
        },
      });
    const userData = await response.json();
    const accountId = userData.accountId;
    const email=userData.email;
    try {
      let userData = await storage.get(accountId);
      if (!userData) {
        const options = [
          { category: "Poverty", chosen: false },
          { category: "Education", chosen: false },
          { category: "Medical", chosen: false },
          { category: "Environment", chosen: false },
          { category: "Animals", chosen: false },
          { category: "Human Rights", chosen: false },
          { category: "Disaster Relief", chosen: false },
          { category: "Global Warming", chosen: false },
          { category: "Mental Health", chosen: false },
        ];
        const cities=[
          { city: "Sydney", chosen: false },
          { city: "Melbourne", chosen: false },
          { city: "Canberra", chosen: false },
          { city: "Perth", chosen: false },
          { city: "Adelaide", chosen: false },
          { city: "Brisbane", chosen: false },
        ]

        await storage.set(accountId, {options:options,cities:cities,email:email});

        userData = await storage.get(accountId);
      }

      return userData;
    } catch (error) {
      console.error("Error fetching or setting user data:", error);
      throw error;
    }
  });
}
