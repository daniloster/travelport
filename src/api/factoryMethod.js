import { APPID } from '../constants';

const ACCEPTABLE_TYPES = ['object', 'array'];

/**
 * @typedef ApiArguments
 * @property {any} id
 * @property {object} data
 * @property {object} params
 * @property {function} prepare
 * @property {function} callback
 */

/**
 * Creates a method to perform api calls and set values
 * @param {function} factoryUrl
 * @param {array} reqHeaders
 * @param {string} method
 *
 * @returns {function} - Function(@type ApiArguments)
 */
export default function factoryMethod(factoryUrl, method) {
  return async arg => {
    try {
      const { params, data } = arg || {};
      const fetchArgs = {
        method,
        mode: 'cors',
        ...(data && ACCEPTABLE_TYPES.includes(typeof data) && { body: JSON.stringify(data) }),
      };
      const url = new URL(factoryUrl(method, data));
      Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append('APPID', APPID);

      return await fetch(url, fetchArgs).then(response => {
        const { headers, status } = response;
        return response
          .json()
          .then(responseData => Promise.resolve({ data: responseData, headers, status }));
      });
    } catch (apiError) {
      return Promise.reject(apiError);
    }
  };
}
