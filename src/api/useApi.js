import { useMemo } from 'react';
import factoryMethod from './factoryMethod';

const METHODS = ['get', 'post', 'put', 'delete'];

function createApiAccessor(factoryUrl) {
  const api = {};
  METHODS.forEach(method => {
    api[method] = factoryMethod(factoryUrl, method);
  });

  return api;
}

/**
 * Creates Context and special provider with methods to interact with the api
 * @param {string} namespace
 * @param {function} factoryUrl
 * @param {array} initialValue
 */
export default function useApi(factoryUrl) {
  const api = useMemo(() => createApiAccessor(factoryUrl), [factoryUrl]);

  return api;
}
