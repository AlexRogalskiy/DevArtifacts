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
import TrendingIcon from '../../assets/img/icon-trending.svg';
import Card, { CardHeader, CardContent, CardFooter } from '../Card';
import Button from '../Button';
import Loader from '../Loader';

/**
 * Local variables
 */
const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

const defaultProps = {};

class TrendingCard extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      more: false,
      trending: [],
    };

    this._handleMore = this._handleMore.bind(this);
  }

  componentWillMount() {
    this._getTrendingData();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  _getTrendingData() {
    this.serverRequest = $.get('http://cpv2api.com/pens/popular', (result) => {
      $.each(result.data, (key, value) => {
        const newData = {
          title: value.title,
          views: value.views,
          hearts: value.loves,
          url: value.link,
        };

        this.setState({
          loading: false,
          trending: this.state.trending.concat([newData]),
        });
      });
    });
  }

  _handleMore() {
    this.setState({
      more: !this.state.more,
    });
  }

  _renderItem(item, key) {
    if (!this.state.more && key >= 6 || key >= 10) {
      return false;
    }

    return (
      <div
        key={`trending-item-${key}`}
        className="trending__item"
      >
        <span className="trending__icon" dangerouslySetInnerHTML={{ __html: TrendingIcon }} />
        <div className="trending__info">
          <div className="trending__title">
            <a href={item.url}>{item.title}</a>
          </div>
          <div className="trending__likes">{numberWithCommas(item.views)} views</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Card className="card--trending">
        <CardHeader>Trending</CardHeader>
        <CardContent>
          <div className="trending">
            {this.state.loading ? <Loader /> : this.state.trending.map(this._renderItem.bind(this))}
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

TrendingCard.propTypes = propTypes;
TrendingCard.defaultProps = defaultProps;

export default TrendingCard;
