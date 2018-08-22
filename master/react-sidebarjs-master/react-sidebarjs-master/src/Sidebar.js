import React, {Component} from 'react';
import PropTypes from 'prop-types';
import sidebarService from './SidebarService';

class SidebarJS extends Component {
  static propTypes = {
    sidebarjsName: PropTypes.string.isRequired,
    sidebarjsConfig: PropTypes.object,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onChangeVisibility: PropTypes.func,
  };

  componentDidMount() {
    const userConfig = this.props.sidebarjsConfig || {};
    const baseConfig = {
      component: this.component,
      container: this.container,
      backdrop: this.backdrop,
    };
    const onOpen = userConfig.onOpen || this.props.onOpen;
    const onClose = userConfig.onClose || this.props.onClose;
    const onChangeVisibility = userConfig.onChangeVisibility || this.props.onChangeVisibility;
    sidebarService.create({
      ...baseConfig,
      ...userConfig,
      onOpen,
      onClose,
      onChangeVisibility,
    })
  }

  render() {
    const {sidebarjsName, children} = this.props;
    return (
      <div sidebarjs={sidebarjsName} ref={(node) => this.component = node}>
        <div sidebarjs-container="true" ref={(node) => this.container = node}>{children}</div>
        <div sidebarjs-backdrop="true" ref={(node) => this.backdrop = node}></div>
      </div>
    );
  }
}

export default SidebarJS;