import { invoke, router } from "@forge/bridge";
import { useEffect, useState } from "react";
import { initialCauses, initialLocations } from "./initialState";
import { Selection } from "./Selection";

function App() {
  const [causes, setCauses] = useState(initialCauses);
  const [locations, setLocations] = useState(initialLocations);
  const [isEdit, setIsEdit] = useState(false)

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
    return causeString.length ? causeString : noneSelected;
  }

  function locationsToString(locations) {
    const locationString = locations
      .filter((loc) => loc.chosen)
      .map((loc) => loc.city)
      .join(", ");
    return locationString.length ? locationString : noneSelected;
  }

  /* - Routing - */

  const handleEdit = () => {
    setIsEdit((isEdit) => !isEdit)
  }

  return (

    isEdit ?
      (
        <>
          <Selection causes={causes} setCauses={setCauses} locations={locations} setLocations={setLocations}/>
          <button onClick={handleEdit}>Submit Selections</button>
        </>
      )
      :
      (
        <>
          <table>
            <thead>
              <tr>
                <th colSpan={2}>Current Selections</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="left">Causes</span>
                </td>
                <td>{causesToString(causes)}</td>
              </tr>
              <tr>
                <td>
                  <span className="left">Locations</span>
                </td>
                <td>{locationsToString(locations)}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleEdit}>Edit Selections</button>
        </>
      )

  );
}

export default App;
