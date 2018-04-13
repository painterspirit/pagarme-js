const isBusinessDay = (country, date) => {
  const sanitizedDate = moment(sanitizedDate(date))

  return queryDateInformation(country, date)
    .then((day) => {
      if (isWeekend(date)) {
        return false
      }

      if (!day) {
        return true
      }

      return !day.holiday && !day.limited_financial_operation
    })
}

export default isBusinessDay
