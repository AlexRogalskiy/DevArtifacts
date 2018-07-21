const styled = styled.default;
const { Component } = React;

const data = {
  letters: "abcdefghijklmnopqrstuvwxyz".split(""),
  numbers: "0123456789".split(""),
  symbols: "<>;'\"[]{}+=()&%$#@!_-*:.,`".split("")
};

const StyledButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 1.3rem;
  background: ${props => props.background || "transparent"};
  border-radius: 3px;
  display: inline-block;
  border: 2px solid #000;
  cursor: pointer;
  transition: 0.25s;
  will-change: transform;
  ${props =>
    props.italic && "font-style: italic;"} box-shadow: -1px 1px 0px #333,
    -2px 2px 0px #333,
    -3px 3px 0px #333,
    -4px 4px 0px #333;

  &:hover {
    transform: scale(1.05);
    box-shadow: -1px 1px 0px #333, -2px 2px 0px #333, -3px 3px 0px #333,
      -4px 4px 0px #333, -5px 5px 0px #333, -6px 6px 0px #333;
  }

  &:active {
    transform: scale(0.95);
    box-shadow: -1px 1px 0px #222, -2px 2px 0px #222;
  }
`;

function Button(props) {
  return (
    <StyledButton onClick={props.handleClick} {...props}>
      {props.children}
    </StyledButton>
  );
}

const BlockLabel = styled.label`
  display: block;
  margin: 10px 0;
  position: relative;
  font-size: 1.3rem;
  cursor: pointer;
  transition: 0.25s;

  input {
    display: none;
  }

  span {
    display: block;
    padding-left: 50px;

    &::before {
      content: "";
      position: absolute;
      height: 10px;
      width: 10px;
      border: 2px solid black;
      left: 20px;
      top: 5px;
      transition: 0.25s;
    }
  }

  input:checked + span {
    font-size: 1.4rem;

    &::before {
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
      height: 20px;
      top: -2px;
    }
  }
