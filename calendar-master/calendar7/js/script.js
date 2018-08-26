  const author = {
    name: "Rafael",
    lastName: "Contreras",
    job: "UX Architect",
    img: "https://lh3.googleusercontent.com/-6RXOIBYnDJI/AAAAAAAAAAI/AAAAAAAAAAA/APJypA1gUEOWUYNcfNs9peMxpoTTbg03Og/s192-c-mo/photo.jpg"
  };

  let activities = [{ 
    id:1,
    time:"05:35 pm",
    title:"Hello",
    state:"none"
  },
  { 
    id:2,
    time:"05:00 pm",
    title:"World",
    state:"none"
  }];

  class Header extends React.Component {
    render() {
      return (
        <div className="header-container">
          <Author aut={author} />
          <div className="triangle">
            <span className="t-text">Your Events</span>
          </div>
        </div>
      );
    }
  }
  class Author extends React.Component {
    render() {
      const aut = this.props.aut;
      return (
        <div className="header">
          <img src={aut.img} alt="" />
          <div className="info">
            <h3>{aut.name} {aut.lastName}</h3>
            <span>{aut.job}</span>
          </div>
        </div>
      );
    }
  }
  class BtnAddEvent extends React.Component {
    render() {
      return (
        <div onClick={this.props.openAddView} className="add-btn-container">
          <button className="addButton">
            <i className="fa fa-plus" aria-hidden="true" />
          </button>
        </div>
      );
    }
  }

  class Activity extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        display: "none",
        active: false,
        activity_id: this.props.eventId
      };
    }
    hideControle() {
      this.setState({
        display: "none"
      });
    };

    showControle() {
      this.setState({
        display: this.state.display == "block" ? "none" : "block"
      });
    }
    validate() {
      this.props.sendId(this.props.eventId);
    }
    edit() {
      this.props.edit(this.props.act);
    }

    render() {
      let activityClass = ["activity-container"];

      if (this.props.act.state === "active") {
        activityClass.push("active");
      }
      const act = this.props.act;

      return (
        <div onMouseLeave={this.hideControle} className={activityClass.join(" ")}>
          <div className="activity-data inline">
            <span>{act.time}</span>
            <h3 className="a-text">{act.title}</h3>
          </div>
          <div className="activity-controle inline">
            <div className="controle">
              <div style={{ display: this.state.display }} className="operator">
                <button
                  id={this.props.eventId}
                  onClick={this.edit.bind(this)}
                  className="c-icon-op tl edit"
                >
                  <i className="fa fa-pencil" />
                </button>
                <button
                  id={this.props.eventId}
                  onClick={this.props.delete}
                  className="c-icon-op tl delete"
                >
                  <i id={this.props.eventId} className="fa fa-trash-o" />
                </button>
              </div>
              <button onClick={this.showControle.bind(this)} className="c-icon">
                <i className="fa fa-cog" />
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  class ViewUpdateEvent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        initialState: "none",
        title: this.props.prevData.title,
        hours: this.props.prevData.time.substring(0, 2),
        minutes: this.props.prevData.time.substring(3, 5),
        format: this.props.prevData.time.substring(6, 8),
        prevID: this.props.prevData.id,
        prevState: this.props.prevData.state,
        countm: 0,
        counts: 0,
        inputState: "",
        notifieme: false
      };
    }

    updateTitle(e) {
      this.setState({
        title: e.target.value,
        inputState: ""
      });
    }

    updateM(e) {
      if (
        e.target.value <= 11 &&
        e.target.value >= 0 &&
        e.target.value.length <= 2
      ) {
        this.setState({
          hours: e.target.value
        });
      }
    }
    updateS(e) {
      if (
        e.target.value <= 59 &&
        e.target.value >= 0 &&
        e.target.value.length <= 2
      ) {
        this.setState({
          minutes: e.target.value
        });
      }
    }
    updateF(e) {
      e.preventDefault();
    }

    minuteUp() {
      this.setState({
        countm: this.state.countm < 11
          ? this.state.countm + 1
          : this.state.countm,
        hours: this.state.countm < 10
          ? "0" + this.state.countm.toString()
          : this.state.countm.toString()
      });
    }
    minuteDown() {
      this.setState({
        countm: this.state.countm > 0 ? this.state.countm - 1 : this.state.countm,
        hours: this.state.countm < 10
          ? "0" + this.state.countm.toString()
          : this.state.countm.toString()
      });
    }
    secondUp() {
      this.setState({
        counts: this.state.counts < 59
          ? this.state.counts + 5
          : this.state.counts,
        minutes: this.state.counts < 10
          ? "0" + this.state.counts.toString()
          : this.state.counts.toString()
      });
    }
    secondDown() {
      this.setState({
        counts: this.state.counts > 0 ? this.state.counts - 5 : this.state.counts,
        minutes: this.state.counts < 10
          ? "0" + this.state.counts.toString()
          : this.state.counts.toString()
      });
    }
    setFormat() {
      this.setState({
        format: this.state.format == "am" ? "pm" : "am"
      });
    }

    update() {
      if (this.state.title != "") {
        let t = {
          id: this.state.prevID,
          time:
            this.state.hours +
              ":" +
              this.state.minutes +
              " " +
              this.state.format,
          title: this.state.title,
          state: this.state.prevState
        };

        this.props.update_Data(t);
        this.setState({
          notifieme: true
        });

        setTimeout(
          function() {
            this.setState({
              notifieme: false
            });
          }.bind(this),
          3000
        );
      } else {
        this.setState({
          inputState: "required"
        });
      }
    };

  }
  class ViewAddEvent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        initialState: "none",
        title: "",
        hours: "05",
        minutes: "00",
        format: "pm",
        countm: 0,
        counts: 0,
        inputState: "",
        notifieme: false
      };
    }

    updateTitle(e) {
      this.setState({
        title: e.target.value,
        inputState: ""
      });
    }

    updateM(e) {
      if (
        e.target.value <= 11 &&
        e.target.value >= 0 &&
        e.target.value.length <= 2
      ) {
        this.setState({
          hours: e.target.value
        });
      }
    }
    updateS(e) {
      if (
        e.target.value <= 59 &&
        e.target.value >= 0 &&
        e.target.value.length <= 2
      ) {
        this.setState({
          minutes: e.target.value
        });
      }
    }
    updateF(e) {
      e.preventDefault();
    }

    minuteUp() {
      this.setState({
        countm: this.state.countm < 11
          ? this.state.countm + 1
          : this.state.countm,
        hours: this.state.countm < 10
          ? "0" + this.state.countm.toString()
          : this.state.countm.toString(),
        fTT:
          this.state.hours + ":" + this.state.minutes + " " + this.state.format
      });
    }
    minuteDown() {
      this.setState({
        countm: this.state.countm > 0 ? this.state.countm - 1 : this.state.countm,
        hours: this.state.countm < 10
          ? "0" + this.state.countm.toString()
          : this.state.countm.toString()
      });
    }
    secondUp() {
      this.setState({
        counts: this.state.counts < 59
          ? this.state.counts + 1
          : this.state.counts,
        minutes: this.state.counts < 10
          ? "0" + this.state.counts.toString()
          : this.state.counts.toString()
      });
    }
    secondDown() {
      this.setState({
        counts: this.state.counts > 0 ? this.state.counts - 1 : this.state.counts,
        minutes: this.state.counts < 10
          ? "0" + this.state.counts.toString()
          : this.state.counts.toString()
      });
    }
    setFormat() {
      this.setState({
        format: this.state.format == "am" ? "pm" : "am"
      });
    }

    add() {
      if (this.state.title != "") {
        let t = {
          id: "",
          time:
            this.state.hours +
              ":" +
              this.state.minutes +
              " " +
              this.state.format,
          title: this.state.title,
          state: this.state.initialState
        };

        this.props.sendData(t);
        this.setState({
          notifieme: true
        });

        setTimeout(
          function() {
            this.setState({
              notifieme: false
            });
          }.bind(this),
          3000
        );
      } else {
        this.setState({
          inputState: "required"
        });
      }
    };

    render() {
      let notification = this.state.title;
      return (
        <div className="AddEventContainer">
          <div className="AddEventControle">
            {this.state.notifieme &&
              <div className="notifiy">
                <span className="notifiy-icon">
                  <i className="fa fa-check" />
                </span>
                <span className="notifiy-text">Event created</span>
                <h5 className="notifiy-event">
                  {notification.indexOf(" ") == -1
                    ? notification
                    : notification
                        .substr(0, notification.search(" "))
                        .concat(" ...")}
                </h5>
              </div>}
            <button onClick={this.props.close} className="close-w">
              <i className="fa fa-times" />
            </button>
            <div className="containerTime">
              <div className="containerInput">
                <button onClick={this.minuteUp.bind(this)}>
                  <i className="fa fa-chevron-up" />
                </button>
                <input
                  onChange={this.updateM.bind(this)}
                  value={this.state.hours}
                  className="timeInput"
                />
                <button onClick={this.minuteDown.bind(this)}>
                  <i className="fa fa-chevron-down" />
                </button>
              </div>
              <div className="containerInput">
                <button onClick={this.secondUp.bind(this)}>
                  <i className="fa fa-chevron-up" />
                </button>
                <input
                  onChange={this.updateS.bind(this)}
                  value={this.state.minutes}
                  className="timeInput"
                />
                <button onClick={this.secondDown.bind(this)}>
                  <i className="fa fa-chevron-down" />
                </button>
              </div>
              <div className="containerInput">
                <button onClick={this.setFormat.bind(this)}>
                  <i className="fa fa-chevron-up" />
                </button>
                <input
                  onChange={this.updateF.bind(this)}
                  value={this.state.format}
                  className="timeInput"
                />
                <button onClick={this.setFormat.bind(this)}>
                  <i className="fa fa-chevron-down" />
                </button>
              </div>
            </div>
            <label>
              {this.state.hours +
                ":" +
                this.state.minutes +
                " " +
                this.state.format}
            </label>
            <input
              className={"InputEventName" + " " + this.state.inputState}
              onChange={this.updateTitle.bind(this)}
              value={this.state.title}
              type="text"
              placeholder="Enter your event name"
              required
            />
            <button onClick={this.add} className="btn-save">
              save
            </button>
          </div>
        </div>
      );
    }
  }
  class Footer extends React.Component {
    render() {
      return (
        <div className="footer">
          <span className="tCompleted">{this.props.eventsCompleted}</span>
        </div>
      );
    }
  }
  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        display: false,
        a: activities,
        currentID: 0,
        currentData: {
          id: 0,
          time: "00",
          title: "test",
          state: "active"
        },
        completed: 0,
        edit_view: false
      };
    }

    openW() {
      this.setState({
        display: true
      });
    };

    closeW() {
      this.setState({
        display: false
      });
    };
    close_edit() {
      this.setState({
        edit_view: false
      });
    };
    deleteEvent(e) {
      let ID = e.target.id;
      let data = this.state.a;
      data = data.filter(el => el.id != ID);
      this.setState({
        a: data
      });
    };

    AddEvents(val) {
      let data = this.state.a;
      if (data.length != 0) {
        val.id = data[data.length - 1].id + 1;
      } else {
        val.id = 1;
      }

      data.push(val);
      this.setState({
        a: data
      });
    };
    validateEvent(eventId) {
      let data = this.state.a;
      for (var i in data) {
        if (data[i].id == eventId) {
          data[i].state = data[i].state === "active" ? "" : "active";
        }
      }

      this.setState({
        a: data
      });
    };
    CompletedEvent() {
      let data = this.state.a;
      data = data.filter(el => el.state == "active");
    }

    update_Event(up_data) {
      let data = this.state.a;
      data = data.map(obj => (obj.id == up_data.id ? (obj = up_data) : obj));

      this.setState({
        a: data
      });
    };

    updateEvent(data) {
      this.setState({
        edit_view: true,
        currentData: data
      });
      this.props.sended_data = data;
    };
    render() {
      let eventCpt = this.state.a.filter(el => el.state == "active").length;

      let totalEvents = this.state.a.length;
      return (
        <div className="TodoAR">
          <div className="container">
            <Header />
            <BtnAddEvent openAddView={this.openW} />
            {this.state.a.map(x =>
              <Activity
                eventId={x.id}
                sendId={this.validateEvent}
                delete={this.deleteEvent}
                edit={this.updateEvent}
                act={x}
              />
            )}
            <Footer
              eventsCompleted={(() => {
                switch (eventCpt) {
                  case 0:
                    return "There are no Events";
                  case 1:
                    return " One Event Completed";
                  case totalEvents:
                    return "All Events Completed";
                  default:
                    return eventCpt + "/" + totalEvents + " Events Completed";
                }
              })()}
            />
          </div>
          {this.state.display &&
            <ViewAddEvent close={this.closeW} sendData={this.AddEvents} />}
          {this.state.edit_view &&
            <ViewUpdateEvent
              prevData={this.props.sended_data}
              close={this.close_edit}
              update_Data={this.update_Event}
            />}
        </div>
      );
    }
  }
  let mount = document.querySelector("#app");
  ReactDOM.render(<App />, mount);