/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { __BROWSER__ } from '../../../config';
import Input from '../Input';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Local variables
 */
const propTypes = {};

const defaultProps = {};

/**
 * Page Header Component
 *
 * @since 0.0.1
 */
const PageHeader = ({ className, title }) => {
  const classes = classNames('page-header', className);

  return (
    <header className={classes}>
      <h1 className="page-header__title">{title}</h1>

      <div className="page-header__left">
        <Input type="text" placeholder="Search..." />
      </div>
    </header>
  );
}

export default PageHeader;
