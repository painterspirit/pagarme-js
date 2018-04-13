const nextBusinessDay = (country, anchorDate) => {
  const sanitizedDate = moment(sanitizeDate(anchorDate)).add(1, 'd')

  const findNextBusinessDay = day => (
    isBusinessDay(country, day)
      .then((isValidBusinessDay) => {
        if (isValidBusinessDay) {
          return day.toDate()
        }

        return findNextBusinessDay(day.add(1, 'd'))
      })
  )

  return findNextBusinessDay(sanitizedDate)
}

export default nextBusinessDay
