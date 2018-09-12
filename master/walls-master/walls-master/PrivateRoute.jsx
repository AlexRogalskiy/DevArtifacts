import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

const PrivateRoute = ({
  isAuthorized,
  onUnauthorized,
  ...props
}) => {
  if (!isAuthorized) {
    onUnauthorized()

    return null
  }

  return (
    <Route {...props} />
  )
}

PrivateRoute.propTypes = {
  isAuthorized: PropTypes.bool,
  onUnauthorized: PropTypes.func,
}

PrivateRoute.defaultProps = {
  isAuthorized: false,
  onUnauthorized: () => {},
}

export default PrivateRoute