`;

function StyledCheckbox(props) {
  let disabled = false;
  let spanStyles = {
    opacity: 1
  };
  if (props.disabled === true) {
    disabled = true;
    spanStyles.opacity = 0.75;
  }
  return (
    <BlockLabel>
      <input
        type="checkbox"
        disabled={disabled}
        value={props.value}
        checked={props.checked}
        onChange={props.handleInput}
      />
      <span style={spanStyles}>{props.children}</span>
    </BlockLabel>
  );
}

const AnimatedHeader = styled.h1`
  animation: header-animation 2s infinite linear;
  font-family: "Bungee Shade", cursive;
  text-align: center;
  font-size: 4rem;

  @keyframes header-animation {
    0% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #ddd, -4px 4px #ddd,
        -5px 5px #ddd, -6px 6px #fff, -7px 7px #fff, -8px 8px #fff,
        -9px 9px #fff, -10px 10px #fff;
    }
    10% {
      text-shadow: -1px 1px #fff, -2px 2px #ddd, -3px 3px #ddd, -4px 4px #ddd,
        -5px 5px #ddd, -6px 6px #ddd, -7px 7px #fff, -8px 8px #fff,
        -9px 9px #fff, -10px 10px #fff;
    }
    20% {
      text-shadow: -1px 1px #fff, -2px 2px #fff, -3px 3px #ddd, -4px 4px #ddd,
        -5px 5px #ddd, -6px 6px #ddd, -7px 7px #ddd, -8px 8px #fff,
        -9px 9px #fff, -10px 10px #fff;
    }
    30% {
      text-shadow: -1px 1px #fff, -2px 2px #fff, -3px 3px #fff, -4px 4px #ddd,
        -5px 5px #ddd, -6px 6px #ddd, -7px 7px #ddd, -8px 8px #ddd,
        -9px 9px #fff, -10px 10px #fff;
    }
    40% {
      text-shadow: -1px 1px #fff, -2px 2px #fff, -3px 3px #fff, -4px 4px #fff,
        -5px 5px #ddd, -6px 6px #ddd, -7px 7px #ddd, -8px 8px #ddd,
        -9px 9px #ddd, -10px 10px #fff;
    }
    50% {
      text-shadow: -1px 1px #fff, -2px 2px #fff, -3px 3px #fff, -4px 4px #fff,
        -5px 5px #fff, -6px 6px #ddd, -7px 7px #ddd, -8px 8px #ddd,
        -9px 9px #ddd, -10px 10px #ddd;
    }
    60% {
      text-shadow: -1px 1px #ddd, -2px 2px #fff, -3px 3px #fff, -4px 4px #fff,
        -5px 5px #fff, -6px 6px #fff, -7px 7px #ddd, -8px 8px #ddd,
        -9px 9px #ddd, -10px 10px #ddd;
    }
    70% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #fff, -4px 4px #fff,
        -5px 5px #fff, -6px 6px #fff, -7px 7px #fff, -8px 8px #ddd,
        -9px 9px #ddd, -10px 10px #ddd;
    }
    80% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #ddd, -4px 4px #fff,
        -5px 5px #fff, -6px 6px #fff, -7px 7px #fff, -8px 8px #fff,
        -9px 9px #ddd, -10px 10px #ddd;
    }
    90% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #ddd, -4px 4px #ddd,
        -5px 5px #fff, -6px 6px #fff, -7px 7px #fff, -8px 8px #fff,
        -9px 9px #fff, -10px 10px #ddd;
    }
    100% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #ddd, -4px 4px #ddd,
        -5px 5px #ddd, -6px 6px #fff, -7px 7px #fff, -8px 8px #fff,
        -9px 9px #fff, -10px 10px #fff;
    }
  }

  @keyframes header-animation-2 {
    0% {
      text-shadow: -1px 1px #fff, -2px 2px #fff, -3px 3px #fff, -4px 4px #fff,
        -5px 5px #fff;
    }
    20% {
      text-shadow: -1px 1px #ddd, -2px 2px #fff, -3px 3px #fff, -4px 4px #fff,
        -5px 5px #fff;
    }
    40% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #fff, -4px 4px #fff,
        -5px 5px #fff;
    }
    60% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #ddd, -4px 4px #fff,
        -5px 5px #fff;
    }
    80% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #ddd, -4px 4px #ddd,
        -5px 5px #fff;
    }
    100% {
      text-shadow: -1px 1px #ddd, -2px 2px #ddd, -3px 3px #ddd, -4px 4px #ddd,
        -5px 5px #ddd, -6px 6px #fff;
    }
  }
`;

const ViewContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background: #aab5c5;
`;

const HealthBarContainer = styled.div`
  width: 80%;
  position: absolute;
  bottom: 0;
  left: 10%;
  height: 50px;
`;

const Title = styled.p`
  position: absolute;
  left: 50%;
  top: -10%;
  transform: translate(-50%, -50%);
  font-size: 30px;
`;

const HealthBarDiv = styled.div`
  position: absolute;
  bottom: 10%;
  left: 0%;
  height: 80%;
  transition: 0.5s;
  background: #f46652;
`;

function HealthBar(props) {
  const style = {
    width: props.width + "%"
  };
  return (
    <HealthBarContainer>
      <HealthBarDiv style={style} />
      <Title>Health</Title>
    </HealthBarContainer>
  );
}

const InnerContainer = styled.div`
  max-width: 750px;
  width: 100%;
  border: 5px double #c6c6cb;
  padding: 1rem;
  top: 0;
  position: relative;
  background: white;
  margin: 1rem;
  animation: slide-in forwards 0.5s;
  transition: 0.5s;

  @keyframes slide-in {
    0% {
      transform: translateY(-150vh);
    }
    100% {
      transform: translateY(0);
    }
  }

  &.reverse-animate-slide-in {
    transform: translateY(-100vw);
  }
`;

function RadioCheckBox(props) {
  let disabled = false;
  let spanStyles = {
    opacity: 1
  };
  if (props.disabled === true) {
    disabled = true;
    spanStyles.opacity = 0.75;
  }
  return (
    <BlockLabel>
      <input
        type="checkbox"
        disabled={disabled}
        value={props.value}
        checked={props.checked}
        onChange={props.handleInput}
      />
      <span style={spanStyles}>{props.children}</span>
    </BlockLabel>
  );
}

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 750px) {
    & {
      display: block;
    }
  }
