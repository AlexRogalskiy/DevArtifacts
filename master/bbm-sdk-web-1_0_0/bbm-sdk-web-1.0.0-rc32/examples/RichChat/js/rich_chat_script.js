//****************************************************************************
// Copyright 2017 BlackBerry.  All Rights Reserved.
//
// You must obtain a license from and pay any applicable license fees to
// BlackBerry before you may reproduce, modify or distribute this software, or
// any work that includes all or part of this software.
//

/* --- NOTE: The localStorage fields used in the app --- */
// 1. localStorage.userID:
// Put user ID (provided by oAuth service) to localStorage to decide 
// if the login screen needs to show up when localStorage is expired
/* ------------ NOTE END ---------- */

//Prefix names for data binding
var DATA_BIND_PREFIX = "data-bind-";
var DATA_BIND_PREFIX_CONTACT = "contact-";
var DATA_BIND_PREFIX_CHAT = "chat-";
var DATA_BIND_PREFIX_CHAT_MESSAGE = "chatMessage-";

//Prefix ids for UI element
var PREFIX_ID_CHAT_LIST_ROW = "chatRow-";
var PREFIX_ID_CONVERSATION_BANNER = "conversationBanner-";
var PREFIX_ID_PARTICIPANTS_PANE = "participantsPane-";
var PREFIX_ID_MESSAGE_BUBBLE = "messageBubble-";

// Names of attributes for data binding
var DATA_CONTACT_NAME = "contactName";
var DATA_CONTACT_IMG_URL = "contactImageURL";
var DATA_CHAT = "chatData";
var DATA_MESSAGE = "messageData";

//The tags of chatMessage
var TAG_MESSAGE_TEXT = "Text";
var TAG_MESSAGE_JOIN = "Join";
var TAG_MESSAGE_LEAVE = "Leave";
var TAG_MESSAGE_REMOVE = "Remove";
var TAG_MESSAGE_PHOTO = "photo";
var TAG_MESSAGE_FILE = "file";

// Constants
var MAX_IMAGE_LOADING_TIMEOUT = 2000; // 2 secs
// The max number of files to send in one drag and drop.
// This is for example purposes and for consistency with mobile.
// It can be increased or removed.
var MAX_FILES_SEND = 10;

// BBMEnterprise holds the information that describes a user account.
// BBMEnterprise.Messenger provides higher level functionality used to
// manage chats.
var bbmsdk;
var messenger;

// oAuth access token and user information
var userInfo;
var oauthUserEmail;
var oauthUserName;
var oauthUserAvatarImageURL;

// BBM related information after the registration and setup are completed
var userRegId;
var userPin;
var regState;

// The element Ids of the selected contacts from the list on the contact tab
var selectedContactElementIds = [];

// The contact regIds of the selected contacts from the list on the contact tab
var selectedContactRegIds = [];

//Controls what action to take from the button in contacts tab.
//True if selecting contacts from contacts tab to invite to an existing chat
//false when selecting contacts for new chat and undefined if neither action
//has been invoked yet.
var selectContactsToInviteMode;

//The Id of the selected chat from the list on the chat tab
var selectedChatId;

//A map to store all chats data from Web SDK
var chatsMap = {};

//A map to store all chat message data from Web SDK
var chatMessagesMap = {};

//A map to store all media calls
var callMap = [];

// Track whether the bubble list is at the bottom. A scroll to the bottom of
// the window only marks messages read if it was not at the bottom previously,
// and reaches the bottom.
var bubbleListAtBottom;

//A notification container
var callNotificationContainer;

// Some state to keep track of whether the user is currently typing.
// This tracks the time at which the user first typed in the current
// conversation.
var timeStartedTyping;
// This tracks the last time at which the typing notification was sent.
var timeIsTypingSent;

// Tracks information about contact list changes. Provides information about
// contacts in user's contact list.
var contactsManager;

var oAuthHelper = new genericAuthHelper();

function reportValidationError(error)
{
  console.log("Failed to init BBM SDK: "+error+" in UA="+navigator.userAgent);
  //don't let them try to login
  $('#loginBtnDiv').hide();
  if (error instanceof BBMEnterprise.Error.BrowserNotSupportedError) {
    // Give a hint that it might be because it's server over http.
    if(window.isSecureContext === false) {
      showRegistrationFailure("This page must be served over https");
    } else {
      showRegistrationFailure("Unsupported Browser");
    }
  } else {
    showRegistrationFailure("Failed to initialize BBM SDK");
  }
}

try {
  //First validate this is running on a browser with the required features.
  //This is done now since IE will fail in an uglier less user friendly way during
  //the sign in process and wouldn't get to the brower check later.
  //Also it is not very user friendly to let the user login now
  //then tell them their browser is not supported after.
  BBMEnterprise.validateBrowser()
  .then(function() {
    // Init the login process
    loginIfSessionExists();
  })
  .catch(reportValidationError);
} catch (error) {
  reportValidationError(error);
}

/* ------------ BEGIN: The app Login/Logout/Authentication functions ---------- */

/*
 * Function initiates user log in. 
 * 1. Aquires access token and user info from customer oAuth service
 * 2. Sign in user to BBM
 */ 
function LogIn() {
  oAuthHelper.getOAuthAccessToken(OAUTH_CONFIGURATION).then(function(access_token) {
    oAuthHelper.getOAuthUserInfo(access_token, OAUTH_CONFIGURATION.userInfoService).then(function(userInfo) {
      // Set local storage user Id
      localStorage.userID = userInfo.id;
      oauthUserName = userInfo.displayName;
      oauthUserEmail = userInfo.emails[0].value;
      oauthUserAvatarImageURL = userInfo.image.url;
      if (oauthUserAvatarImageURL.includes("?"))
      {
        oauthUserAvatarImageURL = oauthUserAvatarImageURL.split("?")[0];
      }
      BBMSignIn(userInfo);
    }).catch(function(error) {
      showRegistrationFailure("Failed to get user information from User Info service.");
      $('#loginBtnDiv').show();
    });
  }).catch(function(error) {
    showRegistrationFailure("Failed to get user information from User Info service.");
    $('#loginBtnDiv').show();
  });
}

/**
 * Using localStorage to start connection with the servers for a user who is already logged in
 */
function loginIfSessionExists() {
  var userID = localStorage.userID;

  // Clean up the login status field
  $('#loginStatus').html("");

  // Update the header
  $('#headerText').html("Rich Chat");

  // Keep hiding the main screen and setting pane during the login process
  $('#settingsPane').hide();
  $('#mainScreen').hide();
  $('#signInButton').click(function() { LogIn(); });

  if (userID != undefined) {
    $('#loginStatus').html("Automatically logging in with Google");
    LogIn();
  }
  else
  {
    $('#loginBtnDiv').show();
  }
}


/**
 * Sign in to to BBM after oAuth authorization is done
 * @param {object} oAuthUserInfo
 *   User profile information -  id, name, profile URL,
 *   and email address after you have oAuth authorization completed.
 */
function BBMSignIn(oAuthUserInfo) {
  if (!oAuthUserInfo) {
    $('#loginStatus').html("Google Sign-In failed.");

    //show the login pane to let the user retry
    $('#loginPane').show();
  }
  else {
    userInfo = oAuthUserInfo;

    // Hide login button but still show the status field
    $('#loginBtnDiv').hide();

    // Update the login status field
    $('#loginStatus').html("Registering BBM Enterprise...");

    try {
      //Construct BBMEnterprise.Messenger which provides higher level
      //functionality used to manipulate and annotate chats
      bbmsdk = new BBMEnterprise({
        domain: ID_PROVIDER_DOMAIN,
        environment: 'Sandbox',
        userId: userInfo.id,
        getToken: () => { return oAuthHelper.getOAuthAccessToken(OAUTH_CONFIGURATION); },
        getKeyProvider: (regId, accessToken) => {
          return FirebaseKeyProvider.factory.createInstance(regId, firebaseConfig, accessToken);
        },
        description: navigator.userAgent
      });
    } catch (error) {
      console.log("Failed to init BBM SDK: " + error + " in UA=" + navigator.userAgent);
      if (error instanceof BBMEnterprise.Error.BrowserNotSupportedError) {
        showRegistrationFailure("Unsupported Browser");
      } else {
        showRegistrationFailure("Failed to initialize BBM SDK");
      }
      return;
    }

    //Listen to the related registration callback event.
    bbmsdk.on("registrationChanged", onRegistrationChanged);

    //When our app gets focus, we can reasonably assume that the user is
    //interested in activity.  Allow any activity suspended by temporary
    //failures to now resume.
    //
    //We use the focus event on the browser window here because we want all
    //events of the browser coming into focus.  These include:
    //1. The tab coming to the foreground in the browser.
    //2. The browser window returning from being minimized.
    //3. The browser window regaining focus.
    //
    //This event is selected because it is a reasonable approximation of a
    //user's direct interest in interacting with the application and it's an
    //event that isn't overly aggressive.
    $(window).on("focus", function(e) {
      console.log("Application has regained focus");
      bbmsdk.retryServerRequests();
    });

    //Use a promise to make sure that some of the event callbacks
    //only should be processed after the setup is finished.
    //The main reason for this is to know the local user's regID before
    //processing the event callbacks.
    var setupComplete = new Promise(function(resolve, reject) {
      //Listen to all chat related callback events
      //Wait until setup completes and then process chatAdded event for chat
      bbmsdk.messenger.on("chatAdded", function(chatAddedEvent) {
        setupComplete.then(function() {
          //Only process the new chat after setup completes
          var chat = chatAddedEvent.chat;
          console.log("Rich Chat: chatAdded - chat Id: " + chat.chatId);
          addChatElement(chat);
        });
      });

      //Wait until setup completes and then process chatUpdated event for chat
      bbmsdk.messenger.on("chatUpdated", function(chatUpdatedEvent) {
         setupComplete.then(function() {
          //Only process the chat update after setup completes
          var chat = chatUpdatedEvent.chat;
          console.log("Rich Chat: chatUpdated - chat Id: " + chat.chatId);
          updateChatElement(chat);
         });
      });

      //For the events below, for now, we don't need to wait until setup completes.
      bbmsdk.messenger.on("chatRemoved", function(chatRemovedEvent) {
        var chat = chatRemovedEvent.chat;
        console.log("Rich Chat: chatRemoved - chat Id: " + chat.chatId);
        removeChatElement(chat);
      });

      // Listen to all message related callback events.
      bbmsdk.messenger.on("chatMessageAdded", function(chatMessage) {
        console.log("Rich Chat: chatMessageAdded - chatId: " + chatMessage.message.chatId
          + " messageId: " + chatMessage.message.messageId.toString());
        addChatMessageElement(chatMessage.message);

        // Show a notification that a new message has arrived.
        if(chatMessage.message.isIncoming) {
          showNotification(chatMessage);
        }
      });

      bbmsdk.messenger.on("chatMessageUpdated", function(chatMessage) {
        console.log("Rich Chat: chatMessageUpdated - chatId: " + chatMessage.message.chatId
          + " messageId: " + chatMessage.message.messageId.toString());
        updateChatMessageElement(chatMessage.message);
      });

      bbmsdk.messenger.on("chatTyping", function(chatTyping) {
        console.log("Rich Chat: chatTyping - chatId: " + chatTyping.chatId);
        handleChatTypingNotification(chatTyping);
      });

      // Initialize BBM Web SDK and start the setup
      bbmsdk.setup().then(function() {
        var registrationInfo = bbmsdk.getRegistrationInfo();
        messenger = bbmsdk.messenger;

        if(registrationInfo.state === "Success") {
          // Put oAuth user ID to localStorage to decide if the login screen needs to show up when localStorage is expired
          localStorage.userID = userInfo.id;

          // Set the values to the local variables used by the web page.
          userRegId = registrationInfo.regId;
          userPin = registrationInfo.pin;

          // Update the header with the google user name and image
          document.getElementById("headerText").innerHTML = userInfo.displayName;
          document.getElementById("headerImage").src = oauthUserAvatarImageURL;

          // Make a rounded image for the user avatar
          $('.headerBanner img').css( "border-radius",  "50%");
         }

        // At this point, it can make sure the registration has been finished
        // and then initialize the main screen, otherwise show
        // "BBM Enterprise registration failed." on the login screen
        initMainScreen();

        //Call resolve() here to start processing some of messenger events above
        //For example, "chatAdded" and "chatUpdated";
        resolve();
      }).catch(function(error) {
        console.log("setup failed: "+error);
        if (error instanceof BBMEnterprise.Event.RegistrationChanged) {
          onRegistrationChanged(error);
        }
        else {
          showRegistrationFailure();
        }
      });
    });
  }
}

/**
 * The callback function for "registrationChanged" event
 * @param {object} registrationChangedEvent 
 * The event to provide state(Success | Failure), regId and pin
 */
function onRegistrationChanged(registrationChangedEvent) {
  regState = registrationChangedEvent.state;
  if(regState === "Success") {
    document.getElementById("loginStatus").innerHTML = "BBM Enterprise registration completed";

    $('#loginPane').hide();
    // Show the main screen
    $('#mainScreen').css('display', '');

    // Open the chat tab by default
    showTab("chats");

    // Setup listeners for incoming calls and data transfers
    if (bbmsdk.media) {
      bbmsdk.media.on('incomingCall', function(mediaCall) {
        handleIncomingCall(mediaCall);
      });
    }
  } else {
    // We have a failure, figure out what message we should display.
    var message = null;
    switch (registrationChangedEvent.failureReason) {
    case BBMEnterprise.Event.RegistrationChanged.Failure.DeviceSwitchRequired:
      message = "<p>BBM Enterprise registration failed.</p>"
              + "<p>Another client that does not support multiple points of "
              + "presence is currently registered for the account with BBM "
              + "Registration ID=" + registrationChangedEvent.regId
              + " and PIN=" + registrationChangedEvent.pin + ".</p>"
              + "<p>Please sign in with with a mobile client that supports "
              + "converting your account to support multiple points of "
              + "presence.<p/>";
      break;

    case BBMEnterprise.Event.RegistrationChanged.Failure.RegistrationRevoked:
      message = "<p>BBM Enterprise registration failed.</p>"
              + "<p>The account with BBM Registration ID="
              + registrationChangedEvent.regId + " and PIN="
              + registrationChangedEvent.pin
              + " has had its registration revoked.  It is likely that too "
              + "many clients have been signed in for this account.</p>"
              + "<p>Please logout and log back in to resume using this "
              + "application instance.</p>";
      break;

    default:
      if (registrationChangedEvent.regId !== undefined) {
        message = "<p>BBM Enterprise registration failed.</p>"
                + "<p>Unable to complete registration for account with BBM "
                + "Registration ID=" + registrationChangedEvent.regId
                + " and PIN=" + registrationChangedEvent.pin + ".</p>";
      }
      break;
    }

    showRegistrationFailure(message);
  }
}

/**
 * Show an error message for a registration failure.  This function ensures
 * that only the login screen is shown with the registration error message.
 * All other screen views are hidden.
 *
 * @param {string} message
 *   The HTML error message to be displayed.  When the message is falsy, a
 *   generic error message will be displayed, otherwise, the message as given
 *   will be displayed.
 */
function showRegistrationFailure(message) {
  $('#loginPane').show();
  // hide the main screen and settings
  $('#mainScreen').hide();
  $('#settingsPane').hide();

  $('#loginStatus').html(message ? message : "BBM Enterprise registration failed.");
}

/**
 * Initialize the chat list
 */
function initChatList() {
  messenger.getChats().forEach(function(chat) {
    try {
      addChatElement(chat);
    } catch(error) {
      console.log('Error adding chat element: ' + error);
    }
  });
}

