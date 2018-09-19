const { spring, TransitionMotion } = ReactMotion

const willLeave = () => ({
  borderWidth: 0
})

const App = () => (
  <TransitionMotion
    defaultStyles={[
      { key: 'one', style: {borderWidth: 0}},
      { key: 'two', style: {borderWidth: 0}},
      { key: 'three', style: {borderWidth: 0}}
    ]}
    styles={[
      { key: 'one', style: { borderWidth: spring(10) }, data: 'one'},
      { key: 'two', style: { borderWidth: spring(5) }, data: 'two'},
      { key: 'three', style: { borderWidth: spring(15) }, data: 'three'}
    ]}
    willLeave={willLeave}
  >
    {(styles) => (
      <div>
        { styles.map(({ key, style, data}) => (
          <div key={key} style={{
            borderColor: 'black',
            borderStyle: 'solid',
            ...style
          }}>{ data }</div>
        ))}
      </div>
    )}
  </TransitionMotion>
)

const root = document.getElementById('root')
// do this every 5 seconds so that it isn't just a
// one and done animation
setInterval(() => {
  root.innerHTML = ''
  ReactDOM.render(<App />, root)
}, 5000)
