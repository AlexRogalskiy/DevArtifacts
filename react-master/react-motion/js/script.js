const {
  HashRouter,
  Switch,
  Route,
  Link
} = ReactRouterDOM
const { TransitionMotion, spring } = ReactMotion
const { wrapSwitch } = RRC

const Trans = ({ children }) => (
  <TransitionMotion
    styles={
      children
        ? React.Children.map(children, c => ({
            key: c.key,
            style: { opacity: spring(1) },
            data: c
          }))
        : []
      }
    willEnter={() => ({ opacity: 0 })}
    willLeave={() => ({ opacity: spring(0) })}
   >
    {interpolatedStyles => (
      <div>
        {interpolatedStyles.map(({ style, data, key }) => {
          const { component, ...rest } = data.props
          // cannot clone because that preserves existing props
          return React.createElement(
            Route,
            {
              ...rest,
              key,
              render: (props) => React.createElement(component, { ...props, style })
            }
          )
        })}
      </div>
    )}
  </TransitionMotion>
)

const ComponentA = ({ style }) => <div style={style}>A</div>
const ComponentB = ({ style }) => <div style={style}>B</div>
const ComponentDefault = ({ style }) => <div style={style}>Default</div>

const TMSwitch = wrapSwitch(Trans)

const App = () => (
  <div>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/a'>A</Link></li>
        <li><Link to='/b'>B</Link></li>
      </ul>
    </nav>
    <TMSwitch
      routes={[
        { path: '/a', component: ComponentA },
        { path: '/b', component: ComponentB },
        { component: ComponentDefault }
      ]} 
    />
  </div>
)

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'))