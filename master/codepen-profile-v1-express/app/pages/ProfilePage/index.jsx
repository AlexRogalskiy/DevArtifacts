/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

/**
 * Internal dependencies
 */
import './style.scss';
import UserCard from '../../components/UserCard';
import SuggestionsCard from '../../components/SuggestionsCard';
import { CardContent } from '../../components/Card';
import Footer from '../../components/Footer';

const propTypes = {
  user: PropTypes.string,
  windowWidth: PropTypes.number,
  history: PropTypes.object,
};

const defaultProps = {
  user: 'andytran',
};

class ProfilePage extends Component {
  componentWillReceiveProps() {
    if (this.props.windowWidth > 768) {
      return browserHistory.push('/');
    }

    return false;
  }

  render() {
    return (
      <div className="page page--profile">
        {this.props.windowWidth <= 768 ?
          <UserCard user={this.props.user} /> :
          <CardContent>
            Oh no, that page you're looking for is unavailable.
          </CardContent>
        }
        <SuggestionsCard />
        <Footer
          style={{
            width: '80%',
            margin: '0 auto',
          }}
        />
      </div>
    );
  }
}

ProfilePage.propTypes = propTypes;
ProfilePage.defaultProps = defaultProps;

export default ProfilePage;
