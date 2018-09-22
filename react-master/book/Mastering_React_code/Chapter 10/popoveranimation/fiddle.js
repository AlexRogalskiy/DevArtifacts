var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
 
var Popover = React.createClass({
  render: function () {
    return (
      <div className="popover-component">
        {this.props.children}
      </div>
      );
    }
});

var App = React.createClass({
  getInitialState: function() { return {}; },
  toggleMenu: function (id) {
    this.setState({'activeMenu': this.state.activeMenu === id ? null : id});
  },
  render: function () {
    return (
      <div className="application">
        <header>
          <h1>My Rad App</h1>
          <nav>
          <ul>
            <li onClick={this.toggleMenu.bind(this, 1)}>
              <label>Menu 1</label>
              <ReactCSSTransitionGroup 
               transitionName="popoveranim" 
               transitionEnterTimeout={350} 
               transitionLeaveTimeout={350}>
              {this.state.activeMenu === 1 ? 
                <Popover key={1}>
                 <strong>Menu 1 Content</strong><br/>
                 <a href="http://www.google.com">Goto Google</a>
                </Popover>
                : []
              }
              </ReactCSSTransitionGroup>
            </li>
            <li onClick={this.toggleMenu.bind(this, 2)}>
              <label>Menu 2</label>
              <ReactCSSTransitionGroup 
               transitionName="popoveranim"
               transitionEnterTimeout={350} 
               transitionLeaveTimeout={350}>
              {this.state.activeMenu === 2 ? 
                <Popover key={2}>
                	<strong>Menu 2 Content</strong>
                    <nav>
                      <ul>
                        <li>Menu 2 item</li>
                        <li>another menu 2 item</li>
                        </ul>
                    </nav>
                </Popover>
                : []
              }
              </ReactCSSTransitionGroup>
            </li>
          </ul>
          </nav>
        </header>
        <main>
          Lorem Ipsum
        </main>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));