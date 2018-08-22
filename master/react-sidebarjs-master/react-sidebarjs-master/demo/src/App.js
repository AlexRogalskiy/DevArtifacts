import React, {Component} from 'react';
import {SidebarJS, sidebarService} from 'react-sidebarjs';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';

const View = ({name}) =>
  <div id="selected">
    <div className={'img ' + name.toLowerCase()}></div>
    <div className="label">{name}</div>
  </div>;

const GitHub = () => View({name: 'GitHub'});
const Npm = () => View({name: 'npm'});
const Author = () => View({name: 'Author'});
const Wiki = () => View({name: 'Wiki'});
const Bugs = () => View({name: 'Bugs'});

const activeNav = {fontWeight: 'bold'};

const AppNavLink = ({to, image, ...props}) =>
  <NavLink to={to} activeStyle={activeNav} onClick={() => sidebarService.close('MainSidebar')}>
    <div className={'img ' + image}></div>
    {props.children}
  </NavLink>;

class App extends Component {
  state = {
    isVisibleSidebar: false,
  };

  toggleSidebar = () => {
    sidebarService.toggle('MainSidebar');
  };

  changeSidebarVisibility = (changes) => {
    this.setState({
      isVisibleSidebar: changes.isVisible,
    });
  };

  render() {
    return (
      <div className="App">

        <SidebarJS sidebarjsName="MainSidebar" onChangeVisibility={this.changeSidebarVisibility}>
          <h3>React SidebarJS</h3>
          <nav>
            <div>
              <AppNavLink to="/github" image="github">GitHub</AppNavLink>
              <AppNavLink to="/npm" image="npm">npm</AppNavLink>
              <AppNavLink to="/author" image="author">Author</AppNavLink>
            </div>
            <div>
              <AppNavLink to="/wiki" image="wiki">Wiki</AppNavLink>
              <AppNavLink to="/bugs" image="bugs">Bugs</AppNavLink>
            </div>
          </nav>
        </SidebarJS>

        <header>
          <div className="icon hamburger-icon" onClick={this.toggleSidebar}></div>
          <h1>React SidebarJS</h1>
        </header>

        <main>
          <div style={{padding: '12px', textAlign: 'center'}}>
            <div>Is visible?</div>
            <div style={{marginTop: '6px'}}>{this.state.isVisibleSidebar.toString()}</div>
          </div>
          <Switch>
            <Route path="/github" component={GitHub}/>
            <Route path="/npm" component={Npm}/>
            <Route path="/author" component={Author}/>
            <Route path="/wiki" component={Wiki}/>
            <Route path="/bugs" component={Bugs}/>
            <Redirect to="/github"/>
          </Switch>
        </main>

      </div>
    );
  }
}

export default App;
