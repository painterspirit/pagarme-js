import {
  merge,
} from 'ramda'

import pagarme from '..'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

function testAsync (test) {
  const opts = {
    skipAuthentication: true,
    options: { baseURL: 'http://127.0.0.1:8080' },
  }

  return pagarme.client.connect(merge(opts, test.connect))
    .then(test.subject)
    .then((response) => {
      expect(response.method).toBe(test.method)
      expect(response.url).toBe(test.url)
      expect(response.body).toMatchObject(test.body)
    })
}

function testSync (test) {
  const opts = {
    skipAuthentication: true,
    options: { baseURL: 'http://127.0.0.1:8080' },
  }

  let syncClient = pagarme.client.connectSync(merge(opts, test.connect))
  return test.subject(syncClient)
    .then((response) => {
      expect(response.method).toBe(test.method)
      expect(response.url).toBe(test.url)
      expect(response.body).toMatchObject(test.body)
    })
}

export default function (test) {
  return Promise.all([
    testAsync(test),
    testSync(test),
  ])
}

 