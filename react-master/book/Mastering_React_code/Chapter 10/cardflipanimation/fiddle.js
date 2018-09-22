var Card = React.createClass({
  getInitialState: function () { return {}; },
  flip: function () {
    this.setState({flipped: !this.state.flipped});
  },
  render: function () {
    return (
      <div 
        onClick={this.flip} 
        className={classNames('card-component', {'flipped': this.state.flipped})}>
        <div className="front">
          <div className="inner">{this.props.children}</div>
        </div>
        <div className="back">&nbsp;</div>
      </div>
    );
  }
});

var Deck = React.createClass({
  cards: ['A', 'B', 'C'],
  render: function () {
    var cards = this.cards.map(function (cardIdentity) {
      return <Card key={cardIdentity}>{cardIdentity}</Card>;
    }.bind(this));
    return <div className="deck-component">{cards}</div>;
  }
});

ReactDOM.render(<Deck />, document.getElementById('app'));