import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

class Walls extends React.PureComponent {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({
      private: PropTypes.bool,
      exact: PropTypes.bool,
      path: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      render: PropTypes.func,
    })).isRequired,
    isAuthorized: PropTypes.bool,
    onUnauthorized: PropTypes.func,
    children: PropTypes.node,
  }

  static defaultProps = {
    isAuthorized: false,
    onUnauthorized: () => { },
    children: null,
  }

  render() {
    const {
      routes,
      isAuthorized,
      onUnauthorized,
      children,
    } = this.props

    return (
      <Router>
        <Fragment>
          {children}

          <Switch>
            {routes.map((route) => {
              const { private: privateRoute, ...props } = route
              const key = `route-${(Math.random() * 10000).toFixed(4)}`

              if (privateRoute) {
                return (
                  <PrivateRoute
                    key={key}
                    isAuthorized={isAuthorized}
                    onUnauthorized={onUnauthorized}
                    {...props}
                  />
                )
              }

              return (
                <Route
                  key={key}
                  {...props}
                />
              )
            })}
          </Switch>
        </Fragment>
      </Router>
    )
  }
}

export default Walls