/**
 * Start a chat
 */
function startChat() {
  if(selectedContactRegIds.length > 0) {
    var isOneToOneChat = selectedContactRegIds.length == 1;
    var chatDetails = {invitees: selectedContactRegIds,
      isOneToOne: isOneToOneChat,
      subject: isOneToOneChat ? "" : $('#subjectInput').html()};

    if (!isOneToOneChat) {
      chatDetails.invitePolicy = chatInvitePolicyIsParticipantsOnly.checked ?
        BBMEnterprise.Messenger.Chat.InvitePolicy.ParticipantsOnly :
        BBMEnterprise.Messenger.Chat.InvitePolicy.AdminsOnly;
    }

    messenger.chatStart(chatDetails).then(function(pendingChat) {
      //opening conversation for the pending chat
      onChatSelected(pendingChat.chat.chatId, selectedContactRegIds);
    });
    //clear the input for next time
    document.getElementById('subjectInput').innerHTML = "";
  }

  //Switch back to the chat tab
  showTab("chat");
}

/**
 * Leave a chat
 * @param {string} chatId - the id of the chat to leave
 */
function leaveChat(chatId) {
  messenger.chatLeave(chatId).then(function(chat) {
    //clear the existing hightlighted row from the chat list
    $('#' + createChatRowElementId(selectedChatId)).toggleClass("selected");

    //set the default place holder on the conversation pane
    $('#contentPanePlaceHolder').show();
    $('#conversationPane').hide();
    document.getElementById("contentPanePlaceHolderImg").src = "./images/no_chats_guy.png";
    document.getElementById("contentPanePlaceHolderText").innerHTML = "No chat selected.";

    //clear selectedChatId to empty
    selectedChatId = "";
  });
}

/**
 * Prompt user to select invitees to invite to current chat.
 */
function inviteOthers() {
  //specify inviteContacts as tab so it will customize button
  showTab("inviteContacts");
}

/**
 * Invite all users that were selected to the current chat.
 * This is invoked from the button in the pane displayed by calling inviteOthers().
 */
function inviteToChat() {
  if(selectedContactRegIds.length > 0) {
    messenger.chatInvite(selectedChatId, selectedContactRegIds).then(function() {
      console.log("inviteToChat: done for "+selectedContactRegIds);
    });
  }

  //Switch back to the chat tab
  showTab("chat");
}

/**
 * Show confirm message to logout
 */
function showLogoutDialog() {
  // Get a flag to indicate whether or not we should proceed with the logout.
  var doLogout = (regState === 'Success'
                  // The user is currently registered, confirm that they wish
                  // to logout.
                  ? confirm("Do you really want to logout?")
                  // The user is not currently registered, just let them
                  // logout without any hassle.
                  : true);

  if (doLogout) {
    logout();
  }
}

/**
 * Logout RichChat
 */
function logout() {
  // Remove the listener on the window that controls our interest in the
  // browser's focus.
  $(window).off("focus");

  // Proceed with removing our login session and resetting the UI.
  removeLoginSession();
  $('#loginPane').show();
  // hide the main screen and settings
  $('#mainScreen').css('display', 'none');
  $('#settingsPane').css('display', 'none');
}

/**
 * Do the log out process for google
 */
function removeLoginSession() {
  //clean up the userID from the localStorage to show the login screen.
  localStorage.removeItem('userID');
  console.log('Rich Chat: User signed out.');
  location.reload();
}

/* ------------ END ---------- */


/* ------------ BEGIN: Web page UI rendering functions ---------- */

/**
 * Initialize the main screen which has two tabs "Chats" and "Contacts"
 */
function initMainScreen() {
  // Initialize the user list for "Contacts" tab  
  contactsManager = new FirebaseUserManager({ 
    userRegId: userRegId,
    userEmail: oauthUserEmail,
    userImageURL: oauthUserAvatarImageURL,
    userName: oauthUserName });
 
  // Sign up to contactsManager events to track changes in user contact list
  contactsManager.addEventListener('user_added', onContactAdded);
  contactsManager.addEventListener('user_changed', onContactChanged);
  contactsManager.addEventListener('user_removed', onContactRemoved);

  // Initialize the chat list for "Chats" tab
  initChatList();

  // Now show the side panel icon
  $('.rightSidePaneBtnDiv').show();
}

/**
 * @typedef {object} UserInfo
 * @property {string} userRegId - The regId of the user
 * @property {string} userName - Name of the new user
 * @property {string} avatarUrl - Avatar image URL of the new contact
 * In case of error object has following property
 * @property {string} errorMessage - Error message
 */

/**
 * Callback provided to FirebaseUserManager via setupCallbacks method.
 * This callback is invoked after a new user is added to the contact list.
 * @param {UserInfo} userInfo - Contains information about the new user added
 */
function onContactAdded(userInfo) {
  if (userInfo.error) {
    // Error message is logged is FirebaseUserManager.
    // Don't take any actions here.
    return;
  }

  // Add the user to the list on the contact tab to display
  addContactToContactTab(userInfo.userRegId, userInfo.userName, userInfo.avatarUrl);
  
  // Update bindings
  var contactData = new BBMData(DATA_BIND_PREFIX_CONTACT + userInfo.userRegId);
  contactData.set(DATA_CONTACT_NAME, userInfo.userName);
  contactData.set(DATA_CONTACT_IMG_URL, userInfo.avatarUrl);
  delete contactData;
}

/**
 * Callback provided to FirebaseUserManager via setupCallbacks method.
 * This callback is invoked after existing contact gets updated.
 * @param {UserInfo} userInfo - Contains information about the changed contact
 */
function onContactChanged(userInfo) {
  if (userInfo.error) {
    // Error message is logged is FirebaseUserManager.
    // Don't take any actions here.
    return;
  }

  // Use BBMData class to update data bindings.
  var contactData = new BBMData(DATA_BIND_PREFIX_CONTACT + userInfo.userRegId);
  contactData.set(DATA_CONTACT_NAME, userInfo.userName);
  contactData.set(DATA_CONTACT_IMG_URL, userInfo.avatarUrl);
  delete contactData;
}

/**
 * Callback provided to FirebaseUserManager via setupCallbacks method.
 * This callback is invoked after contact gets removed from contact list.
 * @param {UserInfo} userInfo - Contains information about the removed contact
 */
function onContactRemoved(userInfo) {
  if (userInfo.error) {
    // Error message is logged is FirebaseUserManager.
    // Don't take any actions here.
    return;
  }

  removeContactFromContactTab(userInfo.userRegId);
}

/**
 * To switch to a different tab
 * @param {string} tabName - the name of tab to switch
 */
function showTab(tabName) {
  //Open the chats tab by passing the tab name "chats"
  //or just on click event from the toggle button on the list header
  if(tabName === "chats" || document.getElementById("listHeaderButton").className.includes("active")) {
    //show chat tab and hide contact tab
    document.getElementById("chatList").style.display = "block";
    document.getElementById("contactList").style.display = "none";
    document.getElementById("listHeaderButton").className = "listHeaderButton";

    $('#tabFooter').hide();

    //Set the list header
    $('#listHeaderText').text("Chats");

    if(selectedChatId !== undefined && selectedChatId !== "") {
      //opening the selected chat
      $('#contentPanePlaceHolder').hide();
      $('#conversationPane').show();
      onChatSelected(selectedChatId);
    } else {
      //set the default place holder
      $('#contentPanePlaceHolder').show();
      $('#conversationPane').hide();
      document.getElementById("contentPanePlaceHolderImg").src = "./images/no_chats_guy.png";
      document.getElementById("contentPanePlaceHolderText").innerHTML = "No chat selected.";
    }
  } else {
    //show contact tab and hide chats tab
    document.getElementById("contactList").style.display = "block";
    document.getElementById("chatList").style.display = "none";
    document.getElementById("listHeaderButton").className = "listHeaderButton active";

    //Set the list header
    $('#listHeaderText').text("Select contacts");

    //Always clear the hightlight of selected row when switching to contact tab
    if(selectedContactElementIds.length > 0) {
      selectedContactElementIds.forEach(function(elementId) {
        $('#' + elementId).toggleClass("selected");
      });

      selectedContactElementIds = [];
    }

    //clear up the selected contact RegIds every time the contact tab shows
    selectedContactRegIds = [];

    //always show the placeholder image
    $('#contentPanePlaceHolder').show();
    $('#conversationPane').hide();

    //show the footer which has a subject input field and a "start chat" buttton
    $('#tabFooter').show();
    $('#subjectAreaWrapper').hide();
    $('#startChatInvitePolicyWrapper').hide();
    $('#centerGap').show();
    $('#startChatButton').prop("disabled",true);

    if (tabName === "inviteContacts" ) {
      //set mode to invite to chat
      selectContactsToInviteMode = true;
      //change start chat button to invite more
      document.getElementById("startChatButton").innerText = "Invite to Chat";
      document.getElementById("startChatButton").onclick=inviteToChat;
      document.getElementById("contentPanePlaceHolderText").innerHTML = "Select contacts to invite to this chat.";
      //TODO: we could filter out contacts already in chat or select them
    } else {
      //set mode to create chat.
      //needed to show chat subject and checkbox when needed
      selectContactsToInviteMode = false;
      //ensure button is setup for start chat
      document.getElementById("startChatButton").innerText = "Start Chat";
      document.getElementById("startChatButton").onclick=startChat;
      document.getElementById("contentPanePlaceHolderText").innerHTML = "Select contacts to start a chat.";
    }

    //Listen to any text input change on the subject input field
    $("body").on('DOMSubtreeModified', "#subjectInput", onSubjectInputTextChanging);

    $("#subjectInput").keypress(function (event) {
      //Listen to Enter key press
      if (event.which == 13) {
          //Press Shift+Enter keys to insert a new line by default,
          //otherwise any other Enter key pressing will start a chat
          if(!event.shiftKey){
            //If Shift key is not pressed as well,
            //prevent the browser from adding a new line
            event.preventDefault();

            //click the button to either start chat or invite more to chat
            document.getElementById("startChatButton").click();
          }
      }
    });

    //set the default place holder
    document.getElementById("contentPanePlaceHolderImg").src = "./images/no_contacts_guy.png";
  }
}

/**
 * showing the settings pane
 */
function showSettingsPane() {
  //only show the settings pane
  $('#loginPane').hide();
  // hide the main screen
  $('#mainScreen').css('display', 'none');
  // show the settings screen
  $('#settingsPane').css('display', '');

  // If we have remembered the userId with which the user was signed in, allow
  // them to logout.
  if(localStorage.userID != undefined) {
    $('#logoutBtn').show();
  } else {
    $('#logoutBtn').hide();
  }

  document.getElementById("userName").innerHTML = "Display Name: " + oauthUserName;
  document.getElementById("email").innerHTML = "Email: " + oauthUserEmail;
  document.getElementById("domain").innerHTML = "Domain: " + ID_PROVIDER_DOMAIN;
  document.getElementById("localRegId").innerHTML = "Local RegId: " + userRegId;
  document.getElementById("localPIN").innerHTML = "Local PIN: " + userPin;
  document.getElementById("registrationState").innerHTML = "Registration State: " + regState;
}

/**
 * closing the settings pane
 */
function closeSettingsPane() {
  // hide the settings screen
  $('#settingsPane').css('display', 'none');

  // Are we currently registered with the infrastructure?
  if(regState === 'Success') {
    // Yes!  Show the main screen so the user can continue their session.
    $('#mainScreen').css('display', '');
  } else {
    // No.  Show the login pane so that the user may see the registration
    // status message(s).
    $('#loginPane').show();
  }
}

/**
 * Gets the contact avatar
 * @param {string} regId - The regId of the user 
 * @returns {string} - The image URL of the user
 */
function getUserAvatar(regId) {
  var imageUrl = contactsManager.getUserAvatar(regId);
  if (imageUrl === null)
  {
    imageUrl = "./images/defaultAvatar.png";
  }
  return imageUrl;
}

/**
 * Gets the contact name
 * @param {string} regId 
 *  The id of the BBMData which wraps "user" object
 * @returns {string}
 *  Contact name
 */
function getUserName(regId) {
  var contactName = contactsManager.getUserName(regId);
  if(contactName === null)
  {
    // Escape user name to prevent any javascript in it from executing.
    contactName = regId === userRegId ? escapeUserTextToDisplay(oauthUserName) : regId;
  }
  return contactName;
}

/**
 * Create a UI element for the contact list on the contact tab
 * @param {string} regId - The id of the BBMData which wraps "user" object
 * @returns {object} - The UI element
 */
function createContactElement(regId, contactName, contactImageURL) {
  //1. "onClick" functon: For example: onContactSelected(this)
  //2. "Id" of '<div class="contactRow...>": key of the "user" node
  //3. Display the contact avatar image on the left side of the row
  //4. Display the contact name on the right side of the row
  return jQuery.parseHTML('<div class="contactRow" onclick="onContactSelected(this)" id="contactRow-'
    + regId + '" regId="' + regId + '">' +
    '<img class="contactAvatarImg"/ src="' + contactImageURL
    + '" ' + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT + correctHTMLAttributeName(regId)
    + '="' + DATA_CONTACT_IMG_URL + '">'
    + '<div class="contactTitle" '
    + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT + regId + '="' + DATA_CONTACT_NAME
    // Escape HTML or javascript in contact name before displaying.
    + '">' + escapeUserTextToDisplay(contactName)
    + '</div>'
    + '</div>')[0];
}

/**
 * Add a contact to the list on the contact tab.
 * This will sort the new element as it is inserted by contact display name.
 * @param {string} regId - The regId of the user to be added to contact tab.
 */
function addContactToContactTab(regId, contactName, contactImageURL) {
  // Find the element to insert this new one after to keep list sorted 
  // alphabetically
  var foundElement;
  var contactList = $("#contactList")[0];
  if (contactList) {
    var allContacts = $(".contactRow");
      for (var i = 0; i < allContacts.length; ++i) {
        if (contactName.toLowerCase() < allContacts[i].innerText.toLowerCase()) {
          foundElement = allContacts[i];
          break;
        }
      }
    // Insert the new element before the one found to keep in order.
    // If foundElement is undefined then it will just add to the end
    contactList.insertBefore(createContactElement(regId, contactName, 
      contactImageURL), foundElement);
  }
}

/**
 * Remove a contact from the list on the contact tab
 * @param {string} regId - regID of the user to be removed to contact tab.
 */
function removeContactFromContactTab(regId) {
  // Remove the existing row from the contact list:
  $('#contactRow-' + regId ).remove();
}

/**
 * Callback function for the selected contact from the contact list.
 * @param {object} contactRow - the object of <div class="contactRow" ....> of the list on the contact tab
 */
function onContactSelected(contactRow) {
  var contactElementId = $(contactRow).attr('Id');
  var contactRegId = $(contactRow).attr('regId');

  //check if this contact has been selected before
  var index = selectedContactElementIds.lastIndexOf(contactElementId);
  if(index >= 0) {
    //remove this contact from the arrays
    selectedContactElementIds.splice(index, 1);
    selectedContactRegIds.splice(index, 1);

    //clear the hightlight of the existing selected row to unselect this contact
    $('#' + contactElementId).toggleClass("selected");
  } else {
    //add the contact to the arrays
    selectedContactElementIds.push(contactElementId);
    selectedContactRegIds.push(contactRegId);

    //highlight the selected row from the list on the contact tab
    $('#' + contactElementId).toggleClass("selected");
  }

  //check if it is going to start a MPC and in start chat mode
  if(selectedContactElementIds.length > 1 && !selectContactsToInviteMode) {
    //show the subject input field if more than one contact are selected
    $('#subjectAreaWrapper').show();
    $('#startChatInvitePolicyWrapper').show();
    $('#centerGap').hide();

    //set the focus on the subject input field
    $('#subjectInput').focus();

    //disable the "start chat" button if the subject field is empty
    $('#startChatButton').prop("disabled",$('#subjectInput').html().length == 0);
  } else {
    $('#subjectAreaWrapper').hide();
    $('#startChatInvitePolicyWrapper').hide();
    $('#centerGap').show();

    //Disable the "start chat" button if no contact is selected
    $('#startChatButton').prop("disabled",selectedContactElementIds.length == 0);
  }
}

