/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import './style.scss';
import EyeIcon from '../../assets/img/icon-eye.svg';
import users from './helpers/users';
import Card, { CardHeader, CardContent, CardFooter } from '../Card';
import Button from '../Button';

/**
 * Local variables
 */
const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

const defaultProps = {};

class SuggestionsCard extends Component {
  constructor() {
    super();

    this.state = {
      more: false,
      users,
    };

    this._handleMore = this._handleMore.bind(this);
  }

  _handleMore() {
    this.setState({
      more: !this.state.more,
    });
  }

  _renderUser(user, key) {
    if (!this.state.more && key >= 6 || key >= 10) {
      return false;
    }

    return (
      <div
        key={`suggestion-user-${key}`}
        className="suggestions__user"
      >
        <div className="suggestions__avatar">
          <img src={user.image} alt={user.name} />
        </div>
        <div className="suggestions__info">
          <a href={`http://codepen.io/${user.username}`}>
            <span>{user.name}</span>
          </a>
          <a href={`http://codepen.io/${user.username}`}>
            <span>{user.username}</span>
          </a>
        </div>

        <a href={`http://codepen.io/${user.username}`}>
          <Button
            outline
            primary
          >
            <div className="suggestions__icon" dangerouslySetInnerHTML={{ __html: EyeIcon }} />
          </Button>
        </a>
      </div>
    );
  }

  render() {
    return (
      <Card className="card--suggestions">
        <CardHeader>Suggestions for You</CardHeader>
        <CardContent>
          <div className="suggestions">
            {this.state.users.map(this._renderUser.bind(this))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={this._handleMore}
            block
          >
            {this.state.more ? 'View Less' : 'View More'}
          </Button>
        </CardFooter>
      </Card>
    );
  }
}

SuggestionsCard.propTypes = propTypes;
SuggestionsCard.defaultProps = defaultProps;

export default SuggestionsCard;
