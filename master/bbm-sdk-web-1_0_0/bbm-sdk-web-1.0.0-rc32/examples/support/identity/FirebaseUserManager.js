//****************************************************************************
// Copyright 2017 BlackBerry.  All Rights Reserved.
//
// You must obtain a license from and pay any applicable license fees to
// BlackBerry before you may reproduce, modify or distribute this software, or
// any work that includes all or part of this software.
//

"use strict";

(function(FirebaseUserManager) {
  // This function will always be called with the correct global context to
  // which this module may export.
  var global = this;

  // Where do we place the module?  Do we have an exports object to use?
  if (typeof exports !== 'undefined') {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = FirebaseUserManager();
    }
    exports.FirebaseUserManager = FirebaseUserManager();
  }
  else {
    global.FirebaseUserManager = FirebaseUserManager();
  }

}).call(this, function() {

  // To be thrown when user failed to register in database
  function RegistrationFailedError(message) {
    this.name = "RegistrationFailedError";
    this.message = (message || "");
  }
  RegistrationFailedError.prototype = Error.prototype;

  // To be thrown if FirebaseUserManager has invalid parameter
  function InvalidArgumentError(message) {
    this.name = "InvalidArgumentError";
    this.message = (message || "");
  }
  InvalidArgumentError.prototype = Error.prototype;

  /**
   * Tracks user contact list changes and triggers following events:
   *  - user_added: when a new user is added
   *  - user_changed: when existing user is changed
   *  - user_removed: when existing user is removed
   * Provides functions to get user user information:
   *  - getUserAvatar: gets user avatar image URL
   *  - getUserName: gets user name
   *  - getUser: gets user information (regId, name, avatar)
   * @param {object} userInfo
   *  Object with following properties:
   *  - userRegId: regId of the user
   *  - userEmail: user email
   *  - userImageURL: user avatar image URL
   *  - userName: user name
   * @throws {RegistrationFailedError}
   *  Thrown when user failed to register
   * @throws {InvalidArgumentError}
   *  Thrown when userInfo parameter is invalid 
   */ 
  var FirebaseUserManager = function(userInfo) {
    if (typeof userInfo !== "object" || userInfo === null) {
      throw new InvalidArgumentError("userInfo must be an object.");
    }

    var m_userMap = {};
    var m_userRegId = userInfo.userRegId;
    var m_eventListners = {
      user_added : [],
      user_changed : [],
      user_removed : []
    }

    // Get a reference to the database service for "user" node
    var database = firebase.database();
    var ref = database.ref("bbmsdk/identity/users/");

    // If the local user isn't already registered in firebase, add them now
    database.ref('bbmsdk/identity/users/' + firebase.auth().currentUser.uid).set({
      regId: userInfo.userRegId,
      email: userInfo.userEmail,
      avatarUrl: userInfo.userImageURL,
      name: userInfo.userName
    }).catch(function(error) {
      throw new RegistrationFailedError(error);
    });

    /**
     * This is private utility function serves to invoke client defined event
     * handler wrapped with try / catch
     * @param {function} eventHandler
     * Event handler defined by the customer
     * @param {object} userInfo
     * Event data to be passed to eventHandler
     */
    var safeHandlerCall = function(eventHandler, userInfo) {
      try {
        eventHandler(userInfo);
      }
      catch (error) {
        console.warn("Error while executing event listener: " + error);
      }
    }

    /**
     * Handles 'child_added' event (invoked by user management service provider)
     * Triggers all listeners of 'user_added' event
     * @param {object} userInfo 
     * User information object defined by user management service provider
     */
    var onChildAddedHandler = function(userInfo) {
      var regId = userInfo.val().regId;
      var name = userInfo.val().name;
      var key = userInfo.key;
      var imageURL = userInfo.val().avatarUrl;
      var errorMessage = null;

      if (typeof regId === "undefined") {
        errorMessage = "User '" + key 
        + "' from the database doesn't have a BBM registration ID";
      }
      else {
        if (m_userMap[regId] ===  undefined) {
          // Add the user into the map, so the user can be found by its regId.
          m_userMap[regId] = userInfo;
          if (regId !== m_userRegId) {
            // Notify clients about new user was added to user list.
            m_eventListners.user_added.forEach(function(eventHandler) {
              safeHandlerCall(eventHandler, {
                userRegId: regId, 
                userName: name, 
                avatarUrl: imageURL })
            });
          }
        }
        else {
          errorMessage = 
          "FirebaseUserManager already has an entry with the same RegId: " + regId
          + ". This 'User' of name: " + name + " key: " + key + " will be ignored." 
        }
      }

      if (errorMessage) {
        console.log(errorMessage);
        m_eventListners.user_added.forEach(function(eventHandler) {
          safeHandlerCall(eventHandler, { error: errorMessage });
        }); 
      }
    }

    /**
     * Handles 'child_changed' event (invoked by user management service provider)
     * Triggers all listeners of 'user_changed' event
     * @param {object} userInfo 
     * User information object defined by user management service provider
     */
    var onChildChangedHandler = function(userInfo) {
      var regId = userInfo.val().regId;
      var name = userInfo.val().name;
      var imageURL = userInfo.val().avatarUrl;
      var key = userInfo.key;
      var errorMessage = null;

      if (regId !== undefined) {
        // Check if user is already in user map
        if(m_userMap[regId] !==  undefined) {
          // Replace the existing user information in the map with 
          // the new user information
          m_userMap[regId] = userInfo;
          // Notify client the user has new information
          m_eventListners.user_changed.forEach(function(eventHandler) {
            safeHandlerCall(eventHandler, { 
              userRegId: regId, 
              userName: name, 
              avatarUrl: imageURL });
          }); 
        }
        else {
          errorMessage = "Firebase 'User' of RegId: " + regId
            + " has never been added to map before.";
        }
      } else {
        errorMessage = "User '" + key +
        "' from the database doesn't have a BBM registration ID";
      }

      if (errorMessage) {
        console.log(errorMessage);
        m_eventListners.user_changed.forEach(function(eventHandler) {
          safeHandlerCall(eventHandler, { error: errorMessage });
        }); 
      }
    }

    /**
     * Handles 'child_removed' event (invoked by user management service provider)
     * Triggers all listeners of 'user_removed' event
     * @param {object} userInfo 
     * User information object defined by user management service provider
     */
    var onChildRemovedHandler = function(userInfo) {
      var regId = userInfo.val().regId;
      var name = userInfo.val().name;
      var key = userInfo.key;
      var imageURL = userInfo.val().avatarUrl;
      var errorMessage = null;

      if(regId !== undefined) {
        // Check if the user map contains a user that has the same regId
        if(m_userMap[regId] !== undefined) {
          // Remove the user from the user map
          delete m_userMap[regId];
          // Notify client the user got removed
          m_eventListners.user_removed.forEach(function(eventHandler) {
            safeHandlerCall(eventHandler, {
              userRegId: regId, 
              userName: name, 
              avatarUrl: imageURL });
          });
        } else {
          errorMessage = "Firebase 'User' of RegId: " + regId
          + " has never been added to map before. Ignore this child_removed";
        }
      } else {
        errorMessage = "User '" + key
        + "' from the database doesn't have a BBM registration ID";
      }

      if (errorMessage) {
        console.log(errorMessage);
        m_eventListners.user_removed.forEach(function(eventHandler) {
          safeHandlerCall(eventHandler, { error: errorMessage });
        });
      }
    }

    ref.on('child_added', onChildAddedHandler);
    ref.on('child_changed', onChildChangedHandler);
    ref.on('child_removed', onChildRemovedHandler);

    /**
     * Adds event listener
     * @param {string} event 
     *  Event to subscribe to. FirebaseUserManager fires following events:
     *  - user_added: triggered when a new user is added 
     *  - user_changed: triggered when existing user is changed
     *  - user_removed: triggered when existing user is removed
     * @param {function} eventListener
     *  Event handler function. When invoked, it contains userInfo object as
     *  paramaeter. UserInfo object contians following properties:
     *  - userRegId: The regId of the user
     *  - userName: Name of the user
     *  - avatarUrl: user avatar image URL
     * @throws {InvalidArgumentError}
     *  Thrown if the eventListener is not a function
     */
    this.addEventListener = function(event, eventListener) {
      if (typeof eventListener !== "function") {
        throw new InvalidArgumentError("Event handler must be a function");
      }
  
      var eventListners = m_eventListners[event];
      if (eventListners) {
        // Do not add event listner if it was already added previously
        var index = eventListners.indexOf(eventListener);
        if (index === -1) {
          eventListners.push(eventListener);
        }
      }
      else {
        console.warn("Trying to subscribe to the unknown event: " + event);
      }
    }

    /**
     * Removes previously added event listener
     * @param {string} event 
     *  Event to unsubscribe from. FirebaseUserManager fires following events:
     *  - user_added: triggered when a new user is added 
     *  - user_changed: triggered when existing user is changed
     *  - user_removed: triggered when existing user is removed
     * @param {function} eventListener
     *  Previously added event handler function.
     * @throws {InvalidArgumentError}
     *  Thrown if the eventListener is not a function
     */    
    this.removeEventListener = function (event, eventListener) {
      if (typeof eventListener !== "function") {
        throw new InvalidArgumentError("Event handler must be a function");
      }
  
      var eventListners = m_eventListners[event];
      if (eventListners) { 
        var index = eventListners.indexOf(eventListener);
        if (index !== -1) {
          eventListners.splice(index, 1);
        }
      }
      else {
        console.warn("Trying to unsubscribe from the unknown event: " + event);
      }
    }

    /**
     * Get the user avatar image URL by regId
     * @param {string} regId 
     *  The regId of the user
     * @returns {string}
     *  In case of success returns image URL of the user
     *  Returns null if failed
     */
    this.getUserAvatar = function(regId) {
      var userInfo = m_userMap[regId];
      if (typeof userInfo !== "undefined") {
        if (typeof userInfo.val().avatarUrl !== "undefined") {
          return userInfo.val().avatarUrl;
        }
      }
      return null;
    }

    /**
     * Gets the user name by regId
     * @param {string} regId 
     * The regId of the user
     * @returns {string}
     * User name in case of success
     * Returns null if failed
     */
    this.getUserName = function(regId) {
      var userInfo = m_userMap[regId];
      // If the user is in the user map, return their name.
      if (typeof userInfo !== "undefined") {
        if (typeof userInfo.val().name !== "undefined") { 
          return userInfo.val().name;
        }
      }
      return null;
    }

    /**
     * Gets user information by regId
     * @param {string} regId
     *  The regId of the user
     * @returns {object} 
     *  In case of success returns user object which 
     *  has properties:
     *  - userRegId: The regId of the user
     *  - userName: Name of the user
     *  - avatarUrl: user avatar image URL
     *  Returns null if failed
     */
    this.getUser = function(regId) {
      var userInfo = m_userMap[regId];
      if (typeof userInfo !== "undefined") {
        return { userRegId: userInfo.val().regId,
                 userName: userInfo.val().name,
                 avatarUrl: userInfo.val().avatarUrl }
      }
      return null;
    }
  }

  FirebaseUserManager.prototype = Object.create(Object.prototype);

  FirebaseUserManager.prototype.constructor = FirebaseUserManager;

  return FirebaseUserManager;
});