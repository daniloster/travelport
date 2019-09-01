import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import grid from '../styledUtils/grid';
import useWeatherApi from './useWeatherApi';
import Status from '../api/Status';

const WeatherLayout = styled.div`
  ${grid('100%', 'min-content minmax(1px, 100%)')}
  cursor: pointer;
  position: relative;
  min-height: 200px;

  .WeatherLayout__title {
    display: block;
    padding: 7px 15px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;

    .WeatherLayout__close {
      ${grid('19px', '19px')}
      align-items: center;
      justify-content: center;
      text-align: center;
      position: absolute;
      top: -4px;
      right: -4px;
      color: black;
      border: 2px solid black;
      border-radius: 50%;
      background: #fff;
    }
  }
  .WeatherLayout__content {
    padding: 15px;
  }
`;

const DEGREES_KELVIN = 273;

export default function Weather({ cityName, onSelect, onRemove }) {
  const onClose = useCallback(() => onRemove(cityName), [cityName, onRemove]);
  const onClickSelect = useCallback(() => onSelect(cityName), [cityName, onSelect]);
  const [status, setStatus] = useState(Status.Initial);
  const [data, setData] = useState(null);
  const api = useWeatherApi();
  useEffect(() => {
    if (cityName) {
      setStatus(Status.Loading);
      api.get({ params: { q: cityName } }).then(response => {
        if (response.error || response.status !== 200) {
          setStatus(Status.Error);
        } else {
          setData(response.data);
          setStatus(Status.Success);
        }
      });
    }
  }, [cityName, api]);
  const date = useMemo(() => {
    if (data && data.dt) {
      const dateObject = new Date(data.dt * 1000);

      return `${dateObject.toLocaleDateString()} ${dateObject.toLocaleTimeString()}`;
    }

    return null;
  }, [data]);

  return (
    <WeatherLayout onClick={onClickSelect}>
      <span className="WeatherLayout__title">
        {cityName}
        <span className="WeatherLayout__close" onClick={onClose}>
          X
        </span>
      </span>
      {status === Status.Loading && (
        <div className="WeatherLayout__content">
          Loading weather...
        </div>
      )}
      {status === Status.Error && (
        <div className="WeatherLayout__content">
          Error trying to load weather...
        </div>
      )}
      {status === Status.Success && (
        <div className="WeatherLayout__content">
          <p><strong>Date/time</strong>: {date}</p>
          <p><strong>Lat, Lon</strong>: {data.coord.lat}, {data.coord.lon}</p>
          {(data.weather || []).map(({ id, description }) => (
            <p key={`description-${id}`}>The wheather today with {description}</p>
          ))}
          <p><strong>Temperature</strong>: {data.main.temp - DEGREES_KELVIN} C</p>
          <p>
            <span><strong>max</strong>: {(data.main.temp_max - DEGREES_KELVIN).toFixed(2)} C, </span>
            <span><strong>min</strong>: {(data.main.temp_min - DEGREES_KELVIN).toFixed(2)} C</span>
          </p>
          <p><strong>Pressure</strong>: {data.main.pressure} atm</p>
        </div>
      )}
    </WeatherLayout>
  );
}
