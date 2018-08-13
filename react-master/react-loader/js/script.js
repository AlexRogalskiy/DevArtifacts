class PlanLoader extends React.Component {

		constructor() {
			super();
			this.state = {
				words: null,
				activeWord: null
			}
		}

    componentDidMount() {
        var words = React.findDOMNode(this.refs.texts).children;
			
				for (let i in words) {
						if (words[i].nodeType == 1) {
							this._splitText(words[i]);
						}
        }
			
        this.setState({
						words,
            activeWord: 0
        });

    }
	
    componentDidUpdate() {
        this._animateWords(this.state.words[this.state.activeWord]);
    }

    _stringToArray(string) {
        var arr = [];

				for (let i in string) { arr.push(string[i]); }

        return arr;
    }

    _splitText(el) {
				var string = el.innerHTML, 
						arr = this._stringToArray(string),
						html = '';
				
				for (let i in arr) {
						html += ['<span>', arr[i], '</span>'].join('');
				}
				
        el.innerHTML = html;
    }

    _animateWords(el) {

				el.classList.add('plan-loader__phrase--visible');

        var chars = el.children,
						i = 0,
						delay = 1500;
		
        this.interval = setInterval(() => {
						chars[i++].style.opacity = 1;
						
						if (i >= chars.length) {

                clearInterval(this.interval);
                setTimeout(this._nextWord.bind(this), 2000);
            }
						
        }, delay / (chars.length * i));
    }

    _nextWord() {
        var state = this.state,
            el = state.words[state.activeWord];

        if (state.activeWord < state.words.length - 1) {
            el.classList.remove('plan-loader__phrase--visible');
            this.setState({activeWord: state.activeWord + 1 });
        }

        else {
            React.findDOMNode(this.refs.planLoader).classList.add('plan-loader--finish');
            setTimeout(this._onComplete.bind(this), 2000);
        }
    }
	
		_onComplete() {
				React.findDOMNode(this.refs.planLoader).classList.remove('plan-loader--finish');
				location = location;
		}
	
    render() {
        return (
            <div className="plan-loader" ref="planLoader">
                <div className="plan-loader__glass">
                    <div className="plan-loader__under-content">
												<img className="plan-loader__big-gear" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/223946/big-gear.svg" />
                        <img className="plan-loader__small-gear" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/223946/small-gear.svg" />
												<img className="plan-loader__micro-gear" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/223946/micro-gear.svg" />
                    </div>
                </div>
                <div className="plan-loader__upper-content">
										<img className="plan-loader__big-gear" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/223946/big-gear.svg" />
										<img className="plan-loader__small-gear" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/223946/small-gear.svg" />
										<img className="plan-loader__micro-gear" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/223946/micro-gear.svg" />
                </div>
                <div className="plan-loader__upper-text" ref="texts">
                    <span className="plan-loader__phrase">gerando retorno esperado com base no valor de mercado . . .</span>
                    <span className="plan-loader__phrase">criando gradiente de balanceamento entre ativos . . .</span>
                    <span className="plan-loader__phrase">calculando a melhor alocação livre de risco . . .</span>
                    <span className="plan-loader__phrase">diluindo alocação nas carteiras diversificadas da Vérios . . .</span>
                    <span className="plan-loader__phrase">Seu plano de investimento está pronto!</span>
                </div>
            </div>
        );
    }
};

React.render(<PlanLoader />, document.getElementById("app"));