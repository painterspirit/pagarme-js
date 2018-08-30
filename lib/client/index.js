/**
 * Client Module
 * @description The client module is the entry point for our SDK.
 *              It holds a Promise-based authentication method
 *              ([connect]{@link client#connect}) as well as
 *              allowing for raw use of the resources (without authentication).
 * @module client
 */

import {
  merge,
  map,
  ifElse,
  is,
} from 'ramda'

import strategies from './strategies'
import resources from '../resources'

/**
 * Binds the `options` received as param
 * to the client's resources.
 * @private
 *
 * @param {Object} options
 * @returns A version of resources with its methods' first param binded to `options`
 */
function bindClientOptions ({ options, authentication }) {
  const bindOptions = func => func.bind(null, options)

  const bindRecursive = ifElse(
    is(Function),
    bindOptions,
    resource => map(bindRecursive, resource)
  )

  const boundClient = map(bindRecursive, resources)
  return merge(boundClient, { authentication })
}

/**
 * Returns a version of client with
 * authentication data binded to the
 * resource requests.
 *
 * @example
 * // API Key Authentication
 * pagarme.client.connect({ api_key: 'ak_test_y7jk294ynbzf93' })
 *
 * // Encryption Key Authentication
 * pagarme.client.connect({ encryption_key: 'ek_test_y7jk294ynbzf93' })
 *
 * // Login Authentication
 * pagarme.client.connect({ email: 'user@email.com', password: '123456' })
 *
 * @param {Object} authentication
 * @returns {Promise} A Promise that resolves to a client with authentication data binded
 */
function connect (authentication) {
  return strategies
    .find(authentication)
    .then(s => s.execute())
    .then(bindClientOptions)
}

/**
 * Sync returns a version of client with
 * authentication data binded to the
 * resource requests.
 *
 * @example
 * // API Key Authentication
 * const client = pagarme.client.connectSync({ api_key: 'ak_test_y7jk294ynbzf93' })
 *
 * // Encryption Key Authentication
 * const client = pagarme.client.connectSync({ encryption_key: 'ek_test_y7jk294ynbzf93' })
 *
 * // Login Authentication
 * const client = pagarme.client.connectSync({ email: 'user@email.com', password: '123456' })
 *
 * @param {Object} authentication
 * @returns A client with authentication data binded
 */
function connectSync (authentication) {
  const strategy = strategies.findSync(authentication)
  return bindClientOptions(strategy.execute())
}

const client = merge({ connect, connectSync }, resources)

export default client
