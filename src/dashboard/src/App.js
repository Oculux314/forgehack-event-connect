import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
function App() {
  // const [data, setData] = useState(null);
  // useEffect(() => {
  //   invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  // }, []);
  const [hover, setHover] = useState(false);
  const [options, setOptions] = useState([
    { category: "Poverty", chosen: false },
    { category: "Education", chosen: false },
    { category: "Medical", chosen: false },
    { category: "Environment", chosen: false },
    { category: "Animals", chosen: false },
    { category: "Human Rights", chosen: false },
    { category: "Disaster Relief", chosen: false },
    { category: "Global Warming", chosen: false },
    { category: "Mental Health", chosen: false }
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
    setter(prevItem =>
      prevItem.map((item, i) =>
        i === index ? { ...item, chosen: !item.chosen } : item
      )
    );
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px'
  }
  const titleStyle = { color: '#4CAF50', margin: '20px 0' }
  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '480px'
  }
  const buttonStyle = (option) => ({
    backgroundColor: option.chosen ? '#555' : '#4CAF50',
    color: 'white',
    width: '150px',
    height: '50px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '40px',
    margin: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  })
  const submitButtonStyle = {
    backgroundColor: 'pink',
    color: 'white',
    padding: '15px 32px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: hover ? 'scale(1.05)' : 'scale(1)',
    marginTop: '20px'
  };


  useEffect(() => {
    async function getUserInfo() {
      try {

        const data = await invoke('getUserInfo');
        const tempOptions=data.options
        const tempCities=data.cities
        if(tempOptions){
          setOptions(tempOptions)
        }
        if(tempCities){
          setCities(tempCities)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    getUserInfo();
  }, [])

  const handleSubmit = () => {
    invoke('setUserInfo', { options: options, cities: cities });
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Causes that Interest You</h2>
      <div style={gridStyle}>
        {
          options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleClick(index, setOptions)}
              style={buttonStyle(option)}
            >
              {option.category}
            </button>
          ))
        }

      </div>
      <h2 style={titleStyle}>Cities Available</h2>
      <div style={gridStyle}>
        {
          cities.map((city, index) => (
            <button
              key={index}
              onClick={() => handleClick(index, setCities)}
              style={buttonStyle(city)}
            >
              {city.city}
            </button>
          ))
        }
      </div>
      <button
        style={submitButtonStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default App;

