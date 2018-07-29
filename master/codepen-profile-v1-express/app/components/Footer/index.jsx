/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import Nav from '../Nav';

/**
 * Local variables
 */
const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

const defaultProps = {};

/**
 * <Footer />
 */
const Footer = (props) => {
  let classes = cx('footer', props.className);

  let menu = [
    [
      {
        anchor: true,
        url: 'http://andytran.me',
        children: 'Website',
      },
      {
        anchor: true,
        url: 'https://github.com/andyhqtran',
        children: 'GitHub',
      },
      {
        anchor: true,
        url: 'http://codepen.io/andytran',
        children: 'CodePen',
      },
      {
        anchor: true,
        url: 'https://twitter.com/helloandytran',
        children: 'Twitter',
      },
      {
        anchor: true,
        url: 'https://www.facebook.com/icptpandy',
        children: 'Facebook',
      },
      {
        anchor: true,
        url: 'https://instagram.com/helloandytran',
        children: 'Instagram',
      },
      {
        anchor: true,
        url: 'mailto:hello@andytran.me' +
          '?subject=Uh-oh! There\'s a bug on you\'re website!' +
          '?body=Hey Andy!<br><br>&nbsp;',
        children: 'Bugs',
      },
      {
        anchor: true,
        url: 'http://cpv2api.com/',
        children: 'API',
      },
    ],
  ];

  return (
    <footer
      className={classes}
      style={props.style}
    >
      <Nav menus={menu} />
      <div className="footer__copyright">
        &copy; {new Date().getFullYear()} Andy Tran
      </div>
    </footer>
  );
};

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
