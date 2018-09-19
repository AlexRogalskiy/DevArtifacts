const {
  HashRouter,
  Switch,
  Route,
  Link
} = ReactRouterDOM

const Nav = () => (
  <nav>
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li>
        <Link
          to={{ pathname: '/product', search: '?id=1' }}
        >
          One
        </Link>
      </li>
      <li>
        <Link
          to='/product?id=23'
        >
          Twenty-Three
        </Link>
      </li>
    </ul>
  </nav>
)

const Product = ({ location }) => (
  <div>
    <p>Product:</p>
    <ul>
      <li>Pathname: {location.pathname}</li>
      <li>Search: {location.search}</li>
      <li>Hash: {location.hash}</li>
    </ul>
  </div>
)

ReactDOM.render((
  <HashRouter>
    <div>
      <Route component={Nav} />
      <Route path='/product' component={Product}/>
    </div>
  </HashRouter>
), document.getElementById('root'))