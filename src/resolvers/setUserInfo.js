import api, { route, storage } from "@forge/api";

export function defineSetUserInfo(resolver) {
  resolver.define("setUserInfo", async (res) => {
    const data = res.payload;
    const options = data.options
    const cities = data.cities
    const response = await api
      .asUser()
      .requestConfluence(route`/wiki/rest/api/user/current`, {
        headers: {
          Accept: "application/json",
        },
      });
    const userData = await response.json();
    const accountId = userData.accountId;
    const email = userData.email
    try {
      await storage.set(accountId, { options: options, cities: cities, email: email });

      const subscribedUsers = await storage.get("subscribedUsers", [])
      if (!subscribedUsers) {
        subscribedUsers = [];
      }
      
      const isSubscribed=subscribedUsers.some(subscriber=>subscriber==accountId)
      if(!isSubscribed){
        subscribedUsers.push(accountId)
      }
      await storage.set("subscribedUsers", subscribedUsers)
    } catch (error) {
      console.error("Error fetching or setting user data:", error);
      throw error;
    }
  });
}
