import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

Template.ui.onCreated(() => {
  Meteor.subscribe('Games');
});

Template.ui.events({
  "click #play-btn": () => {
    Session.set("inGame", true);
    Meteor.call("games.play");
    Meteor.subscribe('MyGame');
  }
});

Template.ui.helpers({
  inGame: () => {
    return Session.get("inGame");
  },
  status: () => {
    if(Session.get("inGame")) {
      let myGame = Games.findOne();
      
      if(myGame.status === "waiting")
        return "Looking for an opponent...";
      else if(myGame.status === Meteor.userId())
        return "Your turn";
      else if(myGame.status !== Meteor.userId() && myGame.status !== "end")
        return "opponent's turn";
      else if(myGame.result === Meteor.userId())
        return "You won!";
      else if(myGame.status === "end" && myGame.result !== Meteor.userId() && myGame.result !== "tie")
        return "You lost!";
      else if(myGame.result === "tie")
        return "It's a tie";
      else
        return "";
    }
  }
});