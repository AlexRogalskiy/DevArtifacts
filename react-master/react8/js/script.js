class Card2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      no: null,
      val: null,
      down: false,
      vScale: 0.0,
      v: 0,
      clicked: 0,
      posScale: 1,
      z: 1,
      y: 0,
      posy: 0,
      newPos: 0,
      shadow1: 1,
      shadow2: 2,
      vs1: 0,
      vs2: 0,
      ps1: 0,
      ps2: 0
    };

    this.animate = this.animate.bind(this);
    this.startLoop = this.startLoop.bind(this);
    this.updateScale = this.updateScale.bind(this);
    this.updateYaxis = this.updateYaxis.bind(this);
    this.updateShadow = this.updateShadow.bind(this);
    this.handleDown = this.handleDown.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  componentWillMount() {
    this.setState({
      item: this.props.item,
      val: this.props.item,
      y: this.props.item * 100,
      no: this.props.item
    });
  }

  componentDidMount() {
    this.startLoop();
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.down) {
      this.setState({
        item: newProps.item,
        val: newProps.item
      });
    }
  }

  handleDown(e) {
    this.setState({
      down: true,
      z: 4,
      posy: e.clientY
    });
  }

  handleTouchStart(e) {
    e.persist();
    this.setState({
      down: true,
      z: 4,
      posy: e.touches[0].screenY
    });
  }

  handleUp() {
    this.setState({
      down: false
    });
  }

  handleTouchEnd() {
    this.setState({
      down: false
    });
  }

  handleMove(e) {
    if (this.state.down) {
      let newPos = e.clientY - this.state.posy;
      this.setState(
        {
          y: this.state.val * 100 + newPos
        },
        () => {
          if (this.state.y > this.state.item * 100 + 50) {
            if (this.state.item + 1 < 4) {
              this.setState(
                {
                  item: this.state.item + 1
                },
                () => {
                  this.props.handlePos(
                    this.state.no,
                    this.state.item,
                    this.state.item - 1
                  );
                }
              );
            }
          } else if (this.state.y < this.state.item * 100 - 50) {
            if (this.state.item - 1 > -1) {
              this.setState(
                {
                  item: this.state.item - 1
                },
                () => {
                  this.props.handlePos(
                    this.state.no,
                    this.state.item,
                    this.state.item + 1
                  );
                }
              );
            }
          }
        }
      );
    }
  }

  handleTouchMove(e) {
    e.persist();
    if (this.state.down) {
      let newPos = e.touches[0].screenY - this.state.posy;
      this.setState(
        {
          y: this.state.val * 100 + newPos
        },
        () => {
          if (this.state.y > this.state.item * 100 + 50) {
            if (this.state.item + 1 < 4) {
              this.setState(
                {
                  item: this.state.item + 1
                },
                () => {
                  this.props.handlePos(
                    this.state.no,
                    this.state.item,
                    this.state.item - 1
                  );
                }
              );
            }
          } else if (this.state.y < this.state.item * 100 - 50) {
            if (this.state.item - 1 > -1) {
              this.setState(
                {
                  item: this.state.item - 1
                },
                () => {
                  this.props.handlePos(
                    this.state.no,
                    this.state.item,
                    this.state.item + 1
                  );
                }
              );
            }
          }
        }
      );
    }
  }

  updateScale() {
    if (this.state.down) {
      let f = -0.2 * (this.state.posScale - 1.1);
      let a = f / 0.8;
      this.setState(
        {
          vScale: 0.4 * (this.state.vScale + a)
        },
        () => {
          this.setState({
            posScale: this.state.posScale + this.state.vScale
          });
        }
      );
    } else if (!this.state.down) {
      let f = -0.2 * (this.state.posScale - 1);
      let a = f / 0.8;
      this.setState(
        {
          vScale: 0.4 * (this.state.vScale + a)
        },
        () => {
          this.setState({
            posScale: this.state.posScale + this.state.vScale
          });
        }
      );
      if (Math.floor(this.state.posScale) === 1) {
        this.setState(
          {
            z: 1
          },
          () => {
            this.setState({
              val: this.state.item
            });
          }
        );
      }
    }
  }

  updateYaxis() {
    if (!this.state.down) {
      let f = -0.2 * (this.state.y - this.state.item * 100);
      let a = f / 1;
      this.setState(
        {
          v: 0.3 * (this.state.v + a)
        },
        () => {
          this.setState({
            y: this.state.y + this.state.v
          });
        }
      );
    }
  }

  updateShadow() {
    if (this.state.down) {
      let f = -0.2 * (this.state.shadow1 - 16);
      let a = f / 0.8;
      this.setState(
        {
          vs1: 0.4 * (this.state.vs1 + a)
        },
        () => {
          this.setState({
            shadow1: this.state.shadow1 + this.state.vs1
          });
        }
      );
      let f2 = -0.2 * (this.state.shadow2 - 32);
      let a2 = f2 / 0.8;
      this.setState(
        {
          vs2: 0.4 * (this.state.vs2 + a2)
        },
        () => {
          this.setState({
            shadow2: this.state.shadow2 + this.state.vs2
          });
        }
      );
    }
    if (!this.state.down) {
      let f = -0.2 * (this.state.shadow1 - 1);
      let a = f / 0.8;
      this.setState(
        {
          vs1: 0.4 * (this.state.vs1 + a)
        },
        () => {
          this.setState({
            shadow1: this.state.shadow1 + this.state.vs1
          });
        }
      );
      let f2 = -0.2 * (this.state.shadow2 - 2);
      let a2 = f2 / 0.8;
      this.setState(
        {
          vs2: 0.4 * (this.state.vs2 + a2)
        },
        () => {
          this.setState({
            shadow2: this.state.shadow2 + this.state.vs2
          });
        }
      );
    }
  }

  startLoop() {
    if (!this._frameId) {
      this._frameId = window.requestAnimationFrame(this.animate);
    }
  }

  animate() {
    this.updateScale();
    this.updateYaxis();
    this.updateShadow();
    document.getElementById("card" + this.state.no).style.transform =
      " translate3d(0px ," +
      this.state.y +
      "px, 0px)scale(" +
      this.state.posScale +
      ")";
    document.getElementById("card" + this.state.no).style.zIndex = this.state.z;
    document.getElementById("card" + this.state.no).style.boxShadow =
      "rgba(0, 0, 0, 0.2) 0px " +
      this.state.shadow1 +
      "px " +
      this.state.shadow2 +
      "px 0px";
    this.frameId = window.requestAnimationFrame(this.animate);
  }
  stopLoop() {
    window.cancelAnimationFrame(this._frameId);
  }
  render() {
    return (
      <div
        id={"card" + this.state.no}
        className="card"
        onMouseDown={this.handleDown}
        onMouseUp={this.handleUp}
        onMouseMove={this.handleMove}
        onMouseLeave={this.handleUp}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        {this.state.no + 1}
      </div>
    );
  }
}


class App2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      down: false,
      no: 0,
      v: 0.0,
      pos: 1,
      clicked: 0,
      //     0, 1, 2, 3
      card: [0, 1, 2, 3]
    };
    this.changePos = this.changePos.bind(this);
  }

  changePos(i, newPos, oldPos) {
    let arr = this.state.card;
    for (let j = 0; j < 4; j++) {
      if (j != i) {
        if (arr[j] === newPos) {
          arr[j] = oldPos;
          arr[i] = newPos;
        }
      }
    }
    this.setState({
      card: arr
    });
  }

  render() {
    let cards = this.state.card.map((item, i) => {
      return (
        <Card2 key={i} item={item} y={item * 100} handlePos={this.changePos} />
      );
    });
    return (
      <div className="app">
        <div className="text">Draggable List</div>
        <div className="container">{cards}</div>
      </div>
    );
  }
}
let mountNode = document.getElementById("app");
ReactDOM.render(<App2 />, mountNode);