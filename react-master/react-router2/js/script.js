const {
  Router,
  Route,
  Link,
  hashHistory
} = ReactRouter

const Home = React.createClass({
  render() {
    const { location } = this.props
    return (
      <div>
        <div>
          Current Location: {location.pathname}
        </div>
        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/login'>Login</Link></li>
          </ul>
        </nav>
        {this.props.children}
      </div>
    )
  }
})

const Login = React.createClass({
  render() {
    return (
      <div>
        Login Page
      </div>
    )
  }
})

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <Route path="/login" component={Login}/>
    </Route>
  </Router>
), document.getElementById('app'))