/**
  * Create a chat element for the list on chat tab
  * @param {string} chatId -  The id of the BBMData which wraps "chat" object
  * @returns {string} - the string of UI element
  */
function createChatElement(chatId) {
  return '<div class="chatRowImageWrapper">'
      + getChatAvatarElement(chatsMap[chatId], "chatAvatarImg")
      + '</div>'
      + '<div class="chatRowContentWrapper">'
      + getChatSubjectElement(chatsMap[chatId], "chatSubject")
      + createChatMessageElement(chatsMap[chatId])
      + '</div>';
}

/**
  * Create an element Id of the row on the chat list
  * @param {string} chatId -  The id of the "Chat" object
  * @returns {string} - the element Id of the chat list row
  */
function createChatRowElementId(chatId) {
  return PREFIX_ID_CHAT_LIST_ROW + correctHTMLAttributeName(chatId);
}

/**
  * Add a chat element to the list on chat tab
  * @param {object} chat - the chat object that UI element needs to add
  */
function addChatElement(chat) {
  var chatId = chat.chatId;

  //Check if the chats map contains a chat that has the same chatId
  if(chatsMap[chatId] ==  undefined) {
    //Create a BBMData (having id: 'Chat-chatId') to wrap "chat" object for data binding
    var chatData = new BBMData(DATA_BIND_PREFIX_CHAT + chatId);

    // This property indicates if chat has unread messages
    chatData.isUnreadMessages = false;
    
    // Add the chat into the map, so the chat can be found by its chatId.
    // This must happen first so that any updates that are triggered by calling
    // chatData.set() below will be able to find the relevant data.
    chatsMap[chatId] = chatData;

    //Set the properties needed by UI elements.
    chatData.set(DATA_CHAT, chat);

    //insert the new chat to the top of list on the chat tab to display
    $('#chatListRowPlaceholder').after(
      '<div class="chatRow" onclick="onChatSelected(this.getAttribute('
      + "'chatId'" + '))" id="' + createChatRowElementId(chatId)
      + '" chatId="' + chatId + '"'
      + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CHAT + correctHTMLAttributeName(chatId)
      + '="' + DATA_CHAT + '">'
      + createChatElement(chatId)
      + '</div>');
  } else {
    //Filter out a new chat that has the same chatId with the existing chat in the map.
    //This should not happen but still good to have this code to avoid the duplicated chats
    //in the current database.
    console.log("Rich Chat: Chats map already has an entry with the same chatId: " + chatId
      + ". This Chat will be ignored.");
  }
}

/**
  * Update a chat element to the list on chat tab
  * @param {object} chat - the chat object that UI element needs to update
  */
function updateChatElement(chat) {
  var chatId = chat.chatId;
  var chatData = chatsMap[chatId];

  //Check if the chats map contains a chat that has the same chatId
  if(chatData !== undefined) {

    //Set the properties needed by UI elements.
    chatData.set(DATA_CHAT, chat);
  } else {
    //Prevent the map from updating a chat that was never added before
    console.log("Rich Chat: The chat: " + chatId
      + " has never been added to map before. Ignore this update.");
  }
}

/**
  * Remove a chat element to the list on chat tab
  * @param {object} chat - the chat object that UI element needs to remove
  */
function removeChatElement(chat) {
  var chatId = chat.chatId;

  // Check if the chats map contains a chat that has the same chatId.
  if(chatsMap[chatId] !== undefined) {
    // Remove the chat from the map.
    delete chatsMap[chatId];
    $('#' + PREFIX_ID_CHAT_LIST_ROW + correctHTMLAttributeName(chat.chatId)).remove();

    // Are we removing the chat that is currently active?
    if (selectedChatId === chatId) {
      // Yes.  Just close the active chat abruptly.  We could do something
      // fancier here like notify the user and disable the pane so the user
      // has a nicer experience, we don't to keep the example code interaction
      // simple.  This also prevents the active pane from acting on the
      // removed chat which will raise errors in the console.
      console.log('Rich Chat: The active chat with chatId=' + chatId
                  + ' was removed; closing the conversation pane');

      // Set the default place holder on the conversation pane and hide the
      // conversation pane.
      $('#contentPanePlaceHolder').show();
      $('#conversationPane').hide();
      document.getElementById("contentPanePlaceHolderImg").src
        = "./images/no_chats_guy.png";
      document.getElementById("contentPanePlaceHolderText").innerHTML
        = "No chat selected.";

      // Clear selectedChatId, we no longer have an active chat.
      selectedChatId = "";
    }
  }
  else {
    //Prevent the map from removing a chat that was never added before
    console.log("Rich Chat: The chat: " + chatId
      + " has never been added to map before. Ignore this removal.");
  }
}

/**
  * Create a message element for the chat
  * @param {object} chatData - The BBMData that wraps "Chat" object
  * @returns {string} - the string of UI element
  */
function createChatMessageElement(chatData) {
  if (chatData.get(DATA_CHAT).state === BBMEnterprise.Messenger.Chat.State.Defunct) {
    return '<div class="chatMessage">Defunct Chat</div>';
  } else {
    return '<div class="chatMessage"> Last Message Placeholder</div>';
  }
}

/**
 * Format the content of a message bubble. For a content message, this is just
 * the content, but it also does appropriate formatting for displayable control
 * messages.
 *
 * @param {ChatMessage} chatMessage
 *   The message for which to display content.
 *
 * @return {string} The text to display.
 */
function bubbleText(chatMessage) {
  switch(chatMessage.tag) {
  case TAG_MESSAGE_PHOTO:
  case TAG_MESSAGE_FILE:
  case TAG_MESSAGE_TEXT:
    return (chatMessage.content ?
      escapeUserTextToDisplay(chatMessage.content) : ' ');
  case TAG_MESSAGE_JOIN:
    return getUserName(chatMessage.sender) + ' joined the chat.';
  case TAG_MESSAGE_LEAVE:
    return getUserName(chatMessage.sender) + ' left the chat.';
  case TAG_MESSAGE_REMOVE:
    return getUserName(chatMessage.sender) + ' removed ' +
    getUserName(chatMessage.data.regId) + ' from the chat.';
  case BBMEnterprise.Messenger.ChatMessage.ReservedTag.Admin:
    if (chatMessage.data && chatMessage.data.regId) {
      return getUserName(chatMessage.data.regId)
        + (chatMessage.data.promotion === true ? 
        ' is now an admin.' : ' is no longer an admin');
    } else {
      console.warn("bubbleText: missing expected data in admin message");
    }
  default:
    return getUserName(chatMessage.sender) + ' sent an item (Tag: "' +
           chatMessage.tag +
           '") that is not supported on this version of Rich Chat.';
  }
}

/**
  * Create a message bubble element
  * @param {object} chatId -  The id of chat which chatMessage belongs to
  * @param {object} messageId -  The id of chatMessage
  * @returns {string} - the string of UI element
  */
function createMessageBubbleElement(chatId, messageId) {
  var bubbleId = getMapKeyByChatMessage(chatId, messageId);
  var bubbleElement = "";
  var chatMessage = chatMessagesMap[bubbleId].get(DATA_MESSAGE);

  // Return nothing if the message has been deleted.
  if(chatMessage.isDeleted) {
    return bubbleElement;
  }

  if(chatMessage.tag === TAG_MESSAGE_TEXT
    || chatMessage.tag === TAG_MESSAGE_PHOTO
    || chatMessage.tag === TAG_MESSAGE_FILE) {
    //This is a text, file, or photo message
    if(chatMessage.isIncoming) {
      bubbleElement = '<div class="incomingMessageContent">' + bubbleText(chatMessage) + '</div>'
      bubbleElement = createIncomingMessageBubbleTemplate(chatId, messageId, bubbleElement);
    } else {
      bubbleElement = '<div class="outgoingMessageContent">' + bubbleText(chatMessage) + '</div>';
      bubbleElement = createOutgoingMessageBubbleTemplate(chatId, messageId, bubbleElement);
    }
  } else {
    // All others treated the same.
    bubbleElement = createSystemMessageBubbleTemplate(chatId, messageId, bubbleText(chatMessage));
  }

  return '<div class="messageBubble" id="' +
    PREFIX_ID_MESSAGE_BUBBLE + bubbleId + '" ' +
    DATA_BIND_PREFIX + DATA_BIND_PREFIX_CHAT_MESSAGE + bubbleId +
    '="' + DATA_MESSAGE + '">' + bubbleElement + '</div>';
}

function showChevron(messageBubble) {
  messageBubble.dataset.hoveringForMenu = true;
  $('.hoverChevron', messageBubble).show();
}

function hideChevron(messageBubble) {
  delete messageBubble.dataset.hoveringForMenu;
  if(!messageBubble.dataset.showingMenu) {
    $('.hoverChevron', messageBubble).hide();
  }
}

/**
 * Add a click event to the messageBubble chevron.  If retract is true then a
 * retract menu option is added.  A delete option is always added.
 */
function chevronClick(messageBubble, retract) {
  var chevron = $('.hoverChevron', messageBubble);

  //if there is already one open close it first otherwise it can never be closed once popupcloser is overriden
  if (window.popupcloser) {
    window.popupcloser();
  }

  if(!messageBubble.dataset.showingMenu) {
    var menu = '<div id="messageDropdown" class="chat-dropdown-content">';
    if(retract) {
      menu += '<div class="menuItem" onclick="retract(' + "'" + messageBubble.id + "'" + ')">Retract</div>';
    }
    menu += '<div class="menuItem" onclick="deleteMsg(' + "'" + messageBubble.id + "'" + ')">Delete</div>';
    menu += '</div>';

    chevron.append(menu);
    messageBubble.dataset.showingMenu = true;
    window.popupcloser = function() {
      delete messageBubble.dataset.showingMenu;
      $('#messageDropdown', chevron).remove();
      if(!messageBubble.dataset.hoveringForMenu) {
        $('.hoverChevron', messageBubble).hide();
      }
    }
  } else {
    window.popupcloser();
    delete window.popupcloser;
  }
}

/**
 * Show the chevron icon next to the participant in the participant list for
 * the current selected chat. The chevron can be clicked to display a
 * context menu for that participant.
 *
 * @param {object} participantElement the list (li) element that contains the participant
 */
function showChevronParticipant(participantElement) {
  participantElement.dataset.hoveringForMenu = true;
  $('.hoverChevronParticipant', participantElement).show();
}

/**
 * Hide the chevron icon next to the participant in the participant list for
 * the current selected chat. The chevron can be clicked to display a
 * context menu for that participant.
 *
 * @param {object} participantElement the list (li) element that contains the participant
 */
function hideChevronParticipant(participantElement) {
  delete participantElement.dataset.hoveringForMenu;
  if(!participantElement.dataset.showingMenu) {
    $('.hoverChevronParticipant', participantElement).hide();
  }
}

/**
 * Display a menu next to the participant element when its chevron is clicked.
 *
 * @param {object} participantElement the list (li) element that contains the participant
 * @param {string} chatId - the id of the chat
 * @param {string} regId - The id of the BBMData which wraps "user" object
 */
function chevronClickParticipant(participantElement, chatId, regId) {
  var chevron = $('.hoverChevronParticipant', participantElement);

  //if there is already one open close it first otherwise it can never be closed once popupcloser is overriden
  if (window.popupcloser) {
    window.popupcloser();
  }

  if(!participantElement.dataset.showingMenu) {
    var menuText = messenger.isAdmin(chatId, regId) ? "Demote from Admin" : "Promote to Admin";
    var menu = '<div id="messageDropdown" class="chat-dropdown-content">';
    menu += '<div class="menuItem" onclick="toggleAdmin(\'' + chatId + '\', \'' + regId + '\')">' + menuText + '</div>';
    menu += '<div class="menuItem" onclick="participantRemoveClick(\'' + chatId + '\', \'' + regId + '\')">Remove Chat Participant</div>';
    menu += '</div>';

    chevron.append(menu);
    participantElement.dataset.showingMenu = true;
    
    window.popupcloser = function() {
      delete participantElement.dataset.showingMenu;
      $('#messageDropdown', chevron).remove();
      if(!participantElement.dataset.hoveringForMenu) {
        $('.hoverChevronParticipant', participantElement).hide();
      }
    }
  } else {
    window.popupcloser();
    delete window.popupcloser;
  }
}

/**
 * Retract the specified message
 * @param {string} identifier
 *  This is the message to retract, given in the form of the bubble binding
 *  for the message.
 */
function retract(identifier) {
  // Find the message.
  var message = chatMessagesMap[identifier.substr(PREFIX_ID_MESSAGE_BUBBLE.length)];
  if(message) {
    messenger.chatMessageRecall(message.attributes.messageData.chatId,
                                message.attributes.messageData.messageId);
  } else {
    console.error('Could not find message ' + identifier + ' to retract');
  }
}

/**
 * Delete the specified message.
 *
 * @param {string} identifier
 *  This is the message to delete, given in the form of the bubble binding
 *  for the message.
 */
function deleteMsg(identifier) {
  // Find the message.
  var message = chatMessagesMap[identifier.substr(PREFIX_ID_MESSAGE_BUBBLE.length)];
  if(message) {
    messenger.chatMessageDelete(message.attributes.messageData.chatId,
                                message.attributes.messageData.messageId);
  } else {
    console.error('Could not find message ' + identifier + ' to delete');
  }
}

/**
  * Create an incoming message bubble element
  * @param {object} chatId -  The id of chat which chatMessage belongs to
  * @param {object} messageId -  The id of chatMessage
  * @param {string} messageContent -  The element string of the message content to put in the template
  * Returns {string} - the string of UI element
  */
function createIncomingMessageBubbleTemplate(chatId, messageId, messageContent) {
  var chatMessage = chatMessagesMap[getMapKeyByChatMessage(chatId, messageId)].get(DATA_MESSAGE);
  var senderRegId = chatMessage.sender;

  var bubbleElement = '<div class="incomingMessageBubble"'
    + ' onmouseenter="showChevron(this.parentElement)"'
    + ' onmouseleave="hideChevron(this.parentElement)">'
    + '<div class="incomingbubbleFirstRow" >'
    + '<div class="bubbleContactName" '
    + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT + senderRegId + '="' + DATA_CONTACT_NAME
    + '">' + getUserName(senderRegId)
    + '</div>'
    + '<div class="incomingbubbleTimestamp">'
    + formatDate(chatMessage.timestamp)
    + '</div>'
    + '</div>'
    + '<div class="IncomingbubbleSecondRow">'
    + '<img class="incomingMessageAvatarImg"/ src="' + getUserAvatar(senderRegId)
    + '" ' + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT + correctHTMLAttributeName(senderRegId)
    + '="' + DATA_CONTACT_IMG_URL + '">'
    + '<div class="incomingMessageBubbleBackground">'
    //if this is a file or photo then display the icon or image in the bubble
    + createFileImage(chatMessage)
    + '<img class="messageStateImg"/ src="' + getMessageStateImage(chatMessage) + '">'
    + messageContent
    //For files or photos, if the info is available display the file size and name
    + createExtraInfo(chatMessage)
    + '</div>'
    + '<div class="hoverChevron" style="display: none;">'
    + '<img class="chatMenuButton" src="./images/bubble_menu.png"/ onclick="chevronClick(this.parentElement.parentElement.parentElement.parentElement)" style="float:left;">'
    + '<br>'
    + '</div>'
    + '</div>'
    + '</div>'

  return bubbleElement;
}

