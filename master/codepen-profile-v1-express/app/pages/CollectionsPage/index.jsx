/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

/**
 * Internal dependencies
 */
import './style.scss';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const propTypes = {
  user: PropTypes.string,
};

const defaultProps = {
  user: 'andytran',
};

class CollectionsPage extends Component {
  constructor() {
    super();

    this.state = {
      canLoad: true,
      collections: [],
      hasCollections: true,
      loading: true,
      page: 1,
    };

    this._getLocation = this._getLocation.bind(this);
  }

  componentWillMount() {
    this._getPopularCollections();

    window.addEventListener('scroll', this._getLocation);
  }

  componentWillUnmount() {
    this.serverRequest.abort();

    window.removeEventListener('scroll', this._getLocation);
  }

  _getPopularCollections() {
    this.setState({
      canLoad: false,
    });

    this.serverRequest = $.get(`http://cpv2api.com/collections/popular/${this.props.user}?page=${this.state.page}`, (result) => {
      if (result.success) {
        this.setState({
          canLoad: true,
          collections: this.state.collections.concat(result.data),
          hasCollections: true,
          loading: false,
          page: this.state.page + 1,
        });
      } else {
        this.setState({
          hasCollections: false,
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

        this._getPopularCollections();
      }
    }
  }

  _renderCard(collection, index) {
    return (
      <Card key={`collection-${index}`}>
        <CardHeader>
          <a href={collection.link}>{collection.title}</a>
          <span>{collection.penCount}</span>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: collection.details }} />
        </CardContent>
        <CardFooter>
          <a href={collection.url}>
            <Button block>View Collection</Button>
          </a>
        </CardFooter>
      </Card>
    );
  }

  render() {
    return (
      <div className="page page--collections">
        {this.state.collections.length > 0 ?
          this.state.collections.map(this._renderCard) : ''}
        {this.state.hasCollections ?
          '' : <Card><CardContent>No collections available.</CardContent></Card>}
        {this.state.loading ? <Loader /> : ''}
      </div>
    );
  }
}

CollectionsPage.propTypes = propTypes;
CollectionsPage.defaultProps = defaultProps;

export default CollectionsPage;
