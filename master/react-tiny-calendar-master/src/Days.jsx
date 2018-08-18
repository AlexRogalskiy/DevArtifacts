import React, { PureComponent } from 'react'

import Flex from './Flex'
import Day from './Day'

import {
  getDayOfWeek,
  getDaysInMonth,
  getMonthIndex,
  getYear
} from './lib/dates'
import { getTileClasses } from './lib/utils'

export default class Days extends PureComponent {
  get offset() {
    if (this.props.showNeighboringMonth) {
      return 0
    }

    const { activeStartDate, calendarType } = this.props
    return getDayOfWeek(activeStartDate, calendarType)
  }

  /**
   * Defines on which day of the month the grid shall start. If we simply show current
   * month, we obviously start on day one, but if showNeighboringMonth is set to
   * true, we need to find the beginning of the week the first day of the month is in.
   */
  get start() {
    if (this.props.showNeighboringMonth) {
      const { activeStartDate, calendarType } = this.props
      return -getDayOfWeek(activeStartDate, calendarType) + 1
    }
    return 1
  }

  /**
   * Defines on which day of the month the grid shall end. If we simply show current
   * month, we need to stop on the last day of the month, but if showNeighboringMonth
   * is set to true, we need to find the end of the week the last day of the month is in.
   */
  get end() {
    const { activeStartDate } = this.props
    const daysInMonth = getDaysInMonth(activeStartDate)
    if (this.props.showNeighboringMonth) {
      const { year, monthIndex } = this
      const { calendarType } = this.props
      const activeEndDate = new Date(year, monthIndex, daysInMonth)
      return daysInMonth + (7 - getDayOfWeek(activeEndDate, calendarType) - 1)
    }
    return daysInMonth
  }

  get year() {
    const { activeStartDate } = this.props
    return getYear(activeStartDate)
  }

  get monthIndex() {
    const { activeStartDate } = this.props
    return getMonthIndex(activeStartDate)
  }

  render() {
    const { start, end, year, monthIndex } = this

    const { activeStartDate, hover, value, valueType, ...dayProps } = this.props

    const days = []
    for (let day = start; day <= end; day += 1) {
      const date = new Date(year, monthIndex, day)

      days.push(
        <Day
          classes={getTileClasses({
            value,
            valueType,
            date,
            dateType: 'day',
            hover
          })}
          currentMonthIndex={monthIndex}
          date={date}
          key={day}
          {...dayProps}
        />
      )
    }

    return (
      <Flex
        className="react-calendar__month-view__days"
        count={7}
        offset={this.offset}
        wrap
      >
        {days}
      </Flex>
    )
  }
}