/**
  * Create an outgoing message bubble element
  * @param {object} chatId -  The id of chat which chatMessage belongs to
  * @param {object} messageId -  The id of chatMessage
  * @param {string} messageContent -  The element string of the message content to put in the template
  * Returns {string} - the string of UI element
  */
function createOutgoingMessageBubbleTemplate(chatId, messageId, messageContent) {
  var chatMessage = chatMessagesMap[getMapKeyByChatMessage(chatId, messageId)].get(DATA_MESSAGE);
  var senderRegId = chatMessage.sender;

  bubbleElement = '<div class="outgoingMessageBubble"'
      + ' onmouseenter="showChevron(this.parentElement)"'
      + ' onmouseleave="hideChevron(this.parentElement)">'
      + '<div class="outgoingBubbleFirstRow" >'
      + '<div class="outgoingbubbleTimestamp">'
      + formatDate(chatMessage.timestamp)
      + '</div>'
      + '</div>'
      + '<div class=outgoingBubbleSecondRow>'
      + '<div class="hoverChevron" style="display: none;">'
      + '<img class="chatMenuButton" src="./images/bubble_menu.png"/ onclick="chevronClick(this.parentElement.parentElement.parentElement.parentElement, true)">'
      + '<br>'
      + '</div>'
      + '<div class="outgoingMessageBubbleBackground">'
      //if this is a file or photo then display the icon or image in the bubble
      + createFileImage(chatMessage)
      + '<img class="messageStateImg"/ src="' + getMessageStateImage(chatMessage) + '">'
      + messageContent
      //For files or photos, if the info is available display the file size and name
      + createExtraInfo(chatMessage)
      + '</div>'
      + '</div>'
      + '</div>';

  return bubbleElement;
}

/**
  * Get an image to represent the file type or photo if any is in the message.
  * The image will also have a onclick handler to display a photo in a new
  * window or to download and display a file.
  * @param {object} chatMessage -  The chatMessage that message state belongs to
  * Returns {string} The HTML to display the image or empty string
  */
function createFileImage(chatMessage) {
  var fileHtml = '';
  if (chatMessage.tag === TAG_MESSAGE_PHOTO
    && chatMessage.thumbData && chatMessage.data
    && chatMessage.data.suggestedFileName
    && "Image" === getTypeForFileExtension(getFileExt(chatMessage.data.suggestedFileName))) {
    var blob = new Blob([chatMessage.thumbData], {type: "image/"+getFileExt(chatMessage.data.suggestedFileName)});
    var imgUrl = URL.createObjectURL(blob);
    fileHtml = '<img class="chatBubbleImg" src="'+imgUrl+'" onclick="onBubbleImgSelected(this, \''+imgUrl+'\')" />';
  } else if (chatMessage.tag === TAG_MESSAGE_FILE
    && chatMessage.data
    && chatMessage.data.suggestedFileName) {
    fileHtml = '<img class="chatBubbleIcon" src="./images/filetypes/'
      +getImageForFile(chatMessage.data.suggestedFileName)
      +'"  onclick="onBubbleFileSelected(this, \''+chatMessage.chatId+'\', \''+chatMessage.messageId+'\')"  />';
  }
  return fileHtml;
}

/**
  * Get HTML to display the file name and size if available for a
  * chat message of type file or photo.
  * @param {object} chatMessage -  The chatMessage to get the extra info for
  * Returns {string} The HTML to display or empty string
  */
function createExtraInfo(chatMessage) {
  var extraInfo = '';
  if (chatMessage.data) {
    if (chatMessage.data.fileSize) {
      extraInfo += bytesToSize(chatMessage.data.fileSize);
    }

    if (chatMessage.data.suggestedFileName) {
      if (extraInfo.length > 0) {
        extraInfo += "<br/>";
      }
      // It is unlikely there could be HTML or Javascript in the suggested file
      // name but replace any just to be safe.
      extraInfo += escapeUserTextToDisplay(decodeURIComponent(
        chatMessage.data.suggestedFileName));
    }

    if (extraInfo.length > 0) {
      return '<div class="bubbleExtraInfoText">'+extraInfo+'</div>';
    }
  }

  return '';
}

/**
 * Callback function for the selected photo message bubble icon in a chat.
 * This will display the selected chat message photo in a new window.
 * @param {object} element - the photo image that was selected
 * @param {string} blobUrl - the URL of the blob for the thumbData for the photo
 */
function onBubbleImgSelected(element, blobUrl) {
  console.log("onBubbleImgSelected: element="+element+" blobUrl="+blobUrl);
  window.open(blobUrl, 'Image View', 'resizable=1');
}

/**
 * Callback function for the selected file transfer message bubble icon in a chat.
 * This will download then attempt to display the selected chat message file
 * transfered in a new window.
 * @param {object} element - the photo image that was selected
 * @param {string} chatId - the ID of the chat the file transfer message is in
 * @param {string} messageId - the ID of the file transfer message
 */
function onBubbleFileSelected(element, chatId, messageId) {
  console.log("onBubbleFileSelected: element="+element+" chatId="+chatId+" messageId="+messageId);
  var chatMessage = chatMessagesMap[getMapKeyByChatMessage(chatId, messageId)].get(DATA_MESSAGE);

  if (chatMessage && chatMessage.download) {
    //need to open a blank window now since the browser might not allow us to open
    //new window from async later, but is ok now since this is sync handler from user action
    var pageBlob = new Blob([
      '<html><head></head><body>'
        + '<progress id="progress" style="display:none"></progress>'
        + '<div id="div" style="display:none"></div>'
      + '</body></html>'
    ], {type: 'text/html'});
    var pageBlobUrl = URL.createObjectURL(pageBlob);
    var win = window.open(pageBlobUrl, 'File View', 'resizable=1');

    //download the file
    chatMessage.download({
      progress: function(progressEvent) {
        // Get the progress elements from the window.
        var progressBar = win.document.getElementById('progress');
        var div = win.document.getElementById('div')
        if(progressEvent.lengthComputable) {
          // If the length is computable, display the progress in a progress
          // bar.
          progressBar.value = progressEvent.loaded;
          progressBar.max = progressEvent.total;
          progressBar.style.display = 'block';
          div.style.display = 'none';
        } else {
          // If the length is not computable, display the downloaded byte count.
          div.innerText = 'Downloaded ' + bytesToSize(progressEvent.loaded);
          div.style.display = 'block';
          progressBar.style.display = 'none';
        }
      }
    })
    .then(function(fileBytes) {
      //use mime type from remote device if available otherwise try to look up
      //for some common mime types
      var type = chatMessage.data.fileType;
      if (!type) {
        var ext = getFileExt(chatMessage.data.suggestedFileName);
        type = getMimeTypeForFileExtension(ext);
      }

      console.log("onBubbleFileSelected: download: fileBytes.length="+fileBytes.length+", type="+type+" for name="+chatMessage.data.suggestedFileName);
      var blob = new Blob([fileBytes], {type: type});
      var blobUrl = URL.createObjectURL(blob);
      win.location = blobUrl;
    })
    .catch(function(error) {
      // Make the popup window display the error message.
      div.innerText = error.toString();
      div.style.display = 'block';
      progressBar.style.display = 'none';
    });
  } else {
    console.warn("onBubbleFileSelected: missing chatMessage download function in chatId="+chatId+" messageId="+messageId);
  }
}

/**
 * Get the file extension if any from the file name.
 * This just returns the part of the string following the last '.' character
 * or '' if none are found.
 * @param {string} fileName - the fileName to find the extension in
 * Returns {string} - the file extension or ''
 */
function getFileExt(fileName) {
  var ext = '';
  if (fileName) {
    var dot = fileName.lastIndexOf('.');
    if (dot >= 0) {
      ext = fileName.substr(dot + 1).toLowerCase();
    }
  }
  return ext;
}

/**
 * Get the name of an image to represent the specified file.
 * The path to the file is not included.
 * @param {type} fileName - the name of the file to pick an image for.
 * @returns {String} the name of the file to display.
 */
function getImageForFile(fileName) {
  return getFileIconForFileType(getTypeForFileExtension(getFileExt(fileName)));
}

/**
 * Get the name of an image to represent the specified format.
 * The path to the file is not included.
 * @param {type} format - a format that is returned from {@link getTypeForFileExtension}
 * @returns {String} the name of the file to display.
 */
function getFileIconForFileType(format) {
  switch(format) {
    case "Audio":
      return "filetype_music.png";
    case "Video":
      return "filetype_video.png";
    case "MsWord":
      return "filetype_doc.png";
    case "MsExcel":
      return "filetype_xls.png";
    case "MsPowerPoint":
      return "filetype_ppt.png";
    case "AdobeReader":
      return "filetype_pdf.png";
    case "Calendar":
      return "filetype_cal.png";
    case "ContactCard":
      return "filetype_vcf.png";
    case "VoiceNote":
      return "filetype_voicenote.png";
    case "Image":
      return "filetype_pic.png";
    default:
      return "filetype_generic.png";
  }
}

/**
 * Get the file type for the specified file extension.
 * The file type can be used with {@link getFileIconForFileType}
 * @param {type} extension - the file extension to get the type for
 * @returns {String} the file type or '' if not a known type
 */
function getTypeForFileExtension(extension) {
  switch (extension) {
    case "doc":
    case "docx":
    case "dot":
    case "rtf":
      return "MsWord";
    case "xls":
    case "xlsx":
    case "xlb":
    case "xlt":
      return "MsExcel";
    case "ppt":
    case "pps":
    case "pptx":
    case "ppsx":
      return "MsPowerPoint";
    case "pdf":
      return "AdobeReader";
    case "bmp":
    case "gif":
    case "jpeg":
    case "jpg":
    case "png":
    case "svg":
    case "svgz":
      return "Image";
    case "amr":
      return "VoiceNote";
    case "mid":
    case "midi":
    case "m3u":
    case "wma":
    case "wav":
    case "mp3":
    case "ogg":
      return "Audio";
    case "3gp":
    case "3gpp":
    case "3g2":
    case "3gpp2":
    case "mp4":
    case "mpg":
    case "mpeg":
    case "qt":
    case "mov":
    case "wmv":
    case "avi":
      return "Video";
    case "html":
    case "xhtml":
    case "txt":
    case "xml":
    case "vcf":
      return "ContactCard";
    case "vcs":
      return "Calendar";
    default:
      return "";
  }
}

/**
 * Get the mime type for the specified file extension.
 * @param {type} extension - the file extension to get the mime type for
 * @returns {String} the mime type or '' if not a known type
 */
function getMimeTypeForFileExtension(extension) {
  switch (extension) {
    case "doc":
    case "docx":
    case "dot":
      return "application/msword";
    case "rtf":
      return "application/rtf";
    case "xls":
    case "xlb":
    case "xlt":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "ppt":return "application/vnd.ms-powerpoint";
    case "pps":
      return "application/vnd.ms-powerpoint";
    case "pdf":
      return "application/pdf";
    case "bmp":
      return "image/bmp";
    case "gif":
      return "image/gif";
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "svg":
      return "image/svg+xml";
    case "amr":
      return "audio/amr";
    case "mid":
    case "midi":
      return "audio/midi";
    case "m3u":
      return "audio/x-mpegurl";
    case "wma":
      return "audio/x-ms-wma";
    case "wav":
      return "audio/x-wav";
    case "mp3":
      return "audio/mpeg";
    case "ogg":
      return "audio/ogg";
    case "3gp":
      return "video/3gpp";
    case "3g2":
      return "video/3gpp2";
    case "mp4":
      return "video/mp4";
    case "mpg":
    case "mpeg":
      return "video/mpeg";
    case "qt":
    case "mov":
      return "video/quicktime";
    case "wmv":
      return "video/x-ms-wmv";
    case "avi":
      return "video/x-msvideo";
    case "html":
      return "text/html";
    case "xhtml":
      return "application/xhtml+xml";
    case "txt":
      return "text/plain";
    case "xml":
      return "application/xml";
    case "wpd":
      return "application/vnd.wordperfect";
    case "vcf":
      return "text/x-vcard";
    case "vcs":
      return "text/x-vcalendar";
    default:
      return "";
  }
}

/**
  * Create an system message bubble element
  * @param {object} chatId -  The id of chat which chatMessage belongs to
  * @param {object} messageId -  The id of chatMessage
  * @param {string} messageContent -  The element string of the message content to put in the template
  * Returns {string} - the string of UI element
  */
function createSystemMessageBubbleTemplate(chatId, messageId, messageContent) {
  var chatMessage = chatMessagesMap[getMapKeyByChatMessage(chatId, messageId)].get(DATA_MESSAGE);

  bubbleElement = '<div class="systemMessageBubble">'
      + '<div class="systemMessageContent" '
      + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT + chatMessage.sender + '="' + DATA_CONTACT_NAME
      + '">' + messageContent + '</div>'
      + '<div class="incomingbubbleTimestamp">'
      + formatDate(chatMessage.timestamp)
      + '</div>'
      + '</div>';

  return bubbleElement;
}

/**
  * Get a proper format of the date object. for example., "Jun 1, 3:00 AM"
  * @param {object} date -  The date object to format
  * Returns {string} the string to represent the date object
  */
function formatDate(date) {
  var minutes = date.getMinutes().toString().length == 1 ? '0'+ date.getMinutes() : date.getMinutes();

  var hours = date.getHours();
  var ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours > 12 ? hours - 12 : hours;

  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + hours + ':' + minutes + ' ' + ampm;
}

/**
  * Get an image to represent the state of chat message
  * @param {object} chatMessage -  The chatMessage that message state belongs to
  * Returns {string} The URL of the message state image
  */
function getMessageStateImage(chatMessage) {
    var isIncoming = chatMessage.isIncoming;
    if( isIncoming && chatMessage.isUnverified ) {
      //check if the message is unverified
      return "./images/locker_chat_bubble.png";
    }

    var stateImageURL = "";
    var state = chatMessage.state.value;
    var isPartial = chatMessage.state.isPartial;
    var isRecalled = chatMessage.isRecalled;
    var chatData = chatsMap[chatMessage.chatId];
    var chat = chatData.get(DATA_CHAT);
    var isOneToOneChat = chat.isOneToOne;

    if (isRecalled) {
      //check if the message state is recalled
      stateImageURL =  "./images/msg_retract.png";
    } else if (state == "Sending") {
      //check if the message state is sending
      stateImageURL =  "./images/sending.png";

    } else if (state == "Sent") {
      //check if the message state is sent
      stateImageURL =  "./images/sent.png";
    } else if (state == "Delivered") {
      //check if the message state is delivered
      if (isIncoming) {
          stateImageURL =  "./images/yellow_pellet.png";
      } else if (!isOneToOneChat) {
          stateImageURL =  ( "./images/" + (isPartial ? "delivered_partial.png" : "delivered.png") );
      } else {
          stateImageURL =  "./images/delivered.png";
      }
    } else if (state == "Read") {
      //check if the message state is read
      if (isIncoming) {
          stateImageURL =  "./images/grey_pellet.png";
      }else if (!isOneToOneChat) {
        stateImageURL =  ( "./images/" + (isPartial ? "read_partial.png" : "read.png") );
      }
      else {
        stateImageURL =  "./images/read.png";
      }
    } else if (state == "Failed" && isOneToOneChat) {
      // don't show failed messages for multichats
        stateImageURL =  "./images/failed.png";
    }

    //default image URL should be empty.
    return stateImageURL;
}

