import useApi from '../api/useApi';
// import { APP_ID } from '../constants';

function factoryUrl(method /* , cityName */) {
  switch (method) {
    case 'get':
      // if (!cityName || typeof cityName !== 'string') {
      //   throw new Error(`The method "${method}" requires city name as string argument`);
      // }
      return `http://api.openweathermap.org/data/2.5/weather`;
    case 'delete':
    case 'patch':
    case 'post':
    case 'put':
    default:
      return null;
  }
}

export default function useWeatherApi() {
  return useApi(factoryUrl);
}
