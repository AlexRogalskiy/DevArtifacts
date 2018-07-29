/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import Card, { CardContent } from '../../components/Card';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {};

const ErrorPage = (props) => {
  let classes = cx({
    page: true,
    'page--error': true,
  }, props.className);

  return (
    <div className={classes}>
      <Card>
        <CardContent>
          Oh no, that page you're looking for is unavailable.
        </CardContent>
      </Card>
    </div>
  );
};

ErrorPage.propTypes = propTypes;
ErrorPage.defaultProps = defaultProps;

export default ErrorPage;