/**
  * Get the key of the chat message map
  * @param {object} chatId -  The id of chat which chatMessage belongs to
  * @param {object} messageId -  The id of chatMessage
  * Returns {string} the key of chatMessage object to store in the map.
  */
function getMapKeyByChatMessage(chatId, messageId) {
  return correctHTMLAttributeName(chatId) + "-" + correctHTMLAttributeName(messageId);
}

/**
  * Add chat message related elements
  * @param {object} chatMessage - the chatMessage object that UI element needs to add
  */
function addChatMessageElement(chatMessage) {
  var chatId = chatMessage.chatId;
  var chatMessageId = chatMessage.messageId.toString();
  var key = getMapKeyByChatMessage(chatId, chatMessageId);

  //Create a BBMData (having id: 'chatMessage--key') to wrap "chat" object for data binding
  var chatMessageData = new BBMData(DATA_BIND_PREFIX_CHAT_MESSAGE + key);

  // Add the message into the map, so the message can be found by its key.
  // This must happen first so that any updates that are triggered by calling
  // chatMessageData.set() below will be able to find the relevant data.
  chatMessagesMap[key] = chatMessageData;

  //Set the properties needed by UI elements.
  chatMessageData.set(DATA_MESSAGE, chatMessage);

  // If this is incoming unread message then mark message chat has unread
  // messages 
  if(chatMessage.isIncoming) {
    if (chatMessage.state !==
      BBMEnterprise.Messenger.ChatMessage.StateValue.Read) {
      chatsMap[chatId].isUnreadMessages = true;
    }
  }

  //Check if the message belongs to the current conversation pane
  if(chatId === selectedChatId) {
    //Check if the list is at the bottom:
    //scrollTop refers to the top of the scroll position, which will be scrollHeight - offsetHeight
    var bubbleList = document.getElementById("bubbleList");
    var isAtBottom = (bubbleList.scrollTop == (bubbleList.scrollHeight - bubbleList.offsetHeight));

    //Create a message bubble and add it to the bubble list
    $('#bubbleList').append(createMessageBubbleElement(chatId, chatMessageId));

    if(!chatMessage.isIncoming || isAtBottom) {
      //For any outgoing message, it always needs to scroll to bottom
      //For an incoming message, it only sticks to bottom if the list is already at the bottom
      scrollBubbleListToBottom();
    }
  }
}

/**
  * Update a message bubble element from the bubble list on conversation pane
  * @param {object} chatMessage - the chatMessage object that UI element needs to update
  */
function updateChatMessageElement(chatMessage) {
  var chatId = chatMessage.chatId;
  var chatMessageId = chatMessage.messageId.toString();
  var chatMessageData = chatMessagesMap[getMapKeyByChatMessage(chatId, chatMessageId)];

  //Check if the chat message map contains a message that has the same key
  if(chatMessageData !== undefined) {
    //Set the properties needed by UI elements.
    chatMessageData.set(DATA_MESSAGE, chatMessage);
  } else {
    //Prevent the map from updating a chat message that was never added before
    console.log("Rich Chat: The chat message with chat Id: " + chatId
      + " message Id: " + chatMessageId
      + " has never been added to map before. Ignore this update.");
  }
}

/**
  * Handle the chat typing notification
  * @param {object} chatTyping - the chatTyping object to handle
  */
function handleChatTypingNotification(chatTyping) {
  if (chatTyping.chatId !== selectedChatId) {
    // The typing notification is for a chat other than the currently selected
    // chat, ignore it.
    return;
  }
  // The typing notification is for the currently selected chat, we need to
  // update the typing users being displayed or hide the notification if there
  // are no typing users remaining.
  updateChatTypingElementForSelectedChat();
}

/**
  * Update the typing notification bar on the selected chat
  */
function  updateChatTypingElementForSelectedChat() {
  var typingUsers = messenger.getTypingUsers(selectedChatId);

  if(typingUsers.length > 0) {
    var text = "";
    if(typingUsers.length == 1) {
        text = getUserName(typingUsers[0].regId) + ' is writing a message...';
    } else {
        text = getUserName(typingUsers[0].regId) + ' and ' + typingUsers.length + ' other(s) are writing a message...';
    }

    var isTypingText = '<div class="isTypingText" '
        + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT + correctHTMLAttributeName(typingUsers[0])
        + '="' + DATA_CONTACT_NAME + '">' + text + '</div>';

    //Show a bar of "XXX is writing a message"
    //or "XXX and 2 other(s) are writing a message" on the conversation pane
    $('#isTypingText').html(isTypingText);
    $('#isTypingBar').show();
  } else {
    //hide the bar of "XXX is writing a message" from the conversation pane
    $('#isTypingBar').hide();
  }

  setBubbleListHeight();
}

/**
 * Callback function for the selected chat.
 * @param {string} chatId - the id of the selected chat object from the list on the chat tab
 * @param {Array} invitees - Array of regIds of users being invited to join the chat
 */
function onChatSelected(chatId, invitees) {
  var chatRowId = createChatRowElementId(chatId);

  // The same chat as the existing one is selected in some circumstances, make
  // this a no-op.
  if(selectedChatId === chatId) return;

  if(selectedChatId !== undefined) {
    //clean the existing hightlighted row
    $('#' + createChatRowElementId(selectedChatId)).toggleClass("selected");
  }

  //highlight the selected row from the list on the chat tab
  $('#' + chatRowId).toggleClass("selected");
  selectedChatId = chatId;

  //clean up all cached BBMData for chat messages from chatMessagesMap
  //when a chat is selected to open. chatMessagesMap is only for the
  //currently opened conversation pane. Some unrelated messages from other chats
  //might be still added to this map from the event callbacks at the this point,
  //but it is ok since no UI elements care about those messages.
  chatMessagesMap = {};

  //Open a conversation pane
  initConversationPane(selectedChatId, invitees);
}

/**
 * Get the UI element to display chat avatar
 * @param {object} chatData - The BBMData that wraps "Chat" object
 * @param {string} className - The class name used by CSS
 * @param {string} defaultAvatarURL - The url of the default avatar
 * Returns {string} - The string of HTML element to display chat avatar
 */
function getChatAvatarElement(chatData, className, defaultAvatarURL) {
  var avatarURL;
  var chat = chatData.get(DATA_CHAT);

  if(chat.isOneToOne) {
    //get the participants avatar
    var participants = chat.participants

    if(Array.isArray(participants)) {
      // find the other contact's regId
      var participant = chat.participants.find(function(participant) {
        return participant.regId !== userRegId;
      });

      if(participant !== undefined) {
        avatarURL = getUserAvatar(participant.regId) + '"' + ' '
          + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT + correctHTMLAttributeName(participant.regId)
          + '="' + DATA_CONTACT_IMG_URL + '"';
      } else {
        avatarURL = (defaultAvatarURL === undefined ? "./images/defaultAvatar.png" : defaultAvatarURL);
      }

    }
  } else {
    //Return MPC avatar
    avatarURL = './images/ic_mpc_participants.png';
  }

  return '<img class="' + className + '"/ src="' + avatarURL + '">' ;
}

/**
 * Get the UI element to display chat subject
 * @param {object} chatData - The BBMData that wraps "Chat" object
 * @param {string} className - The class name used by CSS
 * @param {string} defaultSubject - The default subject to display
 * Returns {string} - The string of HTML element to display chat subject
 */
function getChatSubjectElement(chatData, className, defaultSubject) {
  var subject;
  var chat = chatData.get(DATA_CHAT);

  if(chat.isOneToOne) {
    //get the participants avatar
    var participants = chat.participants
    if(Array.isArray(participants) && participants.length > 1) {
      var regId = chat.participants.find(function(participant) {
        return participant.regId !== userRegId;
      }).regId;

      subject = '<div class="' + className + '" '
        + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT + correctHTMLAttributeName(regId)
        + '="' + DATA_CONTACT_NAME + '">' + getUserName(regId) + '</div>';
    } else {
      //1:1 chat but the other participant has not yet joined.
      subject = '<div class="' + className + '">' + (defaultSubject === undefined ? 'Empty Chat' :  defaultSubject) + '</div>';
    }
  } else {
    if(chat.subject.length === 0
      && Array.isArray(chat.participants) && chat.participants.length > 1) {
      // Display some of the participants since the subject is empty.
      // Use div for the outer tag that contains all the names which are inside
      // span tags.  This way the outer div can control displaying the
      // ellipsis when the total length of all the names are too long and the
      // inner span tags control updating individual contact names if needed.
      subject = '<div class="' + className + '">';
      //unlikely more than 10 names would fit, so don't continue past that
      var stop = Math.min(chat.participants.length, 10);
      var addComma = false;
      for (var i = 0;i < stop; ++i) {
        var participant = chat.participants[i];
        if (participant.regId && participant.regId !== userRegId) {
          if (addComma) {
            subject += ", ";
          }
          // Use span for tag surrounding each name for data binding since
          // using div would conflict with a parent/outer div for class, and we
          // can't use the div for each class since the ellipsis wouldn't work
          // for group
          subject += '<span '
            + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CONTACT
            + correctHTMLAttributeName(participant.regId)
            + '="' + DATA_CONTACT_NAME + '">'
            + getUserName(participant.regId)
            + '</span>';
          addComma = true;
        }
      }
      subject += '</div>';
    } else {
      //For MPC, just use its subject
      subject = '<div class="' + className + '">'
        + ( chat.subject.length > 0
            ? escapeUserTextToDisplay(chat.subject) : (defaultSubject === undefined
              ? 'No subject' :  defaultSubject))
        + '</div>';
    }
  }
  return subject;
}

/**
 * Get the UI element to display the number of the participants
 * @param {object} chat - The "Chat" object
 * @param {string} className - The class name used by CSS
 * Returns {string} - The string of HTML element
 */
function getParticipantsCountElement(chat, className) {
  return '<div class="' + className + '" onclick="onParticipantsCountClicked()" >'
    + chat.participants.length + ( chat.participants.length > 1 ? ' participants' : ' participant' ) + '</div>';;
}

/**
  * callback method on the click event from the participants count field
  */
function onParticipantsCountClicked() {
  //toggle to show/hide the participants pane
  if ($('#participantsPane').is(":visible")) {
    $('#participantsPane').hide();
  } else {
    $('#participantsPane').show();
  }

  setBubbleListHeight();
}

/**
  * set the bubble list height
  */
function setBubbleListHeight() {
  var typingUsers = messenger.getTypingUsers(selectedChatId);

  //if the participant list is shown
  if ($('#participantsPane').is(":visible")) {
    //if the contact is typing, then need to reserve the space for the participant list ("participantsPane"), the
    //conversation pane banner ("conversationPaneBanner"), and the isTyping bar ("isTypingBar")
    if(typingUsers.length > 0) {
      $('#bubbleList').css("height", "-webkit-calc(100% - 171px)");
      $('#bubbleList').css("height", "calc(100% - 171px)");
      $('#bubbleList').css("height", "-moz-calc(100% - 171px)");
    } else {
      //otherwise, just need to reserve the space for the participant list ("participantsPane") and the
      //conversation pane banner ("conversationPaneBanner")
      $('#bubbleList').css("height", "-webkit-calc(100% - 141px)");
      $('#bubbleList').css("height", "calc(100% - 141px)");
      $('#bubbleList').css("height", "-moz-calc(100% - 141px)");
    }
  } else {
    if(typingUsers.length > 0) {
      //if the contact is typing, then need to reserve the space for the
      //conversation pane banner ("conversationPaneBanner") and the isTyping bar ("isTypingBar")
      $('#bubbleList').css("height", "-webkit-calc(100% - 125px)");
      $('#bubbleList').css("height", "calc(100% - 125px)");
      $('#bubbleList').css("height", "-moz-calc(100% - 125px)");
    } else {
      //otherwise, just need to reserve the space for the participant list ("participantsPane")
      $('#bubbleList').css("height", "-webkit-calc(100% - 95px)");
      $('#bubbleList').css("height", "calc(100% - 95px)");
      $('#bubbleList').css("height", "-moz-calc(100% - 95px)");
    }
  }
}

/**
 * Create a UI element for the top banner of the conversation pane
 * @param {string} chatId -  The id of the BBMData which wraps "chat" object.
 * @param {string} defaultChatAvatar - The default chat avatar to display
 * @param {string} defaultSubject - The default subject to display
 * Returns {string} - the string of UI element
 */
function createCoversationBannerElement(chatId, defaultChatAvatar, defaultSubject) {
  var chatData = chatsMap[chatId];
  var chat = chatData.get(DATA_CHAT);
  //If this is MPC and invitePolicy is members, or MPC and user is admin in chat
  //then allow this user to invite other users to this chat
  var allowInviteOthers = false;
  if (!chat.isOneToOne) {
    if (chat.invitePolicy === BBMEnterprise.Messenger.Chat.InvitePolicy.ParticipantsOnly) {
      allowInviteOthers = true;
    } else if (messenger.isAdmin(chatId, userRegId)) {
      //only allow if local user is admin
      allowInviteOthers = true;
    }
  }

  return '<div class="bannerImageWrapper" id="bannerImageWrapper">'
      + getChatAvatarElement(chatData, "bannerImage", defaultChatAvatar)
      + '</div>'
      + '<div class = "bannerTextWrapper">'
      + getChatSubjectElement(chatData, "bannerText", defaultSubject)
      + (chat.isOneToOne ? "" : getParticipantsCountElement(chat, "bannerDescText"))
      + '</div>'
      + '<div class="menuButtonWrapper">'
      + '<div class="audioButtonWrapper" id="audioButtonWrapper" style="display:none">'
      + '<button class="audioButton" id="audioButton"></button>'
      + '</div>'
      + '<div class="videoButtonWrapper" id="videoButtonWrapper" style="display:none">'
      + '<button class="videoButton" id="videoButton"></button>'
      + '</div>'
      + '<button class="menuButton" onclick="showChatMenu()" id="menuButton"></button>'
      + '<div id="chatDropdown" class="dropdown-content">'
      + '<div class="menuItem" onclick="leaveChat(' + "'" + selectedChatId + "'" + ')">Leave Chat</div>'
      + (allowInviteOthers ?
        '<div class="menuItem" onclick="inviteOthers()">Invite Others</div>'
        : "")
      + '</div>'
      + '</div>';
}

/**
 * Create a UI element for the participants list below the conversation pane
 * @param {string} chatId -  The id of the BBMData which wraps "chat" object.
 * Returns {string} - the string of UI element
 */
function createCoversationParticipantsPane(chatId) {
  var chat = getChat(chatId);
  //add each participant to the participants pane
  var participantsList = "";
  chat.participants.forEach(function(participant) {
    // If this participant is pending then show loading symbol,
    // otherwise if they are admin then show the key icon before their name.
    var icon = '';
    if (participant.state === BBMEnterprise.Messenger.Participant.State.Pending) {
      icon = '<img class="participantInfoImg" src="images/pending_participant.png"/>';
    } else if (participant.isAdmin) {
      icon = '<img class="participantInfoImg" src="images/admin_key.png" />';
    }

    //if the local user is an admin for this chat then show menu chevron
    //unless this participant is the local user
    var parentDivExtra = '';
    var contactMenu = '';
    if (messenger.isAdmin(chatId, userRegId) && participant.regId !== userRegId) {
      parentDivExtra = ' onmouseenter="showChevronParticipant(this.parentElement)"'
        + ' onmouseleave="hideChevronParticipant(this.parentElement)"';

      contactMenu = '<div class="hoverChevronParticipant"  style="display: none;">'
          + '<img class="chatMenuButton" src="./images/bubble_menu.png" onclick="chevronClickParticipant(this.parentElement.parentElement.parentElement'
          + ', \''+ chatId + '\', \''+ participant.regId +'\')" style="float:left;">'
          + '</div>';
    }

    participantsList = participantsList + '<li class="participantLi">'
      +'<div class="'
      + (participant.state === BBMEnterprise.Messenger.Participant.State.Pending
          ? 'participantPendingDiv' : 'participantDiv')
      + '" ' + parentDivExtra +'>'
      + icon
      + getUserName(participant.regId)
      + contactMenu
      + '</div>'
      + '</li>';
  });
  return participantsList;
}

