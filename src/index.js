import Resolver from '@forge/resolver';
import api, { route, storage } from "@forge/api";

const resolver = new Resolver();

resolver.define('getUserInfo', async () => {
  const response = await api.asUser().requestConfluence(route`/wiki/rest/api/user/current`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const userData = await response.json();
  const accountId=userData.accountId
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
        { category: "Mental Health", chosen: false }
      ];


      await storage.set(accountId, options);


      userData = await storage.get(accountId);
    }
    
    return userData;

  } catch (error) {
    console.error('Error fetching or setting user data:', error);
    throw error;
  }
});

resolver.define('setUserInfo', async (res) => {
  const data=res.payload.data
  const response = await api.asUser().requestConfluence(route`/wiki/rest/api/user/current`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const userData = await response.json();
  const accountId=userData.accountId
  try {

      await storage.set(accountId, data);

  } catch (error) {
    console.error('Error fetching or setting user data:', error);
    throw error;
  }
});


export const handler = resolver.getDefinitions();
