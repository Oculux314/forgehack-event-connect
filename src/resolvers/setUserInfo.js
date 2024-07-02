import api, { route, storage } from "@forge/api";

export function defineSetUserInfo(resolver) {
  resolver.define("setUserInfo", async (res) => {
    const data = res.payload.data;
    const response = await api
      .asUser()
      .requestConfluence(route`/wiki/rest/api/user/current`, {
        headers: {
          Accept: "application/json",
        },
      });
    const userData = await response.json();
    const accountId = userData.accountId;
    try {
      await storage.set(accountId, data);
    } catch (error) {
      console.error("Error fetching or setting user data:", error);
      throw error;
    }
  });
}