/**
 * Get the chat from the chatsMap for specified chatId.
 *
 * @param {type} chatId the ID for the chat to get.
 * @returns {BBMEnterprise.Messenger.Chat} the chat for specified chatId or null if not found.
 */
function getChat(chatId) {
  var chatData = chatsMap[chatId];
  if (chatData) {
    return chatData.get(DATA_CHAT);
  } else {
    console.warn("RichChat: getChat: failed to find chat for chatId="+chatId);
  }
}

/**
 * Toggle the admin state for the user for specified regId in the chat
 * for the specified chatId.
 *
 * @param {type} chatId the ID for the chat
 * @param {type} regId the ID for the user to toggle admin status for.
 */
function toggleAdmin(chatId, regId) {
  if (messenger.isAdmin(chatId, regId)) {
    messenger.participantDemote(chatId, regId).then(function() {
      console.log("toggleAdmin: sucess regId="+regId+" is no longer an admin in chatId="+chatId);
    });
  } else {
    messenger.participantPromote(chatId, regId).then(function() {
      console.log("toggleAdmin: sucess regId="+regId+" is now admin in chatId="+chatId);
    });
  }
}

/**
  * show a dropdown menu item list for a chat
  */
function showChatMenu() {
  if ($('#chatDropdown').is(":visible")) {
    $('#chatDropdown').hide();
  } else {
    $('#chatDropdown').show();
  }
}

/**
  * Close any opening dropdown menu if the user clicks outside of it
  */
window.onclick = function(event) {
  if (!event.target.matches('.menuButton') &&
      event.target.className !== 'chatMenuButton') {

    //To iterate the HTMLCollection which has this class name "dropdown-content"
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      //Hide any opening dropdown menu
      if ($(openDropdown).is(":visible")) {
        $(openDropdown).hide();
      }
    }

    // Remove any chat popup menu.
    if(window.popupcloser) {
      window.popupcloser();
    }
  }
}

/**
  * Scroll the message bubble list to its bottom
  */
function scrollBubbleListToBottom() {
  //Scroll to the bottom of the list
  $('#bubbleList').scrollTop(document.getElementById("bubbleList").scrollHeight);
}

/**
 * Mark the latest message in the active conversation as read.
 */
function readLatestMessage() {
  var messages = messenger.getChatMessages(selectedChatId)
  if(messages.length > 0) {
    if (chatsMap[selectedChatId].isUnreadMessages) {
      var lastMessage = messages[messages.length - 1];
      messenger.chatMessageRead(selectedChatId, lastMessage.messageId)
      .then(function() {
        // Mark these chat messages as read
        chatsMap[selectedChatId].isUnreadMessages = false;
      });
    }
  }
}

/**
 * initialize a conversation pane for a chat
 * @param {string} chatId - The Id of the chat
 * @param {Array} invitees - Array of regIds of users being invited to join the chat
 */
function initConversationPane(chatId, invitees) {
  //hide the conversation placeholder and show the conversation pane
  $('#contentPanePlaceHolder').hide();
  $('#conversationPane').show();

  var chatData = chatsMap[chatId];
  var chat = chatData.get(DATA_CHAT);
  var verifiedChatId = correctHTMLAttributeName(chat.chatId);

  //add a top banner
  var defaultChatAvatar;
  var defaultSubject;

  //This is usually for the case of displaying a conversation pane for a pending chat
  //right after clicking the contact from the contact list to start it.
  //At this point, we already know the contact name and avatar.
  if(Array.isArray(invitees) && invitees.length == 1) {
    //Find the contact info for pending chat since we already knew it from local instead of getting it
    //from the participant list which will be updated after the contact joins the chat.
    defaultChatAvatar = getUserAvatar(invitees[0]);
    defaultSubject = getUserName(invitees[0]);
  }

  $('#conversationPaneBanner').html(
    '<div class="bannerContent" id="' + PREFIX_ID_CONVERSATION_BANNER + verifiedChatId
      + '" ' + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CHAT + verifiedChatId
      + '="' + DATA_CHAT + '">'
      + createCoversationBannerElement(chatId, defaultChatAvatar, defaultSubject)
      + '</div>');

  onAddCallIcons(chatId);
  //show a participant list if this is a MPC
  if(chat.isOneToOne) {
    $('#participantsPane').hide();
  } else {
    $('#participantsPane').html(
      '<div id="' + PREFIX_ID_PARTICIPANTS_PANE + verifiedChatId
      + '" ' + DATA_BIND_PREFIX + DATA_BIND_PREFIX_CHAT + verifiedChatId
      + '="' + DATA_CHAT + '">'
      + createCoversationParticipantsPane(chatId)
      + '</div>');
    $('#participantsPane').show();
  }

  //Clear any existing message bubbles from the bubble list
  $('#bubbleList').html("");

  //Get the chat messages and populate them on the bubble list
  (chat.state === BBMEnterprise.Messenger.Chat.State.Ready
   // The chat is ready and the desired chat messages have already been
   // restored and cached in the BBM Enterprise SDK.  We just need to get them
   // and display them.
   ? Promise.resolve(messenger.getChatMessages(selectedChatId))
   // The chat is not yet ready, we must ask the BBM Enterpirse SDK to fetch
   // all the chat messages from the infrastructure.
   : messenger.fetchChatMessages(selectedChatId))
  .then(function(chatMessageList) {
    console.log("Rich Chat: Got a chat message list for chat: " + chatId);
    chatMessageList.forEach(function (chatMessage) {
      addChatMessageElement(chatMessage);
    });

    //scroll to the bottom of the message bubble list after all the messages
    //are loaded.
    scrollBubbleListToBottom();

    bubbleListAtBottom = true;

    // The messages are initially marked read when entering the conversation.
    readLatestMessage();

    // On scrolling to the bottom, mark the last message in the conversation as
    // read.
    $('#bubbleList').scroll(function(event) {
      var bubbleList = document.getElementById("bubbleList");
      // If we were not at the bottom, but now are.
      if(bubbleList.scrollTop === (bubbleList.scrollHeight - bubbleList.offsetHeight)) {
        if(!bubbleListAtBottom) {
          readLatestMessage();
          bubbleListAtBottom = true;
        }
      } else {
        bubbleListAtBottom = false;
      }
    });

    // On a click on the input field when already at the bottom, mark the last
    // message in the conversation as read.
    $('#input').click(function() {
      var bubbleList = document.getElementById("bubbleList");
      if(bubbleList.scrollTop === (bubbleList.scrollHeight - bubbleList.offsetHeight)) {
        readLatestMessage();
      }
    });

    // On a click on the bubble list when already at the bottom, mark the last
    // message in the conversation as read.
    $('#bubbleList').click(function() {
      var bubbleList = document.getElementById("bubbleList");
      if(bubbleList.scrollTop === (bubbleList.scrollHeight - bubbleList.offsetHeight)) {
        readLatestMessage();
      }
    });
  });

  // Listen to any text input change on the input field.
  $("body").on('DOMSubtreeModified', "#input", onInputTextChanging);

  // Is the chat disabled?
  if (chatData.get(DATA_CHAT).state === BBMEnterprise.Messenger.Chat.State.Defunct) {
    // Disable input and change the default text.
    $('#inputPlaceholder').text("Defunct Chat");
    document.getElementById("input").setAttribute("contenteditable", false);
  }
  else {
    // Enable input and display the default text.
    $('#inputPlaceholder').text("Enter a message");
    document.getElementById("input").setAttribute("contenteditable", true);
    // Set the focus on the input field.
    $('#input').focus();
  }

  // Handle any key press when the input box has focus.
  $("#input").keypress(function (event) {
    // If at the bottom, mark the last message as read.
    var bubbleList = document.getElementById("bubbleList");
    if(bubbleList.scrollTop === (bubbleList.scrollHeight - bubbleList.offsetHeight)) {
        readLatestMessage();
    }

    // Listen to Enter key press.
    if (event.which == 13) {
        // Press Shift+Enter keys to insert a new line by default.
        // Otherwise, any other Enter key pressing will send a message.
        if(!event.shiftKey) {
          // If Shift key is not pressed as well, prevent the browser from
          // adding a new line.
          event.preventDefault();

          // Send a message instead.
          send();
        }
    }
  });

  // Show the typing notification bar if needed.
  updateChatTypingElementForSelectedChat();
}

/**
 * Click event for removing a participant.
 */
function participantRemoveClick(chatId, regId) {
  // Remove the menu since it was clicked.
  var menu = $("#participantsPane").find("#messageDropdown");
  if(menu.length) {
    menu.remove();
  }

  // Remove the participant.
  messenger.participantRemove(chatId, regId);
}

/**
 * A callback method on text changing from the input field
 */
function onInputTextChanging() {
  // Get the input text.
  var inputText = $('#input').html();

  // Has any text been entered?
  if(inputText.length > 0) {
    // Clear the default placeholder text.
    $('#inputPlaceholder').text("");

    // Show an enabled icon on the send button.
    document.getElementById("sendButton").className = "sendButton active";
  } else {
    // Replace the default placeholder text.
    $('#inputPlaceholder').text("Enter a message");

    // Show a disabled icon on the send button.
    document.getElementById("sendButton").className = "sendButton";
  }

  // Start a typing timer if not already started.
  if(!timeStartedTyping) {
    // When the user first starts typing, record the time.
    timeStartedTyping = new Date().getTime();
  } else if(!timeIsTypingSent &&
            new Date().getTime() - timeStartedTyping >= 5000) {
    // If isTyping has not been sent, and the user has typed 5 seconds ago,
    // send isTyping.
    timeIsTypingSent = new Date().getTime();
    messenger.chatTyping(selectedChatId);
  } else if(timeIsTypingSent &&
            new Date().getTime() - timeIsTypingSent >= 30000) {
    // If isTyping has not been sent for 30 seconds, send it.
    timeIsTypingSent = new Date().getTime();
    messenger.chatTyping(selectedChatId);
  }
}

/**
 * A callback method on text changing from the subject input field.
 */
function onSubjectInputTextChanging() {
  //check the input text for chat subject
  if($('#subjectInput').html().length > 0) {
    //clear the default placeholder text
    $('#subjectInputPlaceholder').text("");

    //enable the start chat button
    $('#startChatButton').prop("disabled",false);
  } else {
    //set the default placeholder text
    $('#subjectInputPlaceholder').text("Enter chat name");

    //disable the start chat button
    document.getElementById("sendButton").className = "sendButton";
    $('#startChatButton').prop("disabled", true);
  }
}

/**
 * A callback method to handle the click event from the 'send' button
 * @param {string} tag - option tag value for message. Defaults to TAG_MESSAGE_TEXT
 * @param {object} data - optional data to send as JSON in message.
 *                  used to send metadata for a message
 * @param {Blob} fileData - optional file to send in the fileData for the message.
 */
function send(tag, data, fileData) {
  // Trim the empty space and remove the new line break at start and end of
  // input string.
  var inputText = $('#input').html();
  var trimedText = inputText.replace(/^\<div\>\<br\>\<\/div\>+|\<div\>\<br\>\<\/div\>+$/g, '').trim();

  if (!tag) {
    tag = TAG_MESSAGE_TEXT;
  }

  if(trimedText.length > 0 || fileData) {
    var message = {tag: tag, content: trimedText};

    if (fileData) {
      // Set up the fileData to send with the message.
      message.fileData = {
        data: fileData,
        progress: function(progressEvent) {
          if(progressEvent.lengthComputable) {
            console.log('Progress: ' + progressEvent.loaded + '/' + progressEvent.total);
          } else {
            // If the length is not computable, display the downloaded byte count.
            console.log('Downloaded ' + bytesToSize(progressEvent.loaded));
          }
        }
      };
    }

    if (data) {
      message.data = data;
    }

    // Try to send the message.
    try {
      messenger.chatMessageSend(selectedChatId, message)
      .then(function(chatMessage) {
        // The message has been sent. The successful result is handled by the
        // "chatMessageAdded" event handler.
        console.log("RichChat: New Message Sent!");
      });
    } catch(e) {
      // The message could not be sent. The event handler will not be called
      // so the failed message is never displayed.
      console.error('RichChat: Failed to send message; error=' + e);
    }

    // Clear the input field.
    $('#input').text("");
  }
}

/**
 * Show an error dialog
 * @param {string} error - Error message to show
 */
function showErrorDialog(error) {
  console.log('Rich Chat: Error - ' + error);
  var r = confirm("Error: " + error + "!!! Do you want to continue using RichChat?");
  if (r == false) {
    //logout
    logout();
  }
}

/**
 * Show a notification to indicate the arrival of a new message. Request
 * permission if necessary.
 *
 * @param {ChatMessageAddedEvent} message
 *   The event indicating that a message has arrived.
 */
function showNotification(message) {
  var Notification = window.Notification;

  // Actually display the notification. This is done only after checking that
  // we have permission.
  function displayNotification() {
    var notification = new Notification('RichChat', {
      body: bubbleText(message.message),
      icon: 'images/favicon.ico',
      timestamp: true,
      data: message.chat.chatId
    });
    setTimeout(notification.close.bind(notification), 5000);
    notification.addEventListener('click', function(event) {
      if (window) {
        window.focus();
      }
      notification.close();
      onChatSelected(event.target.data);
    });
  };

  // Check for permission.
  if(Notification && Notification.permission !== 'notsupported') {
    if(Notification.permission === 'granted') {
      // Permission was granted, display the notification.
      displayNotification();
    } else if(Notification.permission !== 'denied' ||
              Notification.permission === 'default') {
      // We do not have permission, request it.
      Notification.requestPermission()
      .then(function() {
        displayNotification();
      });
    }
  }
}


/**
 * Correct a HTML attribute name by removing any invalid character from it.
 * This name is used for adding an attribute on UI elements for data Binding.
 * @param {string} str - the string to validate
 * Returns {string} the string without any invalid character
 */
function correctHTMLAttributeName(name) {
  //'.' or ',' is invalid for the name of the attribute in HTML elements
  //Replace '.' or ',' with '_'.
  return $.type(name) === "string"? name.replace(/\.|\,/g,"_") : name;
}

/**
 * Escape the &lt; and &gt; symbols in user generated text so it can be
 * safely added to the web page.
 * This should be called before displaying any user generated text from chat
 * messages, subjects, user names, status, or otherwise to display the text as is and
 * ensure that any embedded javascript is not executed.
 *
 * @param {string} text some user generated text.
 * @returns {string} the text with HTML modified to be safe to display in HTML.
 */
function escapeUserTextToDisplay(text) {
  if (text) {
    // Replace all occurances of < in the text with the html code to display <
    // Use regex with the g (global) flag to replace all instead of just first.
    return text.replace(/</g,'&lt;')
      // Just replacing the opening < will prevent the text from getting
      // interpreted as HTML or javascript but also replace the > closing for completeness.
      .replace(/>/g,'&gt;');
  }
}

/**
 * A data wrapper which wraps BBM data to be binded to UI elements.
 * @param {string} id - The identity of the data model
 * @returns {object} - The object that wraps BBM data.
 */