`;

const OptionsList = styled.div`
  width: 30%;
  margin: 1rem;
  @media (max-width: 750px) {
    & {
      border-top: 2px solid #888;
      width: 100%;
      margin: 0;
    }
  }
`;

class StartView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textOptions: props.textOptions,
      selectedTextOptions: props.selectedTextOptions,
      spawnRate: props.spawnRate,
      hardcore: props.hardcore,
      animatingOut: false
    };
    this.handleGameStart = props.onGameStart;
    this.updateOptions = this.updateOptions.bind(this);
    this.handleSpeedUpdate = this.handleSpeedUpdate.bind(this);
    this.handleHardcore = this.handleHardcore.bind(this);
  }

  updateOptions(val) {
    if (!this.state.selectedTextOptions.includes(val)) {
      this.setState(prevState => {
        prevState.selectedTextOptions.push(val);
        return prevState;
      });
    } else {
      this.setState(prevState => {
        const index = prevState.selectedTextOptions.indexOf(val);
        prevState.selectedTextOptions.splice(index, 1);
        return prevState;
      });
    }
  }

  handleSpeedUpdate(value) {
    const rate = value;
    this.setState(prevState => {
      prevState.spawnRate = rate;
      return prevState;
    });
  }

  handleHardcore() {
    this.setState(prevState => {
      prevState.hardcore = !prevState.hardcore;
      return prevState;
    });
  }

  onStartGame = () => {
    this.setState(prevState => {
      prevState.animatingOut = true;
      return prevState;
    });

    setTimeout(() => {
      const { selectedTextOptions, spawnRate, hardcore } = this.state;
      if (this.state.selectedTextOptions.length >= 1) {
        this.handleGameStart(selectedTextOptions, spawnRate, hardcore);
      }
    }, 500);
  };

  render() {
    let { textOptions, selectedTextOptions, spawnRate } = this.state;

    textOptions = textOptions.map(val => {
      let checked = false;
      if (selectedTextOptions.includes(val)) {
        checked = true;
      }
      return (
        <StyledCheckbox
          key={val}
          value={val}
          checked={checked}
          tabindex="0"
          handleInput={() => {
            this.updateOptions(val);
          }}
        >
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </StyledCheckbox>
      );
    });

    const speedOptions = [
      "Faster",
      "Fast",
      "Normal",
      "Slow",
      "Slower"
    ].map((el, i) => {
      let checked = false;
      let value = 10 + i * 5;
      if (spawnRate === value) {
        checked = true;
      }
      return (
        <StyledCheckbox
          key={value}
          value={value}
          checked={checked}
          handleInput={() => {
            this.handleSpeedUpdate(value);
          }}
        >
          {el}
        </StyledCheckbox>
      );
    });

    const disabled = this.state.selectedTextOptions.length >= 1 ? false : true;

    const animatingOut = this.state.animatingOut
      ? { opacity: "1", top: "-150vh" }
      : {};

    return (
      <ViewContainer>
        <InnerContainer style={animatingOut}>
          <AnimatedHeader>Type Fall</AnimatedHeader>
          <p>
            Select the types of characters you would like to practice, the rate
            and whether you are penalized for mistakes.
          </p>
          <OptionsContainer>
            <OptionsList>{textOptions}</OptionsList>
            <OptionsList>{speedOptions}</OptionsList>
            <OptionsList>
              <StyledCheckbox
                value={"hardcore"}
                checked={this.state.hardcore}
                handleInput={() => {
                  this.handleHardcore();
                }}
              >
                Hardcore
              </StyledCheckbox>
            </OptionsList>
          </OptionsContainer>
          <div style={{ textAlign: "right" }}>
            <Button handleClick={this.onStartGame} disabled={disabled}>
              Start Game
            </Button>
          </div>
        </InnerContainer>
      </ViewContainer>
    );
  }
}

class GameView extends Component {
  constructor(props) {
    super(props);
    let options = props.textOptions.map(val => {
      if (data[val]) {
        return data[val];
      } else {
        return null;
      }
    });
    options = [].concat.apply([], options);
    this.gameTime = 0;
    this.intSpeed = 50;
    this.spawnRate = this.intSpeed * props.spawnRate;
    this.handleGameOver = props.onGameOver;
    this.hardcore = props.hardcore;
    this.state = {
      selectedCategories: props.textOptions,
      options: options,
      optionsPlaying: [],
      speed: 0.9,
      score: 0,
      health: 100,
      animatingOut: false
    };
  }

  randomIntInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  componentDidMount() {
    this.interval = setInterval(this.gameInterval, this.intSpeed);
  }

  addNewItem = () => {
    if (this.state.options.length > 0) {
      const index = this.randomIntInRange(0, this.state.options.length);
      let item = {
        character: this.state.options[index],
        xPosition: this.randomIntInRange(5, 95),
        yPosition: -20,
        active: true,
        hitHealth: false,
        remove: false
      };
      this.setState(prevState => {
        prevState.optionsPlaying.push(item);
        prevState.options.splice(index, 1);
        return prevState;
      });
    }
  };

  updatePositions = () => {
    this.setState(prevState => {
      let options = [];
      prevState.optionsPlaying.forEach(function(val) {
        if (val.active) {
          val.yPosition += prevState.speed;
        }
        if (val.yPosition > 80 && val.active) {
          val.active = false;
          val.deathTimer = 0;
          val.hitHealth = true;
          prevState.health -= 10;
        }
        if (!val.active) {
          val.deathTimer++;
        }
        if (val.deathTimer > 20) {
          val.remove = true;
        }
        if (val.remove) {
          prevState.options.push(val.character);
        } else {
          options.push(val);
        }
      });
      prevState.optionsPlaying = options;
      return prevState;
    });
  };

  onGameOver = () => {
    clearInterval(this.interval);
    this.setState(prevState => {
      prevState.animatingOut = true;
      return prevState;
    });
    setTimeout(() => {
      this.handleGameOver(this.state.score);
    }, 500);
  };

  gameInterval = () => {
    if (this.state.health <= 0) {
      this.onGameOver();
    } else {
      if (this.gameTime % this.spawnRate === 0) {
        this.addNewItem();
      }
      if (document.querySelector("input")) {
        document.querySelector("input").focus();
      }
      this.updatePositions();
      this.gameTime += this.intSpeed;
    }
  };

  handleUserKeyInput = e => {
    let val = e.target.value.toLowerCase();
    let found = false;
    this.state.optionsPlaying.forEach((el, index, arr) => {
      if (val === el.character && el.active) {
        found = true;
        this.setState(prevState => {
          prevState.optionsPlaying[index].active = false;
          prevState.optionsPlaying[index].deathTimer = 0;
          prevState.score++;
          return prevState;
        });
      }
    });
    if (!found && this.hardcore) {
      this.setState(prevState => {
        prevState.health -= 10;
        return prevState;
      });
    }
    e.target.value = "";
  };

  render() {
    let targets = this.state.optionsPlaying.map(val => {
      const style = {
        position: "absolute",
        left: `${Math.round(val.xPosition)}vw`,
        top: 0,
        fontSize: "2rem",
        border: "2px solid black",
        padding: ".5rem",
        transform: `translate(-50%,${val.yPosition}vh)`,
        transition: `${this.intSpeed}ms`
      };
      if (!val.active) {
        style.transform = `translate(-50%,${val.yPosition}vh) scale(2) rotate(360deg)`;
        style.opacity = 0;
        style.transition = "500ms";
      }
      if (val.hitHealth) {
        style.color = "#F30A13";
      }
      return (
        <h3 style={style} key={val.character}>
          {val.character}
        </h3>
      );
    });

    let containerStyles = {
      padding: "0 1rem",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      animation: "slide-in forwards .5s",
      transition: ".5s"
    };

    containerStyles.top = this.state.animatingOut ? "150vh" : "0";
    containerStyles.background = this.state.animatingOut ? "#F46652" : "white";

    return (
      <div
        style={containerStyles}
        onClick={() => {
          document.querySelector("input").focus();
        }}
      >
        <h1>Score: {this.state.score}</h1>
        <input
          type="text"
          autoFocus
          onChange={this.handleUserKeyInput}
          style={{ opacity: 0, fontSize: "20px" }}
        />
        {targets}
        <HealthBar width={this.state.health} />
      </div>
    );
  }
}

const GameOverContainer = styled.div`
  @keyframes scale-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  h2 {
    text-align: center;
    font-size: 2.5rem;
    animation: scale-in 2s forwards;
  }
  h3 {
    font-size: 1.5rem;
  }
