import httpSource from './httpSource'

const defaultConfig = {
  cacheLifetime: 24 * 60 * 60 * 1000,
}

const cache = {}

const isWeekend = date => date.isoWeekday() === 6 || date.isoWeekday === 7

const sanitizeDate = (date) => {
  if (moment.isMoment(date)) {
    return date.toDate()
  }

  return date
}

const getDateFromInformation = date => (info) => {
  const key = date.format('YYYY-MM-DD')

  return find(propEq('date', key), info.calendar)
}

const getYearInformation = (country, year) => {
  const cacheName = `${country.toLowerCase()}_${year}`
  const currentCacheLifetime = Date.now() - cache[cacheName].time

  if (cache[cacheName] && (currentCacheLifetime <= config.cacheLifetime)) {
    return Promise.resolve(cache[cacheName].data)
  }

  return httpSource.load(country, year)
    .tap(data => (
      cache[cacheName] = {
        time: Date.now(),
        data,
      }
    ))
}

const queryDateInformation = (country, date) => {
  const sanitizedDate = moment(sanitizedDate(date))

  return Promise.resolve()
    .then(always(getYearInformation(country, date.year)))
    .then(getDateFromInformation(date))
}
