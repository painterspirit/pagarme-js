/**
 * @name encryption
 * @memberof strategies
 * @private
 */
import { reject, resolve } from 'bluebird'
import { merge } from 'ramda'
import transactions from '../../resources/transactions'

/**
 * Resolves to an object with
 * the `encryption_key` from
 * the supplied `options` param
 *
 * @param {any} options
 * @returns {Promise} an object containing
 *                   a body property with
 *                   the desired `encryption_key`
 * @private
 */
function execute (opts) {
  const { encryption_key, options } = opts
  const payload = merge({
    body: {
      encryption_key,
    },
  }, options && options.baseURL ? { baseURL: options.baseURL } : {})

  return transactions.calculateInstallmentsAmount(payload, { amount: 1, interest_rate: 100 })
    .catch(error => (opts.skipAuthentication ? resolve(opts.options) : reject(error)))
    .catch(err => err.name === 'ApiError', () => reject(new Error('You must supply a valid encryption key')))
    .then(merge(payload))
    .then(requestOpts => ({
      authentication: { encryption_key },
      options: requestOpts,
    }))
}

/**
 * Returns an object with
 * the `encryption_key` from
 * the supplied `options` param
 * synchronously.
 *
 * @param {any} options
 * @returns {Object} an object containing
 *                   a body property with
 *                   the desired `encryption_key`
 * @private
 */
function executeSync (opts) {
  const { encryption_key, options } = opts
  const body = {
    body: {
      encryption_key,
    },
  }
  if (options && options.baseURL) {
    body.baseURL = options.baseURL
  }
  return {
    authentication: { encryption_key },
    options: merge(body, opts.options),
  }
}

/**
 * Resolves the supplied parameter with
 * the `execute` function added to it.
 *
 * @param {any} options
 * @returns {Promise} The `options` parameter
 *                   with `execute` add to it
 * @private
 */
function build (options) {
  return merge(options, { execute: execute.bind(null, options) })
}

/**
 * Returns the supplied parameter with
 * the `execute` function added to it.
 *
 * @param {any} options
 * @returns {Object} The `options` parameter
 *                   with `execute` add to it
 * @private
 */
function buildSync (options) {
  return merge(options, { execute: executeSync.bind(null, options) })
}

export default {
  build,
  buildSync,
}
