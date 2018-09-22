var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var gameSystems = [
  'Sega Genesis',
  'Sega Saturn',
  'Sega Dreamcast',
  'Nintendo Entertainment System',
  'Super Nintendo',
  'PC',
  'PC Engine',
  'Gameboy',
  'Playstation',
  'PSP'
];

var SuperFlyList = React.createClass({
  propTypes: {
    filter: React.PropTypes.string
  },
  getInitialState: function () { return {}; },
  componentDidMount: function () {
    this.setState({
      eleHeight: ReactDOM.findDOMNode(this).querySelector('li').clientHeight
    });
  },
  render: function () {
    var itemsToDisplay = this.props.list
      .map(function (item, idx) {
        return { name: item, key: idx };
      })
      .filter(function (item) {
        return this.props.filter ? item.name.toLowerCase()
          .indexOf(this.props.filter) !== -1 : true;
      }.bind(this))
      .map(function (item, idx) { 
        return (
          <li 
            key={item.key}
            style={{top: this.state.eleHeight*idx+'px'}}>
            {item.name}
          </li>
        );
      }.bind(this));

    var totalHeight = itemsToDisplay.length * this.state.eleHeight;
      return (
        <ReactCSSTransitionGroup 
          className="super-fly-list-component" 
          style={{height: totalHeight + 'px'}} 
          component="ul" 
          transitionName="superfly"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
            <li className="measure" key="measure">&nbsp;</li>
            {itemsToDisplay}
        </ReactCSSTransitionGroup>
      );
    }
});

var App = React.createClass({
  getInitialState: function () { return {}; },
    search: function () {
      this.setState({query: ReactDOM.findDOMNode(this.refs.search).value});
    },
  render: function () {
    return (
      <main>
        <label>
          Search: 
          <input ref="search" type="text" onChange={this.search} />
        </label>
        <SuperFlyList list={gameSystems} filter={this.state.query} />
      </main>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));