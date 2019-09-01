import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import grid from '../styledUtils/grid';
import Status from '../api/Status';
import useForecastApi from './useForecastApi';
import ResponsiveBarChart from '../components/ResponsiveBarChart';

const ForecastLayout = styled.div`
  ${grid('100%', 'min-content minmax(1px, 100%)')}
  cursor: pointer;
  position: relative;
  min-height: 300px;

  .ForecastLayout__title {
    display: block;
    padding: 7px 15px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;

    .ForecastLayout__close {
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
  .ForecastLayout__content {
    height: 360px;
    width: 100%;
  }
`;

const DEGREES_KELVIN = 273;

export default function Forecast({ cityName, onRemove }) {
  const [status, setStatus] = useState(Status.Initial);
  const [data, setData] = useState(null);
  const api = useForecastApi();
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

  const model = useMemo(() => {
    if (data) {
      const newData = {};

      newData.slices = data.list.map(({ main, dt_txt }) => ({
        datetime: dt_txt,
        ...main,
        temp: (main.temp - DEGREES_KELVIN).toFixed(2),
        temp_max: (main.temp_max - DEGREES_KELVIN).toFixed(2),
        temp_min: (main.temp_min - DEGREES_KELVIN).toFixed(2),
      }));

      if (newData.slices.length) {
        newData.sliceKeys = Object.keys(newData.slices[0]);
      }

      return newData;
    }

    return null;
  }, [data]);

  return (
    <ForecastLayout>
      <span className="ForecastLayout__title">
        {cityName}
        <span className="ForecastLayout__close" onClick={onRemove}>
          X
        </span>
      </span>
      {status === Status.Loading && (
        <div className="WeatherLayout__content">Loading weather...</div>
      )}
      {status === Status.Error && (
        <div className="WeatherLayout__content">Error trying to load weather...</div>
      )}
      {model && status === Status.Success && (
        <div className="WeatherLayout__content">
          <ResponsiveBarChart
            height={360}
            data={model.slices}
            indexBy="datetime"
            legendY="Forecast"
            legendX="Date time"
            keys={model.sliceKeys}
          />
        </div>
      )}
    </ForecastLayout>
  );
}

// {
//   "cod": "200",
//   "message": 0.0071,
//   "cnt": 40,
//   "list": [
//       {
//           "dt": 1567371600,
//           "main": {
//               "temp": 298.7,
//               "temp_min": 298.017,
//               "temp_max": 298.7,
//               "pressure": 1015.54,
//               "sea_level": 1015.54,
//               "grnd_level": 1014.86,
//               "humidity": 76,
//               "temp_kf": 0.68
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01n"
//               }
//           ],
//           "clouds": {
//               "all": 0
//           },
//           "wind": {
//               "speed": 5.62,
//               "deg": 109.431
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-01 21:00:00"
//       },
//       {
//           "dt": 1567382400,
//           "main": {
//               "temp": 298.42,
//               "temp_min": 297.91,
//               "temp_max": 298.42,
//               "pressure": 1017.01,
//               "sea_level": 1017.01,
//               "grnd_level": 1016.3,
//               "humidity": 77,
//               "temp_kf": 0.51
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01n"
//               }
//           ],
//           "clouds": {
//               "all": 0
//           },
//           "wind": {
//               "speed": 4.8,
//               "deg": 106.104
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-02 00:00:00"
//       },
//       {
//           "dt": 1567393200,
//           "main": {
//               "temp": 298.05,
//               "temp_min": 297.71,
//               "temp_max": 298.05,
//               "pressure": 1016.11,
//               "sea_level": 1016.11,
//               "grnd_level": 1015.27,
//               "humidity": 80,
//               "temp_kf": 0.34
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 1
//           },
//           "wind": {
//               "speed": 4.54,
//               "deg": 90.265
//           },
//           "rain": {
//               "3h": 0.125
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-02 03:00:00"
//       },
//       {
//           "dt": 1567404000,
//           "main": {
//               "temp": 297.58,
//               "temp_min": 297.41,
//               "temp_max": 297.58,
//               "pressure": 1014.76,
//               "sea_level": 1014.76,
//               "grnd_level": 1014.02,
//               "humidity": 78,
//               "temp_kf": 0.17
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 35
//           },
//           "wind": {
//               "speed": 3.21,
//               "deg": 59.582
//           },
//           "rain": {
//               "3h": 0.187
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-02 06:00:00"
//       },
//       {
//           "dt": 1567414800,
//           "main": {
//               "temp": 296.89,
//               "temp_min": 296.89,
//               "temp_max": 296.89,
//               "pressure": 1015.78,
//               "sea_level": 1015.78,
//               "grnd_level": 1015.02,
//               "humidity": 82,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 1
//           },
//           "wind": {
//               "speed": 2.29,
//               "deg": 24.568
//           },
//           "rain": {
//               "3h": 0.625
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-02 09:00:00"
//       },
//       {
//           "dt": 1567425600,
//           "main": {
//               "temp": 296.754,
//               "temp_min": 296.754,
//               "temp_max": 296.754,
//               "pressure": 1017.97,
//               "sea_level": 1017.97,
//               "grnd_level": 1017.38,
//               "humidity": 84,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 50
//           },
//           "wind": {
//               "speed": 1.82,
//               "deg": 291.737
//           },
//           "rain": {
//               "3h": 1
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-02 12:00:00"
//       },
//       {
//           "dt": 1567436400,
//           "main": {
//               "temp": 297.7,
//               "temp_min": 297.7,
//               "temp_max": 297.7,
//               "pressure": 1015.89,
//               "sea_level": 1015.89,
//               "grnd_level": 1015.47,
//               "humidity": 80,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 65
//           },
//           "wind": {
//               "speed": 2.73,
//               "deg": 118.292
//           },
//           "rain": {
//               "3h": 0.812
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-02 15:00:00"
//       },
//       {
//           "dt": 1567447200,
//           "main": {
//               "temp": 298.5,
//               "temp_min": 298.5,
//               "temp_max": 298.5,
//               "pressure": 1014.33,
//               "sea_level": 1014.33,
//               "grnd_level": 1013.88,
//               "humidity": 77,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 40
//           },
//           "wind": {
//               "speed": 5.8,
//               "deg": 105.981
//           },
//           "rain": {
//               "3h": 0.063
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-02 18:00:00"
//       },
//       {
//           "dt": 1567458000,
//           "main": {
//               "temp": 298,
//               "temp_min": 298,
//               "temp_max": 298,
//               "pressure": 1015.23,
//               "sea_level": 1015.23,
//               "grnd_level": 1014.53,
//               "humidity": 80,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01n"
//               }
//           ],
//           "clouds": {
//               "all": 0
//           },
//           "wind": {
//               "speed": 6.06,
//               "deg": 92.751
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-02 21:00:00"
//       },
//       {
//           "dt": 1567468800,
//           "main": {
//               "temp": 297.9,
//               "temp_min": 297.9,
//               "temp_max": 297.9,
//               "pressure": 1017.15,
//               "sea_level": 1017.15,
//               "grnd_level": 1016.33,
//               "humidity": 79,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01n"
//               }
//           ],
//           "clouds": {
//               "all": 5
//           },
//           "wind": {
//               "speed": 5.69,
//               "deg": 92.93
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-03 00:00:00"
//       },
//       {
//           "dt": 1567479600,
//           "main": {
//               "temp": 297.602,
//               "temp_min": 297.602,
//               "temp_max": 297.602,
//               "pressure": 1016.54,
//               "sea_level": 1016.54,
//               "grnd_level": 1015.65,
//               "humidity": 79,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01n"
//               }
//           ],
//           "clouds": {
//               "all": 10
//           },
//           "wind": {
//               "speed": 5.07,
//               "deg": 81.43
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-03 03:00:00"
//       },
//       {
//           "dt": 1567490400,
//           "main": {
//               "temp": 297.371,
//               "temp_min": 297.371,
//               "temp_max": 297.371,
//               "pressure": 1015.81,
//               "sea_level": 1015.81,
//               "grnd_level": 1015.01,
//               "humidity": 78,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 19
//           },
//           "wind": {
//               "speed": 3.74,
//               "deg": 68.716
//           },
//           "rain": {
//               "3h": 0.125
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-03 06:00:00"
//       },
//       {
//           "dt": 1567501200,
//           "main": {
//               "temp": 296.913,
//               "temp_min": 296.913,
//               "temp_max": 296.913,
//               "pressure": 1016.88,
//               "sea_level": 1016.88,
//               "grnd_level": 1016.07,
//               "humidity": 80,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 3
//           },
//           "wind": {
//               "speed": 3.5,
//               "deg": 50.348
//           },
//           "rain": {
//               "3h": 0.312
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-03 09:00:00"
//       },
//       {
//           "dt": 1567512000,
//           "main": {
//               "temp": 297.504,
//               "temp_min": 297.504,
//               "temp_max": 297.504,
//               "pressure": 1018.6,
//               "sea_level": 1018.6,
//               "grnd_level": 1018.02,
//               "humidity": 74,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 1
//           },
//           "wind": {
//               "speed": 0.05,
//               "deg": 33.341
//           },
//           "rain": {
//               "3h": 0.063
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-03 12:00:00"
//       },
//       {
//           "dt": 1567522800,
//           "main": {
//               "temp": 298.2,
//               "temp_min": 298.2,
//               "temp_max": 298.2,
//               "pressure": 1017.35,
//               "sea_level": 1017.35,
//               "grnd_level": 1017.05,
//               "humidity": 76,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01d"
//               }
//           ],
//           "clouds": {
//               "all": 3
//           },
//           "wind": {
//               "speed": 4.91,
//               "deg": 140.56
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-03 15:00:00"
//       },
//       {
//           "dt": 1567533600,
//           "main": {
//               "temp": 298.8,
//               "temp_min": 298.8,
//               "temp_max": 298.8,
//               "pressure": 1016.17,
//               "sea_level": 1016.17,
//               "grnd_level": 1015.86,
//               "humidity": 77,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 12
//           },
//           "wind": {
//               "speed": 7.03,
//               "deg": 105.715
//           },
//           "rain": {
//               "3h": 0.563
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-03 18:00:00"
//       },
//       {
//           "dt": 1567544400,
//           "main": {
//               "temp": 298.4,
//               "temp_min": 298.4,
//               "temp_max": 298.4,
//               "pressure": 1016.86,
//               "sea_level": 1016.86,
//               "grnd_level": 1016.28,
//               "humidity": 80,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01n"
//               }
//           ],
//           "clouds": {
//               "all": 1
//           },
//           "wind": {
//               "speed": 6.65,
//               "deg": 101.21
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-03 21:00:00"
//       },
//       {
//           "dt": 1567555200,
//           "main": {
//               "temp": 298.149,
//               "temp_min": 298.149,
//               "temp_max": 298.149,
//               "pressure": 1019.14,
//               "sea_level": 1019.14,
//               "grnd_level": 1018.2,
//               "humidity": 80,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 14
//           },
//           "wind": {
//               "speed": 6.25,
//               "deg": 89.065
//           },
//           "rain": {
//               "3h": 0.063
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-04 00:00:00"
//       },
//       {
//           "dt": 1567566000,
//           "main": {
//               "temp": 298.028,
//               "temp_min": 298.028,
//               "temp_max": 298.028,
//               "pressure": 1018.77,
//               "sea_level": 1018.77,
//               "grnd_level": 1017.65,
//               "humidity": 81,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 29
//           },
//           "wind": {
//               "speed": 6.49,
//               "deg": 91.758
//           },
//           "rain": {
//               "3h": 0.625
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-04 03:00:00"
//       },
//       {
//           "dt": 1567576800,
//           "main": {
//               "temp": 297.679,
//               "temp_min": 297.679,
//               "temp_max": 297.679,
//               "pressure": 1017.78,
//               "sea_level": 1017.78,
//               "grnd_level": 1016.83,
//               "humidity": 80,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 24
//           },
//           "wind": {
//               "speed": 6.16,
//               "deg": 101.321
//           },
//           "rain": {
//               "3h": 0.313
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-04 06:00:00"
//       },
//       {
//           "dt": 1567587600,
//           "main": {
//               "temp": 297.7,
//               "temp_min": 297.7,
//               "temp_max": 297.7,
//               "pressure": 1019.06,
//               "sea_level": 1019.06,
//               "grnd_level": 1018.23,
//               "humidity": 78,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 18
//           },
//           "wind": {
//               "speed": 6.33,
//               "deg": 110.337
//           },
//           "rain": {
//               "3h": 0.125
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-04 09:00:00"
//       },
//       {
//           "dt": 1567598400,
//           "main": {
//               "temp": 297.9,
//               "temp_min": 297.9,
//               "temp_max": 297.9,
//               "pressure": 1020.56,
//               "sea_level": 1020.56,
//               "grnd_level": 1019.99,
//               "humidity": 76,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01d"
//               }
//           ],
//           "clouds": {
//               "all": 9
//           },
//           "wind": {
//               "speed": 6.06,
//               "deg": 109.948
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-04 12:00:00"
//       },
//       {
//           "dt": 1567609200,
//           "main": {
//               "temp": 297.939,
//               "temp_min": 297.939,
//               "temp_max": 297.939,
//               "pressure": 1019.08,
//               "sea_level": 1019.08,
//               "grnd_level": 1018.89,
//               "humidity": 76,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01d"
//               }
//           ],
//           "clouds": {
//               "all": 0
//           },
//           "wind": {
//               "speed": 5.35,
//               "deg": 133.084
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-04 15:00:00"
//       },
//       {
//           "dt": 1567620000,
//           "main": {
//               "temp": 298.034,
//               "temp_min": 298.034,
//               "temp_max": 298.034,
//               "pressure": 1017.47,
//               "sea_level": 1017.47,
//               "grnd_level": 1017.3,
//               "humidity": 76,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01d"
//               }
//           ],
//           "clouds": {
//               "all": 0
//           },
//           "wind": {
//               "speed": 5.88,
//               "deg": 133.214
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-04 18:00:00"
//       },
//       {
//           "dt": 1567630800,
//           "main": {
//               "temp": 297.844,
//               "temp_min": 297.844,
//               "temp_max": 297.844,
//               "pressure": 1018.26,
//               "sea_level": 1018.26,
//               "grnd_level": 1017.7,
//               "humidity": 80,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01n"
//               }
//           ],
//           "clouds": {
//               "all": 1
//           },
//           "wind": {
//               "speed": 5.54,
//               "deg": 125.502
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-04 21:00:00"
//       },
//       {
//           "dt": 1567641600,
//           "main": {
//               "temp": 297.7,
//               "temp_min": 297.7,
//               "temp_max": 297.7,
//               "pressure": 1019.78,
//               "sea_level": 1019.78,
//               "grnd_level": 1019.02,
//               "humidity": 82,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 5
//           },
//           "wind": {
//               "speed": 6.37,
//               "deg": 122.033
//           },
//           "rain": {
//               "3h": 0.5
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-05 00:00:00"
//       },
//       {
//           "dt": 1567652400,
//           "main": {
//               "temp": 297.553,
//               "temp_min": 297.553,
//               "temp_max": 297.553,
//               "pressure": 1019.13,
//               "sea_level": 1019.13,
//               "grnd_level": 1018.26,
//               "humidity": 82,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 0
//           },
//           "wind": {
//               "speed": 6.3,
//               "deg": 114.707
//           },
//           "rain": {
//               "3h": 0.625
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-05 03:00:00"
//       },
//       {
//           "dt": 1567663200,
//           "main": {
//               "temp": 297.342,
//               "temp_min": 297.342,
//               "temp_max": 297.342,
//               "pressure": 1018.42,
//               "sea_level": 1018.42,
//               "grnd_level": 1017.55,
//               "humidity": 81,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 5
//           },
//           "wind": {
//               "speed": 5.96,
//               "deg": 107.629
//           },
//           "rain": {
//               "3h": 0.687
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-05 06:00:00"
//       },
//       {
//           "dt": 1567674000,
//           "main": {
//               "temp": 297.3,
//               "temp_min": 297.3,
//               "temp_max": 297.3,
//               "pressure": 1019.39,
//               "sea_level": 1019.39,
//               "grnd_level": 1018.53,
//               "humidity": 80,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 13
//           },
//           "wind": {
//               "speed": 6.04,
//               "deg": 100.673
//           },
//           "rain": {
//               "3h": 0.688
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-05 09:00:00"
//       },
//       {
//           "dt": 1567684800,
//           "main": {
//               "temp": 297.7,
//               "temp_min": 297.7,
//               "temp_max": 297.7,
//               "pressure": 1020.45,
//               "sea_level": 1020.45,
//               "grnd_level": 1019.82,
//               "humidity": 77,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 13
//           },
//           "wind": {
//               "speed": 6.61,
//               "deg": 101.538
//           },
//           "rain": {
//               "3h": 0.562
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-05 12:00:00"
//       },
//       {
//           "dt": 1567695600,
//           "main": {
//               "temp": 297.956,
//               "temp_min": 297.956,
//               "temp_max": 297.956,
//               "pressure": 1018.5,
//               "sea_level": 1018.5,
//               "grnd_level": 1018.18,
//               "humidity": 74,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01d"
//               }
//           ],
//           "clouds": {
//               "all": 5
//           },
//           "wind": {
//               "speed": 6.17,
//               "deg": 112.851
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-05 15:00:00"
//       },
//       {
//           "dt": 1567706400,
//           "main": {
//               "temp": 298.029,
//               "temp_min": 298.029,
//               "temp_max": 298.029,
//               "pressure": 1017.09,
//               "sea_level": 1017.09,
//               "grnd_level": 1016.93,
//               "humidity": 72,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01d"
//               }
//           ],
//           "clouds": {
//               "all": 3
//           },
//           "wind": {
//               "speed": 5.38,
//               "deg": 125.862
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-05 18:00:00"
//       },
//       {
//           "dt": 1567717200,
//           "main": {
//               "temp": 297.9,
//               "temp_min": 297.9,
//               "temp_max": 297.9,
//               "pressure": 1017.93,
//               "sea_level": 1017.93,
//               "grnd_level": 1017.27,
//               "humidity": 74,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 802,
//                   "main": "Clouds",
//                   "description": "scattered clouds",
//                   "icon": "03n"
//               }
//           ],
//           "clouds": {
//               "all": 28
//           },
//           "wind": {
//               "speed": 5.29,
//               "deg": 123.939
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-05 21:00:00"
//       },
//       {
//           "dt": 1567728000,
//           "main": {
//               "temp": 297.729,
//               "temp_min": 297.729,
//               "temp_max": 297.729,
//               "pressure": 1020.09,
//               "sea_level": 1020.09,
//               "grnd_level": 1019.22,
//               "humidity": 78,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 14
//           },
//           "wind": {
//               "speed": 6.04,
//               "deg": 121.157
//           },
//           "rain": {
//               "3h": 0.313
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-06 00:00:00"
//       },
//       {
//           "dt": 1567738800,
//           "main": {
//               "temp": 297.563,
//               "temp_min": 297.563,
//               "temp_max": 297.563,
//               "pressure": 1019.3,
//               "sea_level": 1019.3,
//               "grnd_level": 1018.48,
//               "humidity": 76,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 15
//           },
//           "wind": {
//               "speed": 6.87,
//               "deg": 116.423
//           },
//           "rain": {
//               "3h": 0.5
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-06 03:00:00"
//       },
//       {
//           "dt": 1567749600,
//           "main": {
//               "temp": 297.678,
//               "temp_min": 297.678,
//               "temp_max": 297.678,
//               "pressure": 1018.35,
//               "sea_level": 1018.35,
//               "grnd_level": 1017.6,
//               "humidity": 74,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10n"
//               }
//           ],
//           "clouds": {
//               "all": 15
//           },
//           "wind": {
//               "speed": 8.23,
//               "deg": 127.029
//           },
//           "rain": {
//               "3h": 0.125
//           },
//           "sys": {
//               "pod": "n"
//           },
//           "dt_txt": "2019-09-06 06:00:00"
//       },
//       {
//           "dt": 1567760400,
//           "main": {
//               "temp": 297.5,
//               "temp_min": 297.5,
//               "temp_max": 297.5,
//               "pressure": 1019.32,
//               "sea_level": 1019.32,
//               "grnd_level": 1018.59,
//               "humidity": 71,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01d"
//               }
//           ],
//           "clouds": {
//               "all": 5
//           },
//           "wind": {
//               "speed": 8.18,
//               "deg": 139.512
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-06 09:00:00"
//       },
//       {
//           "dt": 1567771200,
//           "main": {
//               "temp": 297.629,
//               "temp_min": 297.629,
//               "temp_max": 297.629,
//               "pressure": 1020.59,
//               "sea_level": 1020.59,
//               "grnd_level": 1020.12,
//               "humidity": 72,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 800,
//                   "main": "Clear",
//                   "description": "clear sky",
//                   "icon": "01d"
//               }
//           ],
//           "clouds": {
//               "all": 7
//           },
//           "wind": {
//               "speed": 8.16,
//               "deg": 146.672
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-06 12:00:00"
//       },
//       {
//           "dt": 1567782000,
//           "main": {
//               "temp": 297.429,
//               "temp_min": 297.429,
//               "temp_max": 297.429,
//               "pressure": 1018.95,
//               "sea_level": 1018.95,
//               "grnd_level": 1018.58,
//               "humidity": 79,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 27
//           },
//           "wind": {
//               "speed": 8.19,
//               "deg": 142.727
//           },
//           "rain": {
//               "3h": 0.562
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-06 15:00:00"
//       },
//       {
//           "dt": 1567792800,
//           "main": {
//               "temp": 297.4,
//               "temp_min": 297.4,
//               "temp_max": 297.4,
//               "pressure": 1017.01,
//               "sea_level": 1017.01,
//               "grnd_level": 1016.75,
//               "humidity": 79,
//               "temp_kf": 0
//           },
//           "weather": [
//               {
//                   "id": 500,
//                   "main": "Rain",
//                   "description": "light rain",
//                   "icon": "10d"
//               }
//           ],
//           "clouds": {
//               "all": 50
//           },
//           "wind": {
//               "speed": 7.77,
//               "deg": 139.664
//           },
//           "rain": {
//               "3h": 1.126
//           },
//           "sys": {
//               "pod": "d"
//           },
//           "dt_txt": "2019-09-06 18:00:00"
//       }
//   ],
//   "city": {
//       "id": 3450554,
//       "name": "Salvador",
//       "coord": {
//           "lat": -12.9823,
//           "lon": -38.4813
//       },
//       "country": "BR",
//       "population": 2711840,
//       "timezone": -10800,
//       "sunrise": 1567327113,
//       "sunset": 1567369797
//   }
// }
