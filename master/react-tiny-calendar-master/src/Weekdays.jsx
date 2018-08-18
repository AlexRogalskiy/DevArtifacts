import React, { PureComponent } from 'react'

import Flex from './Flex'

import {
  getBeginOfMonth,
  getDayOfWeek,
  getMonthIndex,
  getYear
} from './lib/dates'
import { formatShortWeekday } from './lib/dateFormatter'

export default class Weekdays extends PureComponent {
  get beginOfMonth() {
    const { month } = this.props

    return getBeginOfMonth(month)
  }

  get year() {
    const { beginOfMonth } = this

    return getYear(beginOfMonth)
  }

  get monthIndex() {
    const { beginOfMonth } = this

    return getMonthIndex(beginOfMonth)
  }

  render() {
    const { beginOfMonth, year, monthIndex } = this
    const { calendarType } = this.props

    const weekdays = []

    for (let weekday = 1; weekday <= 7; weekday += 1) {
      const weekdayDate = new Date(
        year,
        monthIndex,
        weekday - getDayOfWeek(beginOfMonth, calendarType)
      )

      weekdays.push(
        <div
          className="react-calendar__month-view__weekdays__weekday"
          key={weekday}
          style={{ flexGrow: 1 }}
        >
          {formatShortWeekday(weekdayDate).replace('.', '')}
        </div>
      )
    }

    return (
      <Flex className="react-calendar__month-view__weekdays" count={7}>
        {weekdays}
      </Flex>
    )
  }
}
