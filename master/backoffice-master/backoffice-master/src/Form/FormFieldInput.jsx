import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import {
  TextField,
  InputAdornment,
  MenuItem,
} from '@material-ui/core'

const InputEnd = ({ icon }) => (
  <Fragment>
    {icon ? (
      <InputAdornment position="end">
        {icon}
      </InputAdornment>
    ) : null}
  </Fragment>
)

InputEnd.propTypes = {
  icon: PropTypes.element,
}

InputEnd.defaultProps = {
  icon: null,
}

const FormFieldInput = ({
  id,
  type,
  title,
  value,
  isMultiline,
  handleChange,
  helperText,
  defaultValue,
  select,
  options,
  rows,
  isRequired,
  error,
  iconEnd,
  isDisabled,
  classNames,
  onFocus,
  onBlur,
  onKeyPress,
}) => (
  <TextField
    id={id}
    type={type}
    label={title}
    value={value}
    multiline={isMultiline}
    onChange={handleChange(id)}
    className={classNames.join(' ')}
    helperText={helperText}
    defaultValue={defaultValue}
    select={select}
    required={isRequired}
    error={error}
    margin="normal"
    fullWidth
    rows={rows}
    disabled={isDisabled}
    onFocus={onFocus}
    onBlur={onBlur}
    onKeyPress={onKeyPress}
    InputProps={{
      endAdornment: (<InputEnd icon={iconEnd} />),
    }}
  >
    {options ?
        options.map(option => (
          <MenuItem value={option} key={option.toLowerCase().replace(/ /, '')}>
            {option}
          </MenuItem>
        ))
      : null
    }
  </TextField>
)

FormFieldInput.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
  ]),
  rows: PropTypes.number,
  isMultiline: PropTypes.bool,
  helperText: PropTypes.string,
  isRequired: PropTypes.bool,
  error: PropTypes.bool,
  classNames: PropTypes.arrayOf(PropTypes.string),
  handleChange: PropTypes.func,
  select: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string),
  isDisabled: PropTypes.bool,
  iconEnd: PropTypes.element,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
}

FormFieldInput.defaultProps = {
  type: 'text',
  value: '',
  defaultValue: undefined,
  isMultiline: false,
  helperText: '',
  classNames: [],
  isRequired: false,
  error: false,
  rows: 1,
  select: false,
  options: [],
  iconEnd: null,
  isDisabled: false,
  handleChange: () => { },
  onFocus: () => { },
  onBlur: () => { },
  onKeyPress: () => { },
}

export default FormFieldInput
