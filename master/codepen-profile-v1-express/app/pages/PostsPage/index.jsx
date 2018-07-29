/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

/**
 * Internal dependencies
 */
import './style.scss';
import { numberWithCommas } from '../../helpers';
import ChatboxIcon from '../../assets/img/icon-chatbox.svg';
import EyeIcon from '../../assets/img/icon-eye.svg';
import HeartIcon from '../../assets/img/icon-heart.svg';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/Card';
import Loader from '../../components/Loader';

const propTypes = {
  user: PropTypes.string,
};

const defaultProps = {
  user: 'andytran',
};

class PostsPage extends Component {
  constructor() {
    super();

    this.state = {
      canLoad: true,
      hasPosts: true,
      loading: true,
      page: 1,
      posts: [],
    };

    this._getLocation = this._getLocation.bind(this);
  }

  componentWillMount() {
    this._getPopularPosts();

    window.addEventListener('scroll', this._getLocation);
  }

  componentWillUnmount() {
    this.serverRequest.abort();

    window.removeEventListener('scroll', this._getLocation);
  }

  _getPopularPosts() {
    this.setState({
      canLoad: false,
    });

    this.serverRequest = $.get(`http://cpv2api.com/posts/popular/${this.props.user}?page=${this.state.page}`, (result) => {
      if (result.success) {
        this.setState({
          canLoad: true,
          hasPosts: true,
          page: this.state.page + 1,
          posts: this.state.posts.concat(result.data),
          loading: false,
        });
      } else {
        this.setState({
          hasPosts: false,
          loading: false,
        });
      }
    });
  }

  _getLocation() {
    if (this.state.canLoad) {
      const windowHeight = window.innerHeight;
      const windowOffset = window.pageYOffset;
      const documentHeight = Math.max(
        document.body.offsetHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.scrollHeight
      );

      if (windowOffset + windowHeight === documentHeight) {
        this.setState({
          loading: true,
        });

        this._getPopularPosts(this.state.page);
      }
    }
  }

  _renderCard(post, index) {
    return (
      <Card key={`post-${index}`}>
        <CardHeader>
          <a href={post.link}>{post.title}</a>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
        <CardFooter>
          <div className="card__info card__info--hearts">
            <span className="card__icon" dangerouslySetInnerHTML={{ __html: HeartIcon }} />
            {numberWithCommas(post.loves)}
          </div>
          <div className="card__info card__info--comments">
            <div className="card__icon" dangerouslySetInnerHTML={{ __html: ChatboxIcon }} />
            {numberWithCommas(post.comments)}
          </div>
          <div className="card__info card__info--view">
            <div className="card__icon" dangerouslySetInnerHTML={{ __html: EyeIcon }} />
            {numberWithCommas(post.views)}
          </div>
        </CardFooter>
      </Card>
    );
  }

  render() {
    return (
      <div className="page page--posts">
        {this.state.posts.length > 0 ?
          this.state.posts.map(this._renderCard) : ''}
        {this.state.hasPosts ? '' : <Card><CardContent>No posts available.</CardContent></Card>}
        {this.state.loading ? <Loader /> : ''}
      </div>
    );
  }
}

PostsPage.propTypes = propTypes;
PostsPage.defaultProps = defaultProps;

export default PostsPage;