`;

class GameOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animatingOut: false
    };
    this.props = props;
  }

  restartGame = () => {
    this.setState(prevState => {
      prevState.animatingOut = true;
      return prevState;
    });

    setTimeout(() => {
      this.props.onGameRestart();
    }, 500);
  };

  render() {
    let props = this.props;
    let options = props.selectedTextOptions.map((el, i, arr) => {
      let tail = ", ";
      if (i === arr.length - 1) {
        tail = "";
      }
      let text = el.charAt(0).toUpperCase() + el.slice(1) + tail;
      return text;
    });

    const highScoretext =
      props.score === props.highScore ? "New Highscore!" : "";

    let spawnSpeedText = "";
    switch (props.spawnRate) {
      case 10:
        spawnSpeedText = "Faster";
        break;
      case 15:
        spawnSpeedText = "Fast";
        break;
      case 20:
        spawnSpeedText = "Normal";
        break;
      case 25:
        spawnSpeedText = "Slow";
        break;
      case 30:
        spawnSpeedText = "Slower";
        break;
      default:
        spawnSpeedText = "";
        break;
    }

    const hardcoreText = props.hardcore ? "Hardcore" : "";

    const containerStyle = this.state.animatingOut ? { top: "-150vh" } : {};

    return (
      <ViewContainer>
        <InnerContainer style={containerStyle}>
          <AnimatedHeader>Type Fall</AnimatedHeader>
          <GameOverContainer>
            <h2>Game Over!</h2>
            <h2>{highScoretext}</h2>
            <h3>Score: {props.score}</h3>
            <h3>Highscore: {props.highScore}</h3>
            <h3>{hardcoreText}</h3>
            <h3>Characters: {options}</h3>
            <h3>Speed: {spawnSpeedText}</h3>
            <div style={{ textAlign: "right" }}>
              <Button handleClick={this.restartGame}>New Game</Button>
            </div>
          </GameOverContainer>
        </InnerContainer>
      </ViewContainer>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: "StartView",
      selectedTextOptions: ["letters"],
      textOptions: ["letters", "numbers", "symbols"],
      spawnRate: 20,
      hardcore: false,
      score: 0,
      highScore: 0
    };
  }

  handleGameStart = (textOptions, spawnRate, hardcore) => {
    const rate = spawnRate;

    this.setState(prevState => {
      prevState.selectedTextOptions = textOptions;
      prevState.currentView = "GameView";
      prevState.spawnRate = rate;
      prevState.hardcore = hardcore;
      return prevState;
    });
  };

  handleGameOver = score => {
    this.setState(prevState => {
      prevState.score = score;
      if (score > prevState.highScore) {
        prevState.highScore = score;
      }
      prevState.currentView = "GameOverView";
      return prevState;
    });
  };

  handleGameRestart = () => {
    this.setState(prevState => {
      prevState.currentView = "StartView";
      return prevState;
    });
  };

  render() {
    if (this.state.currentView === "StartView") {
      return (
        <StartView
          textOptions={this.state.textOptions}
          selectedTextOptions={this.state.selectedTextOptions}
          spawnRate={this.state.spawnRate}
          onGameStart={this.handleGameStart}
          hardcore={this.state.hardcore}
        />
      );
    } else if (this.state.currentView === "GameView") {
      return (
        <GameView
          textOptions={this.state.selectedTextOptions}
          spawnRate={this.state.spawnRate}
          onGameOver={this.handleGameOver}
          hardcore={this.state.hardcore}
        />
      );
    } else if (this.state.currentView === "GameOverView") {
      return (
        <GameOverView
          score={this.state.score}
          highScore={this.state.highScore}
          selectedTextOptions={this.state.selectedTextOptions}
          spawnRate={this.state.spawnRate}
          onGameRestart={this.handleGameRestart}
          hardcore={this.state.hardcore}
        />
      );
    } else {
      return (
        <StartView
          textOptions={this.state.textOptions}
          selectedTextOptions={this.state.selectedTextOptions}
          spawnRate={this.state.spawnRate}
          onGameStart={this.handleGameStart}
        />
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
