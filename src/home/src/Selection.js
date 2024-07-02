import { invoke } from '@forge/bridge';
import React, { useEffect, useRef, useState } from 'react';
export function Selection({ causes, setCauses, locations, setLocations }) {
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);
    const [hoveredCityIndex, setHoveredCityIndex] = useState(null);

    const timerRef = useRef(null);
    const [options, setOptions] = useState(causes);

    const [cities, setCities] = useState(locations);

    const handleClick = (index, setter) => {
        setter(prevItem =>
            prevItem.map((item, i) =>
                i === index ? { ...item, chosen: !item.chosen } : item
            )
        );

        setShouldSubmit(true);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

    };

    useEffect(() => {
        if (shouldSubmit) {
            handleSubmit();
            setShouldSubmit(false);
        }
    }, [shouldSubmit]);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px'
    }
    const titleStyle = { color: '#0052CC', margin: '10px 0' }

    const gridStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '100%'
    }
    const buttonStyle = (option, isHover) => ({
        backgroundColor: option.chosen ? (isHover ? '#00B8D9' : '#0052CC') : (isHover ? '#97A0AF' : '#555'),
        color: 'white',
        width: '46%',
        height: '35px',
        border: 'none',
        borderRadius: '20px',
        margin: '1.5%',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-out',
        paddingTop: '3px', 
        paddingBottom: '3px',
    })

    const handleSubmit = () => {
        invoke('setUserInfo', { options: options, cities: cities });
        setLocations(cities)
        setCauses(options)
    }

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Interested Causes</h2>
            <div style={gridStyle}>
                {
                    options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(index, setOptions)}
                            style={buttonStyle(option, hoveredOptionIndex == index)}
                            onMouseEnter={() => setHoveredOptionIndex(index)}
                            onMouseLeave={() => setHoveredOptionIndex(null)}
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
                            style={buttonStyle(city, hoveredCityIndex == index)}
                            onMouseEnter={() => setHoveredCityIndex(index)}
                            onMouseLeave={() => setHoveredCityIndex(null)}
                        >
                            {city.city}
                        </button>
                    ))
                }
            </div>
        </div>
    );
};


