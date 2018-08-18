import React, { PureComponent } from 'react'

import Days from './Days'
import Weekdays from './Weekdays'

import { formatMonthYear } from './lib/dateFormatter'

export default class MonthView extends PureComponent {
  get calendarType() {
    const { calendarType } = this.props

    if (calendarType) {
      return calendarType
    }

    return 'ISO 8601'
  }

  renderWeekdays() {
    const { calendarType } = this
    const { activeStartDate } = this.props

    return <Weekdays calendarType={calendarType} month={activeStartDate} />
  }

  renderDays() {
    const { calendarType, ...childProps } = this.props

    return <Days calendarType={this.calendarType} {...childProps} />
  }

  render() {
    const className = 'react-calendar__month-view'

    const { style, activeStartDate } = this.props

    const label = formatMonthYear(activeStartDate)

    return (
      <div style={style} className={[className].join(' ')}>
        <h3 className="react-calendar__month-name">{label}</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ flexGrow: 1 }}>
            {/* {this.renderWeekdays()} */}
            {this.renderDays()}
          </div>
        </div>
      </div>
    )
  }
}