function BBMData( id ) {
  var verifiedId = correctHTMLAttributeName(id);
  var binder = new BBMDataBinder( verifiedId );

  var data = {
    //An array to store BBM data attributes
    attributes: {},

    // The attribute setter publish changes using DataBinder
    set: function( attrName, val ) {
      this.attributes[ attrName ] = val;
      binder.trigger( verifiedId + ":change", [ attrName, val, this ] );
    },

    //The attribute getter
    get: function( attrName ) {
      return this.attributes[ attrName ];
    }
  };

  return data;
}

/**
 * A data binder follows publish/subscribe pattern to bind changes
 * to a data object’s properties to changes in the UI elements.
 *
 * @param {string} objectId - The identity of the data object
 * @returns {object} - The jQuery object to trigger the data change.
 */
function BBMDataBinder( objectId ) {
  // Use a jQuery object as simple publish/subscribe pattern
  var pubSub = jQuery({});

  // Expect a data element specifying the binding
  // in the form: data-bind-<objectId>="<propertyName>"
  var dataAttr = DATA_BIND_PREFIX + objectId;
  var message = objectId + ":change";

  // PubSub listens to the changes and propagates them to all bound elements,and sets the value
  pubSub.on( message, function( evt, attrName, newVal ) {
    //Find all UI elements that has data attribute: [data-bind-XXX]=YYY to update by data.
    //For example, < div data-bind-contact-787093443485630519=contactName>Michael</div>;
    jQuery( "[" + dataAttr + "='" + attrName + "']" ).each( function() {
      var $boundElement = jQuery( this );

      //update UI elements
      if (attrName === DATA_CONTACT_IMG_URL) {
        //update the contact avatar image
        if($boundElement.is("img")){
          //For "img" element
          $boundElement.attr("src", newVal);
        }
      } else if(attrName === DATA_CONTACT_NAME) {
        //update the contact avatar image
        if($boundElement.is("input, textarea, select")) {
          //For "input, textarea, select" element
          $boundElement.val(newVal);
        } else {
          $boundElement.html(newVal);
        }
      } else if(attrName === DATA_CHAT) {
        //update the chat related UI elements
        var elementId = $boundElement.attr('id');
        if(elementId !== undefined) {
          if(elementId.startsWith(PREFIX_ID_CHAT_LIST_ROW)) {
            //update the row of the chat list
            $boundElement.html(createChatElement(newVal.chatId));
          } else if(elementId.startsWith(PREFIX_ID_CONVERSATION_BANNER)) {
            //update the conversation top banner
            $boundElement.html(createCoversationBannerElement(newVal.chatId));
            onAddCallIcons(newVal.chatId);
          } else if(elementId.startsWith(PREFIX_ID_PARTICIPANTS_PANE)) {
            //update the conversation top banner
            $boundElement.html(createCoversationParticipantsPane(newVal.chatId));
          }
        }
      } else if(attrName === DATA_MESSAGE) {
        //update the chatMessage related UI elements
        var elementId = $boundElement.attr('id');
        if(elementId !== undefined) {
          if(elementId.startsWith(PREFIX_ID_MESSAGE_BUBBLE)) {
            //update the message bubble
            $boundElement.replaceWith(createMessageBubbleElement(newVal.chatId,
              newVal.messageId.toString()));
          }
        }
      }
    });
  });

  return pubSub;
}

//--------------------------------------- Utils ---------------------------------------//

/**
 * Waits for all images of an element and its child elements
 * to be loaded.
 *
 * NOTE: This makes sure:
 * 1. Action-able items with images are visible when the UI is displayed.
 * 2. No more layout changes caused by images loaded asynchronously,
 *    which creates undesirable UI artifacts.
 * 3. JQuery animation can run smoothly without interruption due to layout
 *    changes
 *
 * @param {object} elem 
 *    the JQuery selector of the parent element
 *
 * @return {Promise}
 *    which resolves when all the images within the element is loaded,
 *    and is rejected if MAX_IMAGE_LOADING_TIMEOUT has reached
 *
 */
function waitForImagesToLoad(elem) {
  return new Promise(function(resolve, reject) {
    var imgs = elem.find('img');
    var doneImgs = false;
    var timeout = setTimeout(function() {
      imgs.off('load');
      reject();
    }, MAX_IMAGE_LOADING_TIMEOUT);
    function checkDone() {
      var i;
      for (i = 0;i < imgs.length; i++) {
        // check if the image is loaded by checking
        // 1. the complete flag (some browsers set this pre-maturely)
        // 2. the natrualHeight which gets updated when
        // the actual image source is loaded
        if (!imgs[i].complete || imgs[i].natualHeight === 0) {
          break;
        }
      };
      if (i === imgs.length && !doneImgs) {
        doneImgs = true;
        imgs.off('load');
        clearTimeout(timeout);
        resolve();
      }
    }
    // Handle the load events for all images
    // NOTE: this event may not be called on each image
    // due to timing (some may have already been loaded) and
    // other caveats (see JQuery documentation for details)
    imgs.on('load', function() {
      if (!doneImgs) {
        checkDone();
      }
    });

    // check readiness right away in case the images all loaded
    // prior to the event handler attached.
    checkDone();
  });
}


/**
 * Utility function to convert a given number of bytes to
 * the most convenient human-readable unit (bytes, kb, mb, gb)
 * for display. The largest whole unit is automatically selected.
 *
 * @param {Number} bytes 
 *    The bytes number to be converted to the appropriate
 *    unit for display
 *
 * @return {string}
 *    The text representing the size converted from bytes
 */
function bytesToSize(bytes) {
   if (bytes == 0) {
    return '0 Byte';
  }
  var CONVERSION = 1024;
  var units = ['bytes', 'kb', 'mb', 'gb'];
  var unit = parseInt(Math.floor(Math.log(bytes) / Math.log(CONVERSION)));
  if (unit >= units.length) {
    unit = units.length - 1;
  }
  return Math.round(bytes / Math.pow(CONVERSION, unit), 2) + ' ' + units[unit];
}

//----------------------------------- voice/video calls -------------------------------//

/**
 * Called when the conversation pane is loaded
 *
 * This function checks if media calls can be supported
 * and add the buttons to the conversation banner if supported
 *
 * @param chatId {string}
 *    The id of the current conversation
 */
function onAddCallIcons(chatId) {
  if (bbmsdk.media) {
    // load the chat data
    var chatData = chatsMap[chatId];
    var chat = chatData.get(DATA_CHAT);
    // check if there is audio device available
    bbmsdk.media.hasAudioDevice().then(function(hasAudio) {
      var audioButtonWrapper = $('#audioButtonWrapper');
      var videoButtonWrapper = $('#videoButtonWrapper');

      if (hasAudio) {
        // make the voice call only button visible
        audioButtonWrapper.css('display', '');
        audioButtonWrapper.find('#audioButton').click(function() {
          handleMakeCall(chat);
        });
        // check if the video device is available
        bbmsdk.media.hasVideoDevice().then(function(hasVideo) {
          if (hasVideo) {
            // make the video button visible
            videoButtonWrapper.css('display', '');
            videoButtonWrapper.find('#videoButton').click(function() {
              handleMakeCall(chat, true);
            });
          }
        });
      } else {
        // audio device not available, cannot make calls
        audioButtonWrapper.css('display', 'none');
        videoButtonWrapper.css('display', 'none');
      }
    });
  }
}

/**
 * Toggles the visibility of the right side (media) pane
 *
 * @param {boolean} open
 *    true if to open the pane, false if to close, undefined
 *    to just flip the state
 */
function toggleMediaPane(open) {
  if (open) {
    $('.mediaPane').css('display', '');
  } else if (open === undefined) {
    // flip
    if ($('.mediaPane').css('display') === 'none') {
      $('.mediaPane').css('display', '');
    } else {
      $('.mediaPane').css('display', 'none');
    };
  } else {
    $('.mediaPane').css('display', 'none');
  }
}

/**
 * Handles the events of a media call
 *
 * @param {Call} call
 *   The call that is created by {@link createCallUI}
 *   with its mediaCall {@link Call#mediaCall} attached
 *
 * @param {string} callerRegId
 *   The regId of the caller(incoming) or the callee(outgoing) of the call
 */
function handleMediaCallEvents(call, callerRegId) {
  var contactName = contactsManager.getUserName(callerRegId);
  var callDiv = call.win;
  var status = $(callDiv).find('#media_call_status');

  // handle call status
  if (call.mediaCall.outgoing()) {
    status.text('Calling ' + contactName + '...');
  } else {
    status.text('Incoming Call from ' + contactName + '...');
  }
  function ringing(mediaCall) {
    status.text('Ringing ' + contactName + '...');
  }
  function connecting(mediaCall) {
    status.text('Connecting to ' + contactName + '...');
  }
  function connected(mediaCall) {
    var UPDATE_DURATION_INTERVAL_MS = 1000;
    function msToTime(duration) {
      var seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60)));

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return hours + ":" + minutes + ":" + seconds;
    }
    status.text('In call with ' + contactName);
    var durationTimer = setInterval(function () {
      if (callMap.indexOf(call) > -1 && !call.win.closed) {
        var duration = msToTime(call.mediaCall.getDuration());
        status.text('In call with ' + contactName + '  [' +  duration + ']');
       } else {
        clearInterval(this);
      }
    }.bind(durationTimer), UPDATE_DURATION_INTERVAL_MS);
  }
  // handle call ended remotely or due to error
  function callEnded(status) {
    // set the mediaCall to null to prevent further operations
    call.mediaCall = null;
    // clean up the call
    callDiv.find('.media_call_end').click();

    console.log('Call ended due to status: ' + status.statusCode + ' cause: ' + status.cause);
  }

  call.mediaCall.on('ringing', ringing);
  call.mediaCall.on('connecting', connecting);
  call.mediaCall.on('connected', connected);
  call.mediaCall.on('disconnected', function(mediaCall, status) { callEnded(status); } );
  // handle call quality changes
  call.mediaCall.on('qualityChanged', function(mediaCall, quality) {
    var qStatus = callDiv.find('#media_call_quality_status');
    if (quality > BBMEnterprise.Media.CallQosLevels.QUALITY_GOOD) {
      switch(quality) {
        case BBMEnterprise.Media.CallQosLevels.QUALITY_MODERATE:
          qStatus.text('Moderate call quality...');
          qStatus.css('color', 'yellow');
          break;
        case BBMEnterprise.Media.CallQosLevels.QUALITY_POOR:
          qStatus.text('Poor call quality...');
          qStatus.css('color', 'red');
          break;
      }
      qStatus.fadeIn('slow');
    } else {
      qStatus.fadeOut();
    }
  });

  // state mapping to handlers
  switch(call.mediaCall.state()) {
    default:
    case BBMEnterprise.Media.CallState.CALL_STATE_UNKNOWN:
      break;
    case BBMEnterprise.Media.CallState.CALL_STATE_RINGING:
      ringing(call);
      break;
    case BBMEnterprise.Media.CallState.CALL_STATE_CONNECTING:
      connecting(call);
      break;
    case BBMEnterprise.Media.CallState.CALL_STATE_CONNECTED:
      connected(call);
      break;
    case BBMEnterprise.Media.CallState.CALL_STATE_DISCONNECTED:
      disconnected(call);
      break;
  }
}

/**
 * Creates the UI elements for a call and inserts it into the
 * media pane list
 *
 * @return {object}
 *    the JQuery selector representing the call UI element
 */
function createCallElements() {
  var videoHtml =
    '<div id="callOverlay" class>' +
      '<div class="media_call_wrap">' +
        '<div class="media_call_center_container">' +
          '<div class="media_call_lock_wrap">' +
            '<img class="media_call_lock_icon" src="images/media/protect_lock_small_pressed.png"/>' +
          '</div>' +
          '<div class="media_call_close_wrap">' +
            '<button class="media_call_close_button" id="media_call_close"></button>' +
          '</div>' +
          '<div class="media_call_status" id="media_call_status"></div>' +
          '<div class="media_call_status" id="media_call_quality_status" hidden></div>' +
          '<div class="media_call_remote_video">' +
            '<video id="remote_camera" autoplay> </video>' +
            '<div class="media_call_local_video">' +
              '<video id="local_camera" autoplay> </video>' +
            '</div>' +
          '</div>' +
          '<img class="media_call_mute" src="images/media/mute.png" hidden/>' +
          '<img class="media_call_end" src="images/media/voice_endcall.png" hidden/>' +
          '<img class="media_call_video" src="images/media/video_off_button.png" hidden/>' +
        '</div>' +
      '</div>' +
    '</div>';
  var listitem = '<li class="callList_li">' + videoHtml + '</li>';
  // append the list item to the list
  var li = $(listitem).appendTo('#callList');
  // find the actual call UI within the list item
  var callDiv = li.find('#callOverlay');

  // open the side panel, so the call ui is visible
  toggleMediaPane(true);

  // make sure the item added is visible
  $('#callList').animate({scrollTop: li.offset().top}, 'slow');

  return callDiv;
}

/**
 * The call class managing the UI and the media call instance
 *
 * @property remoteVideo {HTMLVideoElement}
 *   The HTML5 video element for hosting the remove video
 *
 * @property localVideo {HTMLVideoElement}
 *   The HTML5 video element for hosting the local video/camera
 *
 * @property muted {Boolean}
 *    Whether the call currently is in muted state
 *
 * @property videoOn {Boolean}
 *    Whether the call currently has local video enabled
 *
 * @property mediaCall {object}
 *    The media call instance {@link BBMEnterprise.Media.Call} returned from
 *    either the {@link BBMEnterprise.Media#makeCall} or on the event
 *    {@link BBMEnterprise.Media#incomingCall}
 *
 * @property win {object}
 *    The JQuery selector of the top level UI element of the call
 *
 * @class Call
 */

/**
 * Creates a call object and its associated UI with events handling
 *
 * @param {string} callerRegId
 *   The contact of the caller(incoming) or the callee(outgoing) of the call
 *
 * @param {boolean} isVideo 
 *    Whether it is a call with video offered initially
 *
 * @return {Call}
 *    the call object created
 */
