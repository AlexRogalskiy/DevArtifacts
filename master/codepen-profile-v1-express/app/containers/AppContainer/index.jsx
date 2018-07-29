/**
 * External dependencies
 */
import React, { PropTypes, Component, cloneElement } from 'react';
import $ from 'jquery';

/**
 * Internal dependencies
 */
import ArrowUpIcon from '../../assets/img/icon-arrow-up.svg';
import { Container, Row, Column } from '../../components/Grid';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SuggestionsCard from '../../components/SuggestionsCard';
import TrendingCard from '../../components/TrendingCard';
import UserCard from '../../components/UserCard';

import { TabBar } from '../../components/Mobile';

/**
 * Local variables
 */
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class AppContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backToTop: false,
      user: 'andytran',
      fixedHeader: false,
    };

    this._handleToTop = this._handleToTop.bind(this);
  }

  componentWillMount() {
    this.setState({
      windowWidth: window.innerWidth,
    });

    window.addEventListener('resize', this._handleResize.bind(this));
    window.addEventListener('scroll', this._onScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
    window.removeEventListener('scroll', this._onScroll);
  }

  _handleResize() {
    this.setState({
      windowWidth: window.innerWidth,
    });
  }

  _onScroll() {
    if (window.pageYOffset > 0 && !this.state.fixedHeader) {
      this.setState({
        fixedHeader: true,
      });
    } else if (window.pageYOffset <= 0 && this.state.fixedHeader) {
      this.setState({
        fixedHeader: false,
      });
    }

    if (window.pageYOffset > 300 && !this.state.backToTop) {
      this.setState({
        backToTop: true,
      });
    } else if (window.pageYOffset < 300 && this.state.backToTop) {
      this.setState({
        backToTop: false,
      });
    }
  }

  _handleToTop() {
    $('html, body').animate({ scrollTop: 0 });
  }

  render() {
    if (this.state.windowWidth <= 768) {
      return (
        <div className="app app--mobile">
          <Header
            className="header--mobile"
            fixed={this.state.fixedHeader}
            windowWidth={this.state.windowWidth}
          />
          {this.props.children && cloneElement(this.props.children, {
            user: this.state.user,
            windowWidth: this.state.windowWidth,
          })}
          <TabBar />
        </div>
      );
    }

    return (
      <div className="app">
        <Header fixed={this.state.fixedHeader} />
        <Container>
          <Row>
            <Column size={this.state.windowWidth >= 960 ? 3 : 4}>
              <UserCard user={this.state.user} />
              <TrendingCard />

              {this.state.windowWidth >= 960 ? '' : <SuggestionsCard />}
              {this.state.windowWidth >= 960 ? '' : <Footer />}
            </Column>
            <Column size={this.state.windowWidth >= 960 ? 6 : 8}>
              {this.props.children && cloneElement(this.props.children, {
                user: this.state.user,
                windowWidth: this.state.windowWidth,
              })}
            </Column>
            {this.state.windowWidth >= 960 ?
              <Column size={3}><SuggestionsCard /><Footer /></Column> : ''}
          </Row>
        </Container>
        <Button
          className={
            this.state.backToTop ?
              'button--back-to-top button--visible' :
              'button--back-to-top button--hidden'
          }
          onClick={this._handleToTop}
        >
          <span dangerouslySetInnerHTML={{ __html: ArrowUpIcon }} />
        </Button>
      </div>
    );
  }
}

AppContainer.propTypes = propTypes;
AppContainer.defaultProps = defaultProps;

export default AppContainer;
