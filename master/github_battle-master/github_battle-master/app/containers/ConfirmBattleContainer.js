var React = require('react');
var ConfirmBattle = require('../components/ConfirmBattle');
var githubHelpers = require('../utils/githubHelpers');

var ConfirmBattleContainer = React.createClass({

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return{
			isLoading: true,
			playerInfo: []
		};
	},

	componentDidMount: function(){
		var query = this.props.location.query;
		// fetch info from github then update the state
		githubHelpers.getPlayersInfo(
			[query.playerOne, query.playerTwo]
			).then(function (players) {
				this.setState({
					isLoading: false,
					playerInfo: [players[0], players[1]]
				});
			}.bind(this))
	},

	handleInitiateBattle: function() {
		this.context.router.push({
			pathname: '/results',
			state: {
				playersInfo: this.state.playersInfo
			}
		})
	},
	render: function() {
		return(
			<ConfirmBattle 
				isLoading={this.state.isLoading}
				onInitiateBattle={this.handleInitiateBattle}
				playerInfo={this.state.playerInfo}
			/>
		);
	}
});

module.exports = ConfirmBattleContainer;