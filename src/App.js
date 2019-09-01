import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import grid from './styledUtils/grid';
import Weather from './Weather';
import Forecast from './Forecast';
import useDebounce from './core/useDebounce';
import GlobalStyles from './GlobalStyles';
import Card from './components/Card';

const AppLayout = styled.div`
  ${grid('100%', 'min-content min-content min-content')}
  padding: 20px;
  grid-gap: 20px;

  .AppLayout__input {
    ${grid('minmax(1px, 100%) min-content', 'min-content')}
    grid-gap: 10px;

    label > span {
      display: block;
    }

    input[type='text'] {
      width: 100%;
      height: 24px;
      box-sizing: border-box;
    }

    button[type='button'] {
      white-space: nowrap;
    }

    .AppLayout__status_message {
      grid-column: span 2;
    }
  }

  .AppLayout__cityNames {
    ${grid('1fr', 'min-content')}
    &.grouped_by_2 {
      ${grid('1fr 1fr', 'min-content')}
    }
    &.grouped_by_3 {
      ${grid('1fr 1fr 1fr', 'min-content')}
    }
    grid-gap: 20px;
  }

  .AppLayout__forecast {
    min-height: 100%;
  }
`;

const CLEAR_MESSAGE_TIMEOUT = 5000;

export default function App() {
  const cityNameInputRef = useRef(null);
  const [cityNames, setCityNames] = useState(['Salvador', 'Dublin', 'Madrid']);
  const [statusMessage, setStatusMessage] = useState('');
  const [currentCityName, setCurrentCityName] = useState('Salvador');
  const clearStatusMessageDebounced = useDebounce(
    () => setStatusMessage(''),
    CLEAR_MESSAGE_TIMEOUT
  );
  const setStatusMessageWithReset = useCallback(
    message => {
      setStatusMessage(message);
      clearStatusMessageDebounced();
    },
    [clearStatusMessageDebounced]
  );
  const onClickAddCity = useCallback(() => {
    const cityName = (cityNameInputRef.current.value || '').trim();
    if (cityName) {
      setCityNames(currentCityNames => {
        if (currentCityNames.length === 3) {
          setStatusMessageWithReset(
            'You already have 3 cities added. Please, remove one before adding a new.'
          );

          return currentCityNames;
        }

        cityNameInputRef.current.value = '';
        return currentCityNames.concat(cityName);
      });
    }
  }, []);
  const onClickRemoveCity = useCallback(
    city => {
      setCityNames(currentCityNames => {
        const newCities = currentCityNames.filter(cityName => city !== cityName);
        const isCurrentCityInvalid =
          newCities.length !== currentCityNames.length &&
          currentCityName &&
          !newCities.includes(currentCityName);

        if (isCurrentCityInvalid) {
          setCurrentCityName('');
        }

        return newCities;
      });
    },
    [currentCityName]
  );
  const onClickSelectCity = useCallback(city => {
    const cityName = city && city.trim();
    if (cityName) {
      setCurrentCityName(cityName);
    }
  }, []);
  const onClickClearForecast = useCallback(() => {
    setCurrentCityName(null);
  }, []);

  return (
    <AppLayout>
      <GlobalStyles />
      <div className="AppLayout__input">
        <label htmlFor="city-name">
          <span>Add City Name</span>
          <input id="city-name" type="text" ref={cityNameInputRef} />
        </label>
        <button type="button" onClick={onClickAddCity}>
          Add City
        </button>
        <div className="AppLayout__status_message">{statusMessage}</div>
      </div>
      <div className={`AppLayout__cityNames grouped_by_${cityNames.length}`}>
        {cityNames.map(cityName => (
          <Card key={`card-${cityName}`}>
            <Weather
              cityName={cityName}
              key={cityName}
              onSelect={onClickSelectCity}
              onRemove={onClickRemoveCity}
            />
          </Card>
        ))}
      </div>
      {!!currentCityName && (
        <Card className="AppLayout__forecast">
          <Forecast cityName={currentCityName} onRemove={onClickClearForecast} />
        </Card>
      )}
    </AppLayout>
  );
}
