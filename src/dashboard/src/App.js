import { invoke } from "@forge/bridge";
import React, { useEffect, useRef, useState } from "react";
import mockData from "./db_test";

function App() {
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);
  const [hoveredCityIndex, setHoveredCityIndex] = useState(null);

  const timerRef = useRef(null);
  const [options, setOptions] = useState([
    { category: "Poverty", chosen: false },
    { category: "Education", chosen: false },
    { category: "Medical", chosen: false },
    { category: "Environment", chosen: false },
    { category: "Animals", chosen: false },
    { category: "Human Rights", chosen: false },
    { category: "Disaster Relief", chosen: false },
    { category: "Global Warming", chosen: false },
    { category: "Mental Health", chosen: false },
  ]);

  const [cities, setCities] = useState([
    { city: "Sydney", chosen: false },
    { city: "Melbourne", chosen: false },
    { city: "Canberra", chosen: false },
    { city: "Perth", chosen: false },
    { city: "Adelaide", chosen: false },
    { city: "Brisbane", chosen: false },
  ]);

  const handleClick = (index, setter) => {
    setter((prevItem) =>
      prevItem.map((item, i) =>
        i === index ? { ...item, chosen: !item.chosen } : item
      )
    );

    setShouldSubmit(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setShowSavedMessage(true);
    timerRef.current = setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  useEffect(() => {
    if (shouldSubmit) {
      handleSubmit();
      setShouldSubmit(false);
    }
  }, [shouldSubmit]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  };
  const titleStyle = { color: "#0052CC", margin: "20px 0" };
  const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "480px",
  };
  const buttonStyle = (option, isHover) => ({
    backgroundColor: option.chosen
      ? isHover
        ? "#00B8D9"
        : "#0052CC"
      : isHover
      ? "#97A0AF"
      : "#555",
    color: "white",
    width: "150px",
    height: "50px",
    fontSize: "16px",
    border: "none",
    borderRadius: "40px",
    margin: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-out",
  });

  const submitButtonStyle = {
    backgroundColor: "pink",
    color: "white",
    padding: "15px 32px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "20px",
  };

  useEffect(() => {
    async function getUserInfo() {
      try {
        const data = await invoke("getUserInfo");
        const tempOptions = data.options;
        const tempCities = data.cities;

        if (tempOptions) {
          setOptions(tempOptions);
        }
        if (tempCities) {
          setCities(tempCities);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    getUserInfo();
  }, []);

  const handleSubmit = () => {
    invoke("setUserInfo", { options: options, cities: cities });
  };

  const handleSubmitSendData = () => {
    console.log("populated data button clicked");
    invoke("setEventInfo", mockData).then(() => {
      invoke("getEventInfo").then((res) => console.log("the res is:", res));
    });
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Causes That Interest You</h2>
      <div style={gridStyle}>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleClick(index, setOptions)}
            style={buttonStyle(option, hoveredOptionIndex == index)}
            onMouseEnter={() => setHoveredOptionIndex(index)}
            onMouseLeave={() => setHoveredOptionIndex(null)}
          >
            {option.category}
          </button>
        ))}
      </div>
      <h2 style={titleStyle}>Cities Available</h2>
      <div style={gridStyle}>
        {cities.map((city, index) => (
          <button
            key={index}
            onClick={() => handleClick(index, setCities)}
            style={buttonStyle(city, hoveredCityIndex == index)}
            onMouseEnter={() => setHoveredCityIndex(index)}
            onMouseLeave={() => setHoveredCityIndex(null)}
          >
            {city.city}
          </button>
        ))}
      </div>
      {showSavedMessage && <div>Saved</div>}
      <button style={submitButtonStyle} onClick={handleSubmitSendData}>
        Populate Database
      </button>
    </div>
  );
}

export default App;
