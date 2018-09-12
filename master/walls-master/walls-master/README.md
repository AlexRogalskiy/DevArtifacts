# Walls

Walls is a [`react-router-dom`](https://reacttraining.com/react-router/)
implementation that builds upon configuration.

[![Build Status](https://travis-ci.org/drublic/walls.svg?branch=master)](https://travis-ci.org/drublic/walls)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdrublic%2Fwalls.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdrublic%2Fwalls?ref=badge_shield)

## Usage

### Installing

If you use yarn, just run the following command in your project’s root directory.

    yarn add walls

Or using npm:

    npm install --save walls

### With React

```javascript
import routes from './routes'

const MyApp = ({ isAuthorized, onUnauthorized }) => (
  <Walls
    routes={routes}
    isAuthorized={isAuthorized}
    onUnauthorized={onUnauthorized}
  />
)
```

## Walls Component

Walls is the main routing component

### Properties

* `routes: Route[]`, configuration for all routes
* `isAuthorized: boolean`, is current user authorized
* `onUnauthorized: function`, if not authorized, do this

### Route

* `private: boolean`, Is this route protected?
* `exact: boolean`, Should the path match exactly?
* `path: string`, path to this route
* `render: function`, a rendering function

## License

This framework is licensed under [MIT](./LICENSE)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdrublic%2Fwalls.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdrublic%2Fwalls?ref=badge_large)
