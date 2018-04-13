import Promise from 'bluebird'
import fetch from 'isomorphic-fetch'

const httpBase = 'https://pagarme.github.io/business-calendar/data'

const load = (country, year) => fetch(`${httpBase}/${country}/${year}.json`)
