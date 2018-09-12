import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core'

import { TYPES } from './constants'
import FormFieldInput from './FormFieldInput'
import FormFieldDate from './FormFieldDate'
import FormFieldList from './FormFieldList'
import FormFieldSwitch from './FormFieldSwitch'

const styles = theme => ({
  hidden: {
    display: 'none',
  },

  headline: {
    marginTop: theme.spacing.unit * 3,
  },

  field: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    verticalAlign: 'top',
  },

  fieldInline: {
    display: 'inline-block',
  },

  fieldDate: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },

  widthSmall: {
    width: `calc(25% - ${theme.spacing.unit * 2}px)`,
  },

  widthMid: {
    width: `calc(50% - ${theme.spacing.unit * 2}px)`,
  },

  widthFull: {
    width: `calc(100% - ${theme.spacing.unit * 2}px)`,
  },
})

const FormFieldBranch = ({
  type,
  width,
  classes,
  isVisible,
  ...props
}) => {
  const getClasses = () => {
    const classNames = [classes.field]

    if (width === 'small') {
      classNames.push(classes.widthSmall)
    } else if (width === 'mid') {
      classNames.push(classes.widthMid)
    } else {
      classNames.push(classes.widthFull)
    }

    if (!isVisible) {
      classNames.push(classes.hidden)
    }

    return classNames
  }

  const classNames = getClasses()

  switch (type) {
    case TYPES.SELECT:
      return (
        <FormFieldInput
          {...props}
          select
          selectOptions={props.selectOptions}
          classNames={classNames}
        />
      )
    case TYPES.LIST:
      return (
        <FormFieldList
          {...props}
          classNames={classNames}
        />
      )
    case TYPES.MULTILINE:
      return (
        <FormFieldInput
          {...props}
          classNames={classNames}
          isMultiline
        />
      )
    case TYPES.DATE:
    case TYPES.TIME:
    case TYPES.DATETIME:
      return (
        <FormFieldDate
          {...props}
          classNames={[...classNames, classes.fieldDate]}
          type={type}
        />
      )
    case TYPES.SWITCH:
      return (
        <FormFieldSwitch
          {...props}
          classNames={[...classNames, classes.fieldInline]}
        />
      )
    case TYPES.EMPTY:
      return (
        <div className={classNames.join(' ')} />
      )
    case TYPES.CONTENT:
      return (
        <div className={[...classNames, classes.field].join(' ')}>
          {props.content}
        </div>
      )
    default:
      return (
        <FormFieldInput
          {...props}
          type={type}
          classNames={classNames}
        />
      )
  }
}

FormFieldBranch.propTypes = {
  type: PropTypes.string,
  width: PropTypes.string,
  listItems: PropTypes.arrayOf(PropTypes.object),
  selectOptions: PropTypes.arrayOf(PropTypes.string),
  content: PropTypes.node,
  isVisible: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func,
}

FormFieldBranch.defaultProps = {
  type: 'text',
  width: 'full',
  listItems: [],
  selectOptions: [],
  content: null,
  isVisible: true,
  handleChange: () => { },
}

export default withStyles(styles)(FormFieldBranch)
