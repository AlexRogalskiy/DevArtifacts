import React, { Component } from 'react'
import mergeClassNames from 'merge-class-names'
import VirtualList from 'react-tiny-virtual-list'

import MonthView from './MonthView'

import { getBegin, getEnd, getValueRange, getDifferentMonth } from './lib/dates'
import { between, callIfDefined, mergeFunctions } from './lib/utils'

export default class Calendar extends Component {
  getValueFrom = value => {
    if (!value) {
      return null
    }

    const { maxDate, minDate } = this.props
    const rawValueFrom =
      value instanceof Array && value.length === 2 ? value[0] : value
    const valueFromDate = new Date(rawValueFrom)

    if (Number.isNaN(valueFromDate.getTime())) {
      throw new Error(`Invalid date: ${value}`)
    }

    const valueFrom = getBegin('day', valueFromDate)

    return between(valueFrom, minDate, maxDate)
  }

  state = {
    value: this.props.value,
    activeStartDate: this.getActiveStartDate()
  }

  getActiveStartDate(props = this.props) {
    const rangeType = 'month'
    const valueFrom =
      props.activeStartDate || this.getValueFrom(props.value) || new Date()
    return getBegin(rangeType, valueFrom)
  }

  onChange = value => {
    const { selectRange } = this.props

    let nextValue
    if (selectRange) {
      const { value: previousValue } = this.state
      // Range selection turned on
      if (
        !previousValue ||
        [].concat(previousValue).length !== 1 // 0 or 2 - either way we're starting a new array
      ) {
        // First value
        nextValue = getBegin('day', value)
      } else {
        // Second value
        nextValue = getValueRange('day', previousValue, value)
        callIfDefined(this.props.onChange, nextValue)
      }
    } else {
      // Range selection turned off
      nextValue = this.getValueFrom(value)
      callIfDefined(this.props.onChange, nextValue)
    }

    this.setState({ value: nextValue })
  }

  renderMonthView = ({ index, style }) => {
    const {
      calendarType,
      maxDate,
      minDate,
      renderChildren,
      tileClassName,
      tileContent
    } = this.props
    const { activeStartDate, value } = this.state
    const { onMouseOver } = this

    const clickAction = this.onChange

    return (
      <MonthView
        onClick={mergeFunctions(clickAction, this.props.onClickDay)}
        activeStartDate={getDifferentMonth(activeStartDate, index)}
        maxDate={maxDate}
        minDate={minDate}
        tileClassName={tileClassName}
        tileContent={tileContent || renderChildren}
        value={value}
        valueType="day"
        style={style}
      />
    )
  }

  render() {
    const { className, selectRange } = this.props
    const { value, activeStartDate } = this.state
    const { onMouseOut } = this
    const valueArray = [].concat(value)

    let scrollToIndex
    if (value) {
      const displayFrom = activeStartDate
      const displayTo = this.getValueFrom(value)
      scrollToIndex =
        displayTo.getMonth() -
        displayFrom.getMonth() +
        12 * (displayTo.getFullYear() - displayFrom.getFullYear())
    } else {
      scrollToIndex = 0
    }

    return (
      <div
        className={mergeClassNames(
          'react-calendar',
          selectRange &&
            valueArray.length === 1 &&
            'react-calendar--selectRange',
          className
        )}
        onMouseOut={selectRange ? onMouseOut : null}
        onBlur={selectRange ? onMouseOut : null}
      >
        <VirtualList
          value={value}
          width="auto"
          height={500}
          itemCount={13}
          itemSize={235}
          overscanCount={3}
          renderItem={this.renderMonthView}
          scrollToAlignment={'auto'}
          scrollToIndex={scrollToIndex}
        />
      </div>
    )
  }
}

Calendar.defaultProps = {
  maxDetail: 'month'
}
