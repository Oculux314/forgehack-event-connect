import { invoke, router } from "@forge/bridge";
import { useEffect, useState } from "react";
import { initialCauses, initialLocations } from "./initialState";

function App() {
  const [causes, setCauses] = useState(initialCauses);
  const [locations, setLocations] = useState(initialLocations);

  /* - Initial Data - */

  async function getUserInfo() {
    try {
      const { options, cities } = await invoke("getUserInfo");
      setCauses(options);
      setLocations(cities);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  /* - Formatting - */

  const noneSelected = <span className="grey">None Selected</span>;

  function causesToString(causes) {
    const causeString = causes
      .filter((cause) => cause.chosen)
      .map((cause) => cause.category)
      .join(", ");
    return causeString ?? noneSelected;
  }

  function locationsToString(locations) {
    const locationString = locations
      .filter((loc) => loc.chosen)
      .map((loc) => loc.city)
      .join(", ");
    return locationString ?? noneSelected;
  }

  /* - Routing - */

  async function goToDashboard() {
    await router.open("https://www.youtube.com/watch?v=duPJqfKiA78");
  }

  return (
    <>
      <h1>Current Selections</h1>
      <p>Causes: {causesToString(causes)}</p>
      <p>Locations: {locationsToString(locations)}</p>
      <button onClick={goToDashboard}>Edit Selections</button>
    </>
  );
}

export default App;
