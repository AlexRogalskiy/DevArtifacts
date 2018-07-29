/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

/**
 * Internal dependencies
 */
import './style.scss';
import Card, { CardThumbnail, CardContent } from '../Card';

/**
 * Local variables
 */
const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  user: PropTypes.string,
};

const defaultProps = {
  user: 'andytran',
};

class UserCard extends Component {
  constructor() {
    super();

    this.state = {
      name: 'CodePen',
      username: 'codepen',
      avatar: 'http://placehold.it/300',
      pens: 0,
      followers: 0,
      following: 0,
      pro: true,
      links: [],
    };
  }

  componentWillMount() {
    this._getUserData();
  }

  componentDidMount() {
    this._getPensCount();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  _getUserData() {
    this.serverRequest = $.get(`http://cpv2api.com/profile/${this.props.user}`, (result) => {
      const data = result.data;

      this.setState({
        name: data.nicename,
        username: data.username,
        avatar: data.avatar,
        followers: data.followers,
        following: data.following,
        pro: data.pro,
        links: data.links,
      });
    });
  }

  _getPensCount() {
    let currentPage = 1;

    const getPage = (page) => {
      this.serverRequest = $.get(`http://cpv2api.com/pens/public/${this.props.user}?page=${page}`, (result) => {
        if (result.success) {
          this.setState({
            pens: this.state.pens + result.data.length,
          });

          currentPage++;

          getPage(currentPage);
        }

        return false;
      });
    };

    getPage(currentPage);
  }

  render() {
    return (
      <Card className="card--user">
        <CardThumbnail src={this.state.avatar} />
        <CardContent>
          <div className="user">
            <div className="user__avatar">
              <img src={this.state.avatar} alt={this.state.name} />
            </div>

            <h1 className="user__name">
              <a href={`http://codepen.io/${this.state.username}/`}>
                {this.state.name}
              </a>
            </h1>

            <h2 className="user__username">
              <a href={`http://codepen.io/${this.state.username}/`}>
                @{this.state.username}
              </a>
            </h2>

            <div className="user__footer">
              <Link to="/pens">
                <div className="user__footer-item user__footer-item--pens">
                  {this.state.pens}
                  <span>Pens</span>
                </div>
              </Link>

              <Link to="/followers">
                <div className="user__footer-item user__footer-item--followers">
                  {this.state.followers}
                  <span>Followers</span>
                </div>
              </Link>

              <Link to="/following">
                <div className="user__footer-item user__footer-item--following">
                  {this.state.following}
                  <span>Following</span>
                </div>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

UserCard.propTypes = propTypes;
UserCard.defaultProps = defaultProps;

export default UserCard;