function createCallUI(callerRegId, isVideo) {
  callMap = callMap || [];
  var call = {}; // new call object
  var callDiv = createCallElements();

  // checks if a call is alive
  function callAlive(call) {
    return callMap.indexOf(call) > -1 && call.mediaCall;
  }

  // Update the template UI elements with the call context

  // avatars for both users
  var callee_image = contactsManager.getUserAvatar(callerRegId) 
    || 'images/media/default_contact.png';
  var caller_image = 'images/media/default_contact.png';
  // status of the call
  var status = $(callDiv).find('#media_call_status');
  // remote video element
  var remoteVideo = $(callDiv).find('#remote_camera');
  // local video element
  var localVideo = $(callDiv).find('#local_camera');

  // cache the video UI elements for passing to the SDK
  call.remoteVideo = remoteVideo[0];
  call.localVideo = localVideo[0];

  // update the video element with contact poster images
  remoteVideo.attr('poster', callee_image);
  localVideo.attr('poster', caller_image);

  // check if the local video element needs to be displayed
  // initially (if it is offered)
  if (!isVideo) {
    localVideo.parent().hide();
  }

  // handles the hover events to allow hiding/showing the images(buttons)
  // when UI is idle/active
  var mediaCallWrap = callDiv.find('.media_call_wrap');
  // when mouse hovers on the call UI
  function onHover() {
    if (!callAlive(call)) {
      return;
    }
    $(this).find('img').fadeIn('slow');
    // fade in the text status only if it is full screen
    if (call.win.fullscreen) {
      status.fadeIn('slow');
    }
  }

  // when mouse leaves the call UI
  function onHoverExit() {
    if (!callAlive(call)) {
      return;
    }
    if (!call.muted) {
      // mute button should be visible always
      $(this).find('img').fadeOut('slow');
    } else {
      $(this).find('.media_call_end').fadeOut('slow');
      $(this).find('.media_call_video').fadeOut('slow');
    }
    if (call.win.fullscreen) {
      status.fadeOut('slow');
    }
  }

  mediaCallWrap.hover(onHover, onHoverExit);
  // already hovered?
  if (mediaCallWrap.is(":hover")) {
    onHover();
  }
  // call mute
  callDiv.find('.media_call_mute').on('click',
    function(){
      // ignore this if the call has ended.
      if (!callAlive(call)) {
        return;
      }
      // toggle mute icon and when it is muted
      // make sure it no longer fades out
      if (!call.muted) {
        call.mediaCall.mute(true);
        call.muted = true;
        $(this).attr('src', 'images/media/mute_on.png');
      } else {
        call.mediaCall.mute(false);
        call.muted = false;
        $(this).attr('src', 'images/media/mute.png');
        $(this).show();
      }
    }
  );

  // call end
  callDiv.find('.media_call_end').on('click',
    function(){
      // clean up the UI and remove the call
      // from list
      function cleanup() {
        callDiv.closed = true;
        callDiv.parent().remove();
        callMap.splice(callMap.indexOf(call), 1);
      }
      // if the media call is already ended,
      // just clean up the UI, otherwise, end
      // the media call and upon its termination,
      // the cleanup will be executed
      if (!callAlive(call)) {
        cleanup();
        return;
      }
      call.mediaCall.end();
    }
  );

  // the minimize/close button
  callDiv.find('.media_call_close_button').on('click',
    function(){
      var pos = callDiv.offset();
      var fullscreen_style = {
          position: 'fixed',
          width: '100%',
          height : '100%',
          top: 0,
          left: 0,
          'background-color': 'rgba(0,0,0,0.7)', /* Black background with opacity */
          'z-index': 100,
      };
      var inline_style = {
        position: 'fixed',
      };
      var style = fullscreen_style;
      // find out the origin/dest styles for the animation
      if (callDiv.fullscreen) {
        // animate to the previous location of the element
        inline_style.top = callDiv.prevPos.top;
        inline_style.left = callDiv.prevPos.left;
        inline_style.width = callDiv.prevPos.width + 'px';
        inline_style.height = callDiv.prevPos.height + 'px';
        style = inline_style;
        callDiv.fullscreen = false;
        // toggle the button image
        $(this).removeClass('media_call_close_button_fullscreen');
      } else {
        callDiv.fullscreen = true;
        // cache the previous position for animation
        callDiv.prevPos = pos;
        callDiv.prevPos.width = callDiv.width();
        callDiv.prevPos.height = callDiv.height();
        // toggle the button image
        $(this).addClass('media_call_close_button_fullscreen');
      }
      // Animate the zooming effect with JQuery.animate instead of the
      // toggleClass, due to toggleClass doesn't work out the
      // start/stop position properly
      callDiv.css({position: 'fixed', left: pos.left + 'px', top: pos.top + 'px'}).animate(
        style, 300, function() {
        // Now we can actually change the class.
        callDiv.toggleClass('fullscreen', 0);
        callDiv.removeAttr('style');
        // Add the fullscreen styles on top of the existing call UI styles
        if (callDiv.fullscreen) {
          callDiv.find('.media_call_wrap').addClass('media_call_wrap_fullscreen');
        } else {
          callDiv.find('.media_call_wrap').removeClass('media_call_wrap_fullscreen');
        }
      });
    }
  );

  // handle the video on/off button
  callDiv.find('.media_call_video').on('click',
    function(){
      // ignore this if the call has ended.
      if (!callAlive(call)) {
        return;
      }
      // toggle video
      call.mediaCall.video(!call.videoOn).then(function(){
        // update the icon only if the video toggling
        // is successful
        call.videoOn = !call.videoOn;
        updateVideoButton(call, !call.videoOn);
        // always show the icon if video is turned off
        if (call.videoOn) {
          localVideo.parent().fadeIn();
        } else {
          localVideo.parent().fadeOut();
        }
      })
      .catch(function(e) {
        console.error('toggling video failed with call ' + call.mediaCall.id + ' error (' + e + ')');
      });
    }
  );
  // attach the UI to the call object
  call.win = callDiv;
  return call;
}

/**
 * Updates the video button icon based on the video state
 *
 * @param {object} call 
 *   the call object created by {@link createCallUI} to update the
 *   video button
 *
 * @param {boolean} isVideo 
 *   whether video is enabled
 */
function updateVideoButton(call, isVideo) {
  var button = call.win.find('.media_call_video');
  if (isVideo !== call.videoOn && button) {
    button.attr('src', !isVideo ? 'images/media/video_off_button.png' : 'images/media/video_on_button.png')
    return true;
  }
  return false;
}

/**
 * Handles making a call from the conversation UI
 *
 * @param {object} chat 
 *   the chat the call is made from
 *
 * @param {boolean} isVideo 
 *   whether video is offered
 */
function handleMakeCall(chat, isVideo) {
  // call to each participants
  chat.participants.forEach(function(p) {
    // except the current user
    if (p.regId !== userRegId) {
      var contactInfo = contactsManager.getUser(p.regId);
      if (contactInfo) {
        var call = createCallUI(contactInfo, isVideo);
        bbmsdk.media.makeCall(
          new BBMEnterprise.Media.Callee(p.regId),
          new BBMEnterprise.Media.CallOptions(isVideo, 
            call.remoteVideo, call.localVideo))
        .then(function(mediaCall) {
          if (call.win.closed) {
            mediaCall.end();
            return;
          }
          call.mediaCall = mediaCall;

          // save the call in our mapping
          callMap.push(call);

          // set the initial state of the video button base don the actual
          // state of the local video offering
          if (updateVideoButton(call, mediaCall.localMedia().video)) {
            call.videoOn = mediaCall.localMedia().video;
          }

          // attach the call to events
          handleMediaCallEvents(call, p.regId);
        })
        .catch(function(e) {
          console.error('failed to make call with user ' + p.regId + ' error (' + e + ')');
          // remove the UI
          call.win.find('.media_call_end').click();
        });
      } else {
        console.warn('no contact is found for regid ' + p.regId);
      }
    }
  });
}

/**
 * Answers an incoming call
 * @param {object} mediaCall
 *   The media call received on event {@link BBMEnterprise.Media#incomingCall}
 * @param {string} callerRegId
 *   The regId of the caller
 * @param {boolean} isVideo
 *   Whether to answer the call with video enabled
 */
function answerCall(mediaCall, callerRegId, isVideo) {
  var call = createCallUI(callerRegId, isVideo);
  call.mediaCall = mediaCall;

  // save the call in our mapping
  callMap.push(call);
  // attach event handling to the call
  handleMediaCallEvents(call, callerRegId);
  // actually issue the answer of the call
  mediaCall.answer(new BBMEnterprise.Media.CallOptions(isVideo, call.remoteVideo, call.localVideo))
  .then(function() {
    // update the video button state based on the actual
    // local video state
    if (updateVideoButton(call, mediaCall.localMedia().video)) {
      call.videoOn = mediaCall.localMedia().video;
    }
  })
  .catch(function(e) {
    console.error('failed to answer call ' + mediaCall.id + ' error(' + e + ')');
  });
}

/**
 * Handles the removal of a notification bubble
 * @param notification {object}
 *   The JQuery selector of the notification created
 */
function removeNotification(notification) {
  notification.removeClass('call_notification_wrapper_enter');
  notification.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd',
    function() {
      notification.remove();
    });
}

/**
 * Handles the common UI elements of a notification bubble
 *
 * @param notification {object}
 *   The JQuery selector of the notification created
 *
 * @param media {object}
 *   The media object returned on event {@link BBMEnterprise.Media#incomingCall} or
 *   event {@link BBMEnterprise.Media#incomingDataConnection}
 *
 * @return {Promise}
 *    which is resolved when the notification is fully loaded,
 *    and is never rejected
 */
function handleNewNotification(notification, media) {
  // attach event handling to the notification after
  // the notification is fully loaded
  function attachNotificationHandler() {
    notification.find('.call_notification_button_reject').click(function() {
      media.reject(BBMEnterprise.Media.CallEndReason.REJECT_CALL);
      removeNotification(notification);
    });
    media.on('disconnected', function() {
      removeNotification(notification);
    });
    // trick to allow css animation on subsequent notifications
    void notification[0].offsetWidth;
    // add the class to start animation
    notification.addClass('call_notification_wrapper_enter');
  }

  // we'll attach the handler whether the images are loaded
  // or timed out
  var p = waitForImagesToLoad(notification)
  .then(attachNotificationHandler)
  .catch(function() {
    console.warn('loading images for call UI timed out, continue anyway.');
    attachNotificationHandler();
  });

  // now add it to the container
  notification.appendTo(callNotificationContainer);
  // try to flash the tab if not active
  window.focus();

  return p;
}

/**
 * Creates a notification bubble that allows user to interact
 * with the incoming call
 *
 * @param {object} mediaCall 
 *   The media call received on event {@link BBMEnterprise.Media#incomingCall}
 *
 * @param {string} callerRegId
 *   The regId info of the caller
 */
function createIncomingCallNotification(mediaCall, callerRegId) {
  var caller_image = contactsManager.getUserAvatar(callerRegId) 
    || 'images/media/default_contact.png';
  var notificationContainerHtml = '<div class="call_notification_incoming"></div>';
  var videoOffered = mediaCall.remoteMedia().video;
  var notificationHtml =
    '<div class="call_notification_wrapper" id="call_notification_wrapper_' + mediaCall.id + '">' +
      '<img src="' + caller_image + '" class="call_notification_caller_avatar"/>' +
      '<div class="call_notification_status">Incoming call from ' 
        + contactsManager.getUserName(callerRegId) + '...</div>' +
      '<div class="call_notification_buttons">' +
        (videoOffered ? '<div><img src="images/media/video_acceptcall.png" class="call_notification_button_video"/></div>' : '') +
        '<div><img src="images/media/voice_acceptcall.png" class="call_notification_button_accept"/></div>' +
        '<div><img src="images/media/voice_endcall.png" class="call_notification_button_reject"/></div>' +
      '</div>' +
    '</div>';
  if (!callNotificationContainer) {
    callNotificationContainer = $(notificationContainerHtml).appendTo('body');
  }
  var notification = $(notificationHtml);

  // attach event handling to the notification after
  // the notification is fully loaded
  handleNewNotification(notification, mediaCall).then(function() {
    if (videoOffered) {
      notification.find('.call_notification_button_video').click(function() {
        answerCall(mediaCall, callerRegId, true);
        removeNotification(notification);
      });
    }
    notification.find('.call_notification_button_accept').click(function() {
      answerCall(mediaCall, callerRegId, false);
      removeNotification(notification);
    });
  });
}

/**
 * Handles the incoming call event and creates the notification
 * @param mediaCall
 *   The media call received on event {@link BBMEnterprise.Media#incomingCall}
 */
function handleIncomingCall(mediaCall) {
  var callerRegId = mediaCall.callParty.regId;
  var contactInfo = contactsManager.getUser(callerRegId);
  // Checks whether it is from a known contact
  if (!contactInfo) {
    mediaCall.reject(BBMEnterprise.Media.CallEndReason.REJECT_CALL);
    console.warn('Reject incoming call for user reg id ' + callerRegId 
      + ' as it is not a contact');
    return;
  }
  // From known contact, accept the call
  mediaCall.accept();
  createIncomingCallNotification(mediaCall, callerRegId);
}


//---------------------- File transfer drag drop ----------------------

/**
 * Make the drag event compatible across browsers by
 * ensuring the files array is populated.
 *
 * @param {DragEvent} event The event from the ondragover or ondrop handler.
 */
function compatibleDragEvent(event) {
  var dt = event.dataTransfer;
  if (!dt) {
    return;
  }
  if (!dt.files && dt.items) {
    dt.files = [];
    // Use DataTransferItemList interface to access the file(s)
    for (var i=0; i < dt.items.length; i++) {
      if (dt.items[i].kind == "file") {
        dt.files.push(dt.items[i].getAsFile());
      }
    }
  }
}

/* A debounce timer to cancel out the dragleave and dragover event */
var dragOverlayHideTimer;

/**
 * Drag/drop handler for file transfer dragging over the element.
 *
 * @param {DragEvent} event The event from the ondragover handler.
 */
function onFileSendDragoverHandler(event) {
  var overlay = $('.fileSendDragDropOverlay');
  if (!overlay.is(':visible')) {
    compatibleDragEvent(event);
    var dt = event.dataTransfer;
    var length = dt.files.length || dt.items.length;
    // check if all selected items are files
    var notAllFiles = false;
    if (dt.items) {
      for (var i = 0; i < dt.items.length; i++) {
        if (notAllFiles = (dt.items[i].kind !== 'file')) {
          break;
        }
      }
    }
    if (notAllFiles) {
      $('.fileSendDragDropOverlayText').text('Please select only files.');
    } else if (length > MAX_FILES_SEND) {
      $('.fileSendDragDropOverlayText').text('Too may files selected (max is ' 
        + MAX_FILES_SEND + ').');
    } else {
      $('.fileSendDragDropOverlayText').text('Drop to send files to the participants');
    }
    $('.fileSendDragDropOverlay').show();
  }
  if (dragOverlayHideTimer) {
    clearTimeout(dragOverlayHideTimer);
    dragOverlayHideTimer = null;
  }
  event.preventDefault();
}

/**
 * Drag/drop handler for file transfer dragging ended.
 *
 * @param {DragEvent} event The event from the ondragleave handler.
 */
function onFileSendDragendHandler(event) {
  // give a little debounce time for the overlay to be removed,
  // to avoid flickers when dragging around in the dropping area
  if (!dragOverlayHideTimer) {
    dragOverlayHideTimer = setTimeout(function () {
      $('.fileSendDragDropOverlay').hide();
      dragOverlayHideTimer = null;
    }, 500);
  }
  event.preventDefault();
}

/**
 * Drag end handler for the conversation pane.
 * Since the event will be taken over by the overlay,
 * this event is handled but ignored.
 *
 * @param {DragEvent} event The event from the ondragleave handler.
 */
function onFileSendDragendIgnoredHandler(event) {
  event.preventDefault();
}

/**
 * Drag/drop handler for dropping on the element.
 *
 * @param {DragEvent} event The event from the ondrop handler.
 */
function onFileSendDropHandler(event) {
  $('.fileSendDragDropOverlay').hide();
  event.preventDefault();
  compatibleDragEvent(event);
  var dt = event.dataTransfer;
  if (dt.files.length > MAX_FILES_SEND) {
    console.warn('File transfer aborted as too many files selected: ' + dt.files.length);
    return;
  }
  // send all the files
  for(var i = 0; i < dt.files.length; i++) {
    sendCloudFile(selectedChatId, dt.files[i]);
  }
}

/**
 * Send a new chat message with specified file attached.
 * @param {type} chatId the ID for the chat to send the new message in
 * @param {type} file the file to upload to the cloud and send chat message for
 */
function sendCloudFile(chatId, file) {
  try {
    if (!FileReader) {
      console.error("sendCloudFile: not supported missing FileReader");
      return;
    }

    var data = {
      suggestedFileName: encodeURIComponent(file.name),
      fileSize: file.size,
      fileType: file.type
    };

    console.log("sendCloudFile: chatId="+chatId+" file="+file+" metaData="+JSON.stringify(data));

    send(TAG_MESSAGE_FILE, data, file);

  } catch(e) {
    console.error('sendCloudFile: error=' + e);
  }
}

/* ------------ END ---------- */
