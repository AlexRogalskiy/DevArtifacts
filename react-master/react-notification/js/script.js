moment.locale('pt-br');
var fake = [
  { _id: 'ZmFmZTFiNjB', type: 'rebalancing', date: new Date("Apr 5, 2015 12:30:00"), status: 'success', read: false },
  { _id: 'ZDFlYzNmZTN',  type: 'deposit', date: new Date("Apr 5, 2015 12:00:00"), status: 'success', value: 1500, read: false },
  { _id: 'OTYzMjU3MjQ',  type: 'rebalancing', date: new Date("Mar 5, 2015 12:30:00"), status: 'success', read: false },
  { _id: 'OTIwNDk0M2M',  type: 'deposit', date: new Date("Mar 5, 2015 12:00:00"), status: 'success', value: 1500, read: false },
  { _id: 'ODc1YmI2NGQ',  type: 'rebalancing', date: new Date("Feb 5, 2015 12:30:00"), status: 'success', read: false },
  { _id: 'OGVmNjY2Y2Y',  type: 'deposit', date: new Date("Feb 5, 2015 12:00:00"), status: 'success', value: 1500, read: false },
  { _id: 'OWUyYWNmYWY',  type: 'rebalancing', date: new Date("Feb 1, 2015 10:30:00"), status: 'success', read: false },
  { _id: 'M2IzMGM1MTM',  type: 'withdraw', date: new Date("Feb 1, 2015 10:00:00"), status: 'success', value: 10000, read: false },
  { _id: 'YmM4Y2Q1ZjU',  type: 'rebalancing', date: new Date("Jan 1, 2015 13:00:00"), status: 'success', read: false },
  { _id: 'OTQwYjJhYTJ',  type: 'deposit', date: new Date("Jan 1, 2015 12:00:00"), status: 'success', value: 100000, read: false }
];

class NotificationItem extends React.Component {
  constructor() {
    super();
  }
  
  _toggleRead(event) {
    this.props.toggleRead(event.currentTarget.dataset.id);
  }
  
  render() {
    var data = this.props.data,
        icon, title, time, message;

    switch (data.type) {
      case 'withdraw':
        icon = 'i-withdraw';
        title = 'Resgate';
        message = 'Valor da operação: R$ ' + data.value;
        break;
      case 'deposit':
        icon = 'i-deposit';
        title = 'Depósito';
        message = 'Valor da operação: R$ ' + data.value;
        break;
      case 'rebalancing':
        icon = 'i-balance';
        title = 'Rebalanciamento';
        message = 'Sua carteira foi rebalanciada!';
        break;
      default: break;
    }
    return (
      <div className={["notification", data.read ? "notification--read" :  "notification--unread"].join(' ')}>
        <div className={"notification__icon notification__icon--" + icon.substr(2)} ><span className={icon}></span></div>
        <div className="notification__content">
          <div className="notification__title">{title}
            <span className="notification__time">{moment(data.date).format('l')}</span>
          </div>          
          <div className="notification__message">{message}</div>
        </div>
        <div className="notification__read" data-id={data._id} onClick={this._toggleRead.bind(this)}><span className='i-check'></span></div>
      </div>
    );
  }
}

class NotificationApp extends React.Component {

		constructor() {
			super();
			this.state = {
				ready: false,
        hasNotification: false,
        isNotificationOpen: false,
        notifications: []
			}
		}
  
    componentDidMount() {
      //check api
      var hasNotification = true,
          notifications = fake;
      this.setState({hasNotification, notifications});
      
    }
    
    _toggleNotification() {
      var isNotificationOpen = !this.state.isNotificationOpen;
      this.setState({isNotificationOpen});
    }
  
    _toggleAllRead() {
      var notifications = this.state.notifications,
          hasNotification = false;
          notifications.forEach((n) => n.read = true);
      this.setState({hasNotification, notifications});
    }
    
    _toggleRead(id) {
      var notifications = this.state.notifications;
          notifications.map((d) => d._id === id ? d.read = true : '');
      this.setState({notifications});
    }
  
    _getReadLength(arr) {
      return arr.filter((d) => !d.read).length;
    }
  
    render() {
      var output = {},
          state = this.state,
          readLength = this._getReadLength(state.notifications);
            
      output.bell = readLength > 0 ? 'i-bell-full' : 'i-bell-1';
      output.emptiness = readLength > 0 ? 'notification-center--not-empty' :  'notification-center--empty';
      output.openness = state.isNotificationOpen ? 'notification-center--open' : 'notification-center--close';
      output.header = readLength > 0 ? readLength + ' notificações' : 'Tudo atualizado!';
      output.readAll = readLength > 0 ? (<span className="notification-center__toggle-all" onClick={this._toggleAllRead.bind(this)}>
        <span className='i-minus'></span><span className='i-minus'></span><span className='i-minus'></span>
        </span>) : '';
      
      if (state.notifications.length > 0) {
        output.notifications = state.notifications.map((data, index) => (<NotificationItem toggleRead={this._toggleRead.bind(this)} data={data} key={'notification-' + index} />));
      }
      else {
        output.notifications = <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/223946/bell.svg" />;
      }
      
      output.main = (<div className="notification-center__zero">
          <header className="notification-center__zero-header">{output.header}{output.readAll}</header>
          <main className="notification-center__zero-main">{output.notifications}</main>
          <footer className="notification-center__zero-footer">
            <span className="notification-center__zero-anchor">Ver notificações antigas</span>
          </footer>
        </div>);

      output.html = (
        <div className={[output.emptiness, output.openness, 'notification-center header__notification-center'].join(' ')}>
          <div className="notification-center__toggle" onClick={this._toggleNotification.bind(this)}>
            <span className={output.bell + ' notification-center__bell'}></span>
          </div>
          <div className="notification-center__main">
            {output.main}
          </div>
        </div>);

      return (
        <div className="header">
          <div className="header__brand">
            <img height="23px" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/223946/logo.svg" />
          </div>
          {output.html}
        </div>
      )
    }
}

React.render(<NotificationApp />, document.getElementById("notification"));