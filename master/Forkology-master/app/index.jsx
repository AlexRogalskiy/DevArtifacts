/**
 * External dependencies
 */
import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Motion, spring } from 'react-motion';

/**
 * Internal dependencies
 */
import './style.scss';
import Routes from './routes';

render(Routes, document.getElementById('root'));
