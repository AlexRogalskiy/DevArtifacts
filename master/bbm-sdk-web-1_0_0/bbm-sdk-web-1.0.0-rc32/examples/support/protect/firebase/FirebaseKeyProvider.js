//****************************************************************************
// Copyright 2017 BlackBerry.  All Rights Reserved.
//
// You must obtain a license from and pay any applicable license fees to
// BlackBerry before you may reproduce, modify or distribute this software, or
// any work that includes all or part of this software.
//

"use strict";

(function(FirebaseKeyProvider) {
  // This function will always be called with the correct global context to
  // which this module may export.
  var global = this;

  // Where do we place the module?  Do we have an exports object to use?
  if (typeof exports !== 'undefined') {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = FirebaseKeyProvider();
    }
    exports.FirebaseKeyProvider = FirebaseKeyProvider();
  }
  else {
    global.FirebaseKeyProvider = FirebaseKeyProvider();
  }
}).call(this, function() {

  // :: ----------------------------------------------------------------------
  // :: Construction

  /**
   * Create a new Firebase key provider object that will handle the calls to
   * get and set the keys in the Firebase Database as needed for the BBM SDK.
   *
   * This class expects that the firebase APIs have already been imported and
   * configured for the given appName.
   *
   * @param {String} regId
   *   The BBM registration ID as provided once the BBM SDK has successfully
   *   registered with the infrastructure.
   *
   * @param {Function} setupNeededCallback
   *   The function called when the data in the Firebase Database has changed
   *   in such a way that is inconsistent with the currently setup key
   *   provider instance.
   *
   *   The function is expected to take a single object as a parameter which
   *   has the following structure:
   *   {
   *     // The reason the setup needed callback is being called.  Possible
   *     // values are:
   *     //
   *     // * NOT_SETUP
   *     //   The database is no longer setup for the currently logged in
   *     //   firebase user at all.  This means that the regId in the
   *     //   privateKeyStore for the user is no longer set and is no longer
   *     //   claimed in the regIdStore.
   *     //
   *     // * REGID_CONFLICT
   *     //   The database is currently setup in such a way that associates
   *     //   the currently logged in firebase user with a different regId
   *     //   value than the one used by this key provider instance.
   *     reason: {String},
   *
   *     // Optional.  Only set when the reason is REGID_CONFLICT.  This field
   *     // specifies the regId currently in the Firebase Database that
   *     // is different than the regId used for this key provider instance.
   *     regId: {String}
   *  }
   *
   * @param {String} appName
   *   Optional.  The app name passed to the firebase.initializeApp function.
   *   This is needed to ensure that the correct firebase configuration
   *   instance is used to get and set data in the App's database.  When unset
   *   the default app name is used.
   */
  // Create a new object that will be our Firebase key provider.
  var FirebaseKeyProvider = function(regId, setupNeededCallback, appName) {
    if (typeof regId !== "string" || regId.length === 0) {
      throw new Error(
        "FirebaseKeyProvider: regId must be a non-empty string");
    }

    if (typeof setupNeededCallback !== "function") {
      throw new Error(
        "FirebaseKeyProvider: setupNeededCallback must be a function");
    }

    // Get and remember the firebase database and the currently logged in user
    // associated with the appName we were given.
    m_db = firebase.database(appName);
    m_uid = firebase.auth(appName).currentUser.uid;

    // Remember the BBM regId we were given.
    m_regId = regId;

    // Remember the callback we need to call when the firebase key storage
    // implementation needs to be setup again.
    m_setupNeededCallback = setupNeededCallback;
  }

  FirebaseKeyProvider.prototype = Object.create(Object.prototype);
  FirebaseKeyProvider.prototype.constructor = FirebaseKeyProvider;

  // :: ----------------------------------------------------------------------
  // :: Interface

  /**
   * A function that will ensure that the Firebase key store has been setup in
   * a manner that will allow the key provider interface required by the BBM
   * SDK to behave consistently.
   *
   * The promise returned must be resolved before the BBM SDK is initialized
   * using this key provider instance.
   *
   * @returns {Promise}
   *   The promise that the key store will be setup.
   *
   *   On success, the promise is resolved with no parameters.
   *
   *   On failure, the promise is rejected with an Error or a FirebaseError.
   */
  FirebaseKeyProvider.prototype.setup = function() {
    // Remember that we aren't yet setup.
    m_setupComplete = false;

    // While we are setting up the key storage, we may encounter a key store
    // that has been previously setup by our authenticated user using a
    // different regId.  It's an unlikely case, but we try our best to recover
    // from it.
    var conflictingRegId = false;

    // A helper function to setup the private key store within a transaction.
    function setupPrivateKeyStore() {
      return transaction(privateKeyStore("regId"), function(regId) {
        if (regId === null || regId === m_regId) {
          // We were never setup or we previously had started setting up with
          // the same regId.  We want to continue on with the regId we were
          // constructed with.
          return m_regId;
        }

        // This case is the exceptional case where we were previously setup
        // in the database with a different regId.  We have to abort the
        // transaction, so return undefined, but remember the conflicting
        // regId value.
        conflictingRegId = regId;
        return;
      });
    }

    // We expect that majority of the times we need to setup the key provider
    // the firebase database will have already been setup for use with the
    // regId we were told to use.  To confirm whether or not this is the case,
    // attempt to set the regId we are claiming in the regIdStore, as it can
    // only be written if the private key store is already setup for us with
    // this regId as well.
    return Promise.race([
      regIdStore(m_regId).set(m_uid),
      // Time out the call after 10 seconds if there is no response. This is a
      // workaround for a bug in the firebase node module. It has been observed
      // that the promise returned by set is never resolved or rejected in some
      // cases where the HTTPS server returns an invalid SSL certificate.
      new Promise(function(resolve, reject) {
        setTimeout(
          function() {
            var msg = 'No response after 10 seconds to firebase set request'
            console.error(msg);
            reject(new BBMEnterprise.Error.TemporaryFailure(msg));
          },
          10000);
      })
    ])
    .then(function() {
      // Writing the regId claim worked, so the existing data in the firebase
      // database is consistent with our current regId.  No further action
      // needs to be taken for setup.  Return an object that can be easily
      // dealt with in the next success portion of the promise chain.  We use
      // setupComplete, which is known not be a member of promise resolution
      // used by the firebase transaction.
      return { committed: true, setupComplete: true };
    })
    .catch(function(error) {
      if(!(error instanceof BBMEnterprise.Error.TemporaryFailure)) {
        // Attempting to write the regId failed, which means We aren't setup.
        // The most common case where we aren't setup is when this a brand new
        // user and we have no key store.  So, start out by trying to write our
        // regId to the privateKeyStore.
        log("Setting up Firebase key storage for regId=" + m_regId);
        return setupPrivateKeyStore();
      }
      throw new Error(error.toString());
    })
    .then(function(tranStatus) {
      // Did the transaction resolve because we found a conflicting regId?
      if (! conflictingRegId) {
        // No, just resolve the promise with the tranStaus and handle the
        // success/abort case in the next step in the chain.
        return tranStatus;
      }

      // We have a conflicting regId to deal with.  Remove all keys that we
      // had previously setup for ourselves under the old regId.  Clear the
      // conflicting regId, so we know our next attempt again results in a
      // conflict.
      var regId = conflictingRegId;
      conflictingRegId = false;
      log("Conflicting regId=" + regId
          + " in privateKeyStore; attempting recovery");
      return removeAllKeys(regId)
      .then(function() {
        // We succeeded in removing all the keys for the regId that blocked
        // our setup.  So we can now retry the transaction to setup the
        // private key storage.
        return setupPrivateKeyStore();
      });
    })
    .then(function(tranStatus) {
      // Did we again end up with a regId conflict?
      if (conflictingRegId) {
        throw new Error("Conflicting regId=" + conflictingRegId
                        + " in privateKeyStore; failing setup");
      }

      // No conflict in the regId, but did the transaction still abort?
      if ( ! tranStatus.committed) {
        // The transaction was aborted normally.  This is expected to only
        // happen if something calls set() on our privateKeyStore and
        // automagically aborting our transaction.
        throw new Error("Transaction to setup privateKeyStore for regId="
                        + m_regId + " was aborted");
      }

      // Success!  Check to see if it is because setup has been determined to
      // be complete.
      if (tranStatus.setupComplete) {
        // Yes. Fall through to the next step in the promise chain.
        return;
      }

      // We now need to make sure that the regId is claimed.  We don't have
      // read permissions to the regId store, so we have to blindly try to set
      // the regId.
      //
      // Barring normal network and authentication failures, this will only
      // fail because someone else has already claimed the regId we are trying
      // to work with.  There is nothing we can really do about that
      // situation, so we are now stuck.
      return regIdStore(m_regId).set(m_uid);
    })
    .then(function() { m_setupComplete = true; });
  }

  /**
   * Get the promise of the local user's encryption and signing key pairs.
   *
   * @returns {Promise}
   *   The promise will be resolved with an object with the following
   *   structure:
   *   {
   *     // The byte array containing the private encryption key data to be
   *     // imported into the BBM SDK.
   *     privateEncryptionKey: {Uint8Array},
   *
   *     // The byte array containing the public encryption key data to be
   *     // imported into the BBM SDK.
   *     publicEncryptionKey: {Uint8Array},
   *
   *     // The byte array containing the private signing key data to be
   *     // imported into the BBM SDK.
   *     privateSigningKey: {Uint8Array},
   *
   *     // The byte array containing the public signing key data to be
   *     // imported into the BBM SDK.
   *     publicSigningKey: {Uint8Array}
   *   }
   *
   *  If no keys are available or if decoding the stored keys fails the
   *  promise will be rejected and the profile keys will be (re)generated by
   *  the SDK.
   *
   *  If new keys are generated because of a failure, a call will be made to
   *  saveProfileKeys() so that the newly generated keys can be stored.
   */
  FirebaseKeyProvider.prototype.getProfileKeys = function() {
    var result = {};

    // Make sure we are setup before proceeding.
    if (! m_setupComplete) {
      m_setupNeededCallback({ reason: "NOT_SETUP" });
      return rejected("FirebaseKeyProvider is not setup");
    }

    // Lookup the user's private keys.
    return privateKeyStore().once("value")
    .then(function(privateKeys) {
      // If we don't have any private keys or the regId doesn't match, we have
      // a database that is no longer setup for this key store.
      if (! privateKeys.val()) {
        // Let the application know that the key store setup is needed.  We
        // don't have any key data to pass to the SDK, so return the empty
        // object and we'll continue with generated keys.
        m_setupNeededCallback({ reason: "NOT_SETUP" });
        return rejected("FirebaseKeyProvider no keys available");
      }
      if (privateKeys.val().regId !== m_regId) {
        // Let the application know that the key store is associated with a
        // different regId.
        m_setupNeededCallback({ reason: "REGID_CONFLICT",
                                regId: privateKeys.val().regId });
        return rejected("FirebaseKeyProvider regId conflict");
      }

      // Remember the private key values we pulled out.  We need to decode
      // them into a Uint8Array first.  If this fails we will just return the
      // empty object and let the SDK generate new keys.
      try {
        result.privateEncryptionKey
          = BBMEnterprise.Util.b2array(privateKeys.val().encryptionKey);
      }
      catch(error) {
        log("Failed do decode the private encryption key="
            + privateKeys.val().encryptionKey + "; error=" + error);
        return rejected("FirebaseKeyProvider failed to decode private "
                        + "encryption key: " + error)
      }
      try {
        result.privateSigningKey
          = BBMEnterprise.Util.b2array(privateKeys.val().signingKey);
      }
      catch(error) {
        log("Failed do decode the private signing key="
            + privateKeys.val().signing + "; error=" + error);
        return rejected("FirebaseKeyProvider failed to decode private "
                         + "signing key: " + error);
      }

      // Now we need to fetch our public keys.
      return publicKeyStore(m_regId).once("value");
    })
    .then(function(publicKeys) {
      // Remember the public key values we pulled out.  We need to decode them
      // into a Uint8Array first.  If this fails we will just return the empty
      // object and let the SDK generate new keys.
      try {
        result.publicEncryptionKey
          = BBMEnterprise.Util.b2array(publicKeys.val().encryptionKey);
      }
      catch(error) {
        log("Failed do decode the public encryption key="
            + publicKeys.val().encryptionKey + "; error=" + error);
        return rejected("FirebaseKeyProvider failed to decode public "
                         + "encryption key: " + error);
      }
      try {
        result.publicSigningKey
          = BBMEnterprise.Util.b2array(publicKeys.val().signingKey);
      }
      catch(error) {
        log("Failed do decode the public signing key="
            + publicKeys.val().signing + "; error=" + error);
        return rejected("FirebaseKeyProvider failed to decode public "
                         + "signing key: " + error);
      }

      // We can now resolve the promise with all of the keys we were able to
      // pull out.
      return result;
    });
  }

  /**
   * Save the local user's encryption and signing key pairs.
   *
   * It is the app's responsibility to ensure that these keys are safely
   * stored and can be retrieved during the next session.
   *
   * Failure to successfully save the keys will have the following impacts on
   * behaviour:
   *  1. Other users cannot invite the local user to chats because the chat
   *     key will not be encrypted with current public encryption key.
   *  2. Other users will not be able to verify any new message sent to a chat
   *     during this session because the user's current public signing key
   *     will not be available for others to use.
   *  3. Messages sent during this session will not be verifiable as being
   *     sent by the local user during the next session because the keys used
   *     for the current session will have been lost.
   *
   * @returns void
   */
  FirebaseKeyProvider.prototype.saveProfileKeys = function(keys) {
    // Make sure we are setup.
    if (! m_setupComplete) {
      m_setupNeededCallback({ reason: "NOT_SETUP" });
      return;
    }

    // Encode each of the keys for storage.
    var result = {};
    var success = true;
    Object.keys(keys).forEach(function(key) {
      try { result[key] = BBMEnterprise.Util.array2b(keys[key]); }
      catch(error) {
        log("Failed to encode the " + key + "=" + keys[key]
            + "; key will not be saved; error=" + error);
        success = false;
      }
    });

    // The failure has already been logged, so just abort our attempt to save
    // the keys.
    if (! success) { return; }

    // If private keys cannot be written because the data is in a bad state,
    // we'll need to call the setupNeededCallback.
    var conflictingRegId = false;

    // Write the private keys in a transaction.
    var updateCount = 0;
    transaction(privateKeyStore(), function(data) {
      ++updateCount;

      // The first time the transaction update function is called the data
      // will always be null.  If the data we are writing is different than
      // what is currently present, it will be called again.
      if (data === null) {
        return updateCount > 1 ? undefined : data;
      }

      // After the first call to the transaction update function we have
      // existing data which must contain a regId.  Make sure the regId
      // already in the database doesn't conflict with the regId we are setup
      // with.
      if (data.regId !== m_regId) {
        // Remember the conflicting regId and return an undefined value to
        // abort the transaction.
        conflictingRegId = data.regId;
        return;
      }

      data.encryptionKey = result.privateEncryptionKey;
      data.signingKey = result.privateSigningKey;
      return data;
    })
    .then(function(tranStatus) {
      if (! tranStatus.committed) {
        // Do we need to notify the app that we need to be setup again?
        if (conflictingRegId) {
          m_setupNeededCallback({ reason: "REGID_CONFLICT",
                                  regId: conflictingRegId });
        }
        return rejected("Transaction to save private keys has been aborted");
      }
      return transaction(publicKeyStore(m_regId), function(data) {
        // If the data does not yet exist, create a new object for setting our
        // public keys.
        if (data === null) {
          data = {};
        }

        data.encryptionKey = result.publicEncryptionKey;
        data.signingKey = result.publicSigningKey;
        return data;
      });
    })
    .then(function(tranStatus) {
      if (! tranStatus.committed) {
        return rejected("Transaction to save public keys has been aborted");
      }
    })
    .catch(function(error) {
      // Just log the error.  There isn't much we can do about the failure at
      // this point.
      log("Error saving profile keys: " + error);
    });
  }

  /**
   * Get the key data associated with all of the chats known to the user.
   *
   * @returns {Promise}
   *   The promise of the known chat key data object.  The object members are
   *   the chatIds and the member values are Uint8Array objects containing the
   *   key data associated with the chatId.
   *   {
   *     <chatId 1>: {Uint8Array},
   *     <chatId 2>: {Uint8Array},
   *     ...
   *   }
   *
   *   When no chat keys are known an empty object is used to resolve the
   *   promise.
   *
   *   Any rejection of this promise will be treated as a temporary failure
   *   and the chat keys will be recovered later on demand with a call to
   *   getChatKey().
   */
  FirebaseKeyProvider.prototype.getChatKeys = function() {
    // Make sure we are setup.
    if (! m_setupComplete) {
      m_setupNeededCallback({ reason: "NOT_SETUP" });
      return rejected("FirebaseKeyProvider is not setup");
    }

    // TODO: Monitor the RegId for changes - if it changes, notify app that
    // setup is required again.
    //
    // For now, make sure that the regId in the database is consistent with
    // our expectations.
    return privateKeyStore("regId").once("value")
    .then(function(regId) {
      if (regId.val() === null) {
        m_setupNeededCallback({ reason: "NOT_SETUP" });
        return rejected("FirebaseKeyProvider is not setup");
      }

      if (regId.val() !== m_regId) {
        // Let the application know that the key store is associated with a
        // different regId.
        m_setupNeededCallback({ reason: "REGID_CONFLICT",
                                regId: regId.val() });
        return rejected("FirebaseKeyProvider regId conflict");
      }
      // Fetch all of the chat keys.
      return privateKeyStore("mailboxes").once("value");
    })
    .then(function(chatKeys) {
      var result = {};

      if (! chatKeys.val()) {
        return result;
      }

      // Decode the chat ID and the key to be returned in the result.
      Object.keys(chatKeys.val()).forEach(function(id) {
        var chatId;
        var key;

        try { chatId = BBMEnterprise.Util.base64urlDecode(id); }
        catch(error) {
          log("Ignoring key for chatId=" + id
              + "; failed to decode value; error=" + error);
          return;
        }
        try { key = BBMEnterprise.Util.b2array(chatKeys.val()[id]); }
        catch(error) {
          log("Ignoring key for chatId=" + id + "; failed to decode key="
              + chatKeys.val()[id] + "; error=" + error);
          return;
        }

        // Remember the decoded values.
        result[chatId] = key;
      });

      // We have all the keys we know about.  Return them.
      return result;
    });
  }

  /**
   * Get the chat key data associated with the given chatId.
   *
   * @returns {Promise}
   *   The promise of the chat key data given as a Uint8Array.
   *
   *   When the promise is rejected with BBMEnterprise.Error.NotFoundError,
   *   the chat key is known not to exist.  When a chat key is known not to
   *   exist, the chat will be automatically cleaned up as recovery of chat
   *   contents will not be possible.
   *
   *   Any other rejection error will be treated as a temporary error and
   *   another call to getChatKey() will be made the next time the key is
   *   needed.  This will result in sub-optimal behaviour patterns and any
   *   encrypted information in the chat details and all messages will not be
   *   recoverable until getChatKeys() resolves with a valid key.
   */
  FirebaseKeyProvider.prototype.getChatKey = function(chatId) {
    // Make sure we are setup.
    if (! m_setupComplete) {
      m_setupNeededCallback({ reason: "NOT_SETUP" });
      return rejected("FirebaseKeyProvider is not setup");
    }

    // TODO: Monitor the RegId for changes - if it changes, notify app that
    // setup is required again.
    //
    // For now, make sure that the regId in the database is consistent with
    // our expectations.
    return privateKeyStore("regId").once("value")
    .then(function(regId) {
      if (regId.val() == null) {
        m_setupNeededCallback({ reason: "NOT_SETUP" });
        return rejected("FirebaseKeyProvider is not setup");
      }

      if (regId.val() !== m_regId) {
        // Let the application know that the key store is associated with a
        // different regId.
        m_setupNeededCallback({ reason: "REGID_CONFLICT",
                                regId: regId.val() });
        return rejected("FirebaseKeyProvider regId conflict");
      }

      // First we need to encode the chatId so that we can lookup the key
      // associated with it safely.
      var id;
      try { id = BBMEnterprise.Util.base64urlEncode(chatId); }
      catch(error) {
        log("Failed to encode chatId=" + chatId + "; error=" + error);
        return rejected("FirebaseKeyProvider failed to encode chatId="
                        + chatId + ": " + error);
      }

      // Fetch all of the chat keys.
      return privateKeyStore("mailboxes/" + id).once("value");
    })
    .then(function(chatKey) {
      if (! chatKey.val()) {
        // We know there is no such key.  Throw a not found error to reject
        // the promise.
        throw new BBMEnterprise.Error.NotFoundError(
          "FirebaseKeyProvider no chatKey for chatId=" + chatId);
      }

      // Decode the chat key and resolve the promise.
      try { return BBMEnterprise.Util.b2array(chatKey.val()); }
      catch(error) {
        log("Failed to decode key for chatId=" + chatId + " chatKey="
            + chatKey.val() + "; error=" + error);
        return rejected("FirebaseKeyProvider failed to decode key for chatId="
                        + chatId + ": " + error);
      }
    });
  }

  /**
   * Save the chat key data associated with the given chatId.
   *
   * It is the app's responsibility to ensure that the chat key data is safely
   * stored and can be retrieved during the next session.
   *
   * Failure to successfully save the chat key data will result in the chat
   * identified by chatId being inaccessible during the next session.  The
   * user will have to leave the chat and get re-invited to recover the chat
   * key.
   *
   * @returns void
   */
  FirebaseKeyProvider.prototype.saveChatKey = function(chatId, key) {
    // Make sure we are setup.
    if (! m_setupComplete) {
      m_setupNeededCallback({ reason: "NOT_SETUP" });
      return;
    }

    // TODO: Monitor the RegId for changes - if it changes, notify app that
    // setup is required again.
    //
    // For now, make sure that the regId in the database is consistent with
    // our expectations.
    privateKeyStore("regId").once("value")
    .then(function(regId) {
      if (regId.val() == null) {
        m_setupNeededCallback({ reason: "NOT_SETUP" });
        return rejected("FirebaseKeyProvider is not setup");
      }

      if (regId.val() !== m_regId) {
        // Let the application know that the key store is associated with a
        // different regId.
        m_setupNeededCallback({ reason: "REGID_CONFLICT",
                                regId: regId.val() });
        return rejected("FirebaseKeyProvider regId conflict");
      }

      // First we need to encode the chatId so that we can set the key
      // associated with it safely.
      var id;
      try { id = BBMEnterprise.Util.base64urlEncode(chatId); }
      catch(error) {
        log("Failed to encode chatId=" + chatId + "; error=" + error);
        throw error;
      }

      // Next encode the chat key so we can store it.
      var chatKey;
      try { chatKey = BBMEnterprise.Util.array2b(key); }
      catch(error) {
        log("Cannot save chat key for chatId=" + chatId
            + ": failed to encode key=" + key + "; error=" + error);
        throw error;
      }

      // Save the key in the database.
      return transaction(privateKeyStore("mailboxes/" + id),
                         function(data) { return chatKey; });
    })
    .catch(function(error) {
      log("Failed to save chat key for chatId=" + chatId + "; error="
          + error);
    });
  }

  /**
   * Remove the chat key data associated with the given chatId.
   *
   * It is the app's responsibility to ensure that the chat key data is removed
   * from storage.
   *
   * Failure to successfully remove the chat key data will result in a leakage
   * of chat keys in external storage.
   *
   * @returns void
   */
  FirebaseKeyProvider.prototype.removeChatKey = function(chatId) {
    // Make sure we are setup.
    if (! m_setupComplete) {
      m_setupNeededCallback({ reason: "NOT_SETUP" });
      return;
    }

    // TODO: Monitor the RegId for changes - if it changes, notify app that
    // setup is required again.
    //
    // For now, make sure that the regId in the database is consistent with
    // our expectations.
    privateKeyStore("regId").once("value")
    .then(function(regId) {
      if (regId.val() == null) {
        m_setupNeededCallback({ reason: "NOT_SETUP" });
        return rejected("FirebaseKeyProvider is not setup");
      }

      if (regId.val() !== m_regId) {
        // Let the application know that the key store is associated with a
        // different regId.
        m_setupNeededCallback({ reason: "REGID_CONFLICT",
                                regId: regId.val() });
        return rejected("FirebaseKeyProvider regId conflict");
      }

      // First we need to encode the chatId so that we can remove it.
      var id;
      try { id = BBMEnterprise.Util.base64urlEncode(chatId); }
      catch(error) {
        log("Failed to encode chatId=" + chatId + "; error=" + error);
        throw error;
      }

      // Save the key in the database.
      return privateKeyStore("mailboxes/" + id).remove()
    })
    .catch(function(error) {
      log("Cannot remove chat key for chatId=" + chatId + "; error="
          + error);
    });
  }

  /**
   * Get the public key data for the user identified by their BBM registration
   * ID.
   *
   * @returns {Promise}
   *   The promise of the user's public encryption and signing keys given as
   *   an object with the following structure:
   *   {
   *     // The byte array containing the user's public encryption key.
   *     encryptionKey: {Uint8Array},
   *
   *     // The byte array containing the user's public signing key.
   *     singingKey: {Uint8Array}
   *   }
   *
   *   The promise may be rejected with any error because the keys were not
   *   found or they failed to decode.  When this occurs, the user cannot be
   *   invited to join chats and any messages from the user in a chat will not
   *   be verifiable.
   */
  FirebaseKeyProvider.prototype.getPublicKeys = function(regId) {
    // Make sure we are setup.
    if (! m_setupComplete) {
      m_setupNeededCallback({ reason: "NOT_SETUP" });
      return rejected("FirebaseKeyProvider is not setup");
    }

    return publicKeyStore(regId).once("value")
    .then(function(publicKeys) {
      if (! publicKeys.val()) {
        return rejected("FirebaseKeyProvider no public keys for regId="
                        + regId);
      }

      var result = {};

      // Remember the public key values we pulled out.  We need to decode them
      // into a Uint8Array first.  If this fails we will just return the empty
      // object and let the SDK generate new keys.
      try {
        result.encryptionKey
          = BBMEnterprise.Util.b2array(publicKeys.val().encryptionKey);
      }
      catch(error) {
        log("Failed do decode the public encryption key="
            + publicKeys.val().encryptionKey + " for regId=" + regId
            + "; error=" + error);
        return rejected("FirebaseKeyProvider failed to decode the public "
                        + "encryption key for regId=" + regId + ": " + error);
      }
      try {
        result.signingKey
          = BBMEnterprise.Util.b2array(publicKeys.val().signingKey);
      }
      catch(error) {
        log("Failed do decode the public signing key="
            + publicKeys.val().signingKey + " for regId=" + regId
            + "; error=" + error);
        return rejected("FirebaseKeyProvider failed to decode the public "
                        + "signing key for regId=" + regId + ": " + error);
      }

      // We can now resolve the promise with all of the keys we were able to
      // pull out.
      return result;
    });
  }

  /**
   * Static Factory class used to generate new instance of FirebaseKeyProvider
   */
  FirebaseKeyProvider.factory = {
    /**
     * Creates new instance for FirebaseKeyProvider
     * @returns {Promise} 
     * The promise of new instance of FirebaseKeyProvider
     */
    createInstance : function (regId, firebaseConfig, accessToken) {
      var keyProvider = null;
      firebase.initializeApp(firebaseConfig);
      var credential = firebase.auth.GoogleAuthProvider.credential(null, accessToken);

      // Sign-in to our Firebase project using the already logged
      // in google user's credentials.
      return firebase.auth().signInWithCredential(credential).then(function(user) {
          
        // We have an authenticated firebase user, we can now
        // initialize and setup the firebase key provider.
        keyProvider = new FirebaseKeyProvider(regId, function(data) {
          // TODO: JI:2365951 BBM-61922
          // createInstance should provide client's callback for the cases when 
          // keyProvider setup is needed, so client can take proper action.
          console.error(data);
        });

        // Setup the key provider so that the private key store
        // has been setup and the regId has been claimed in the
        // Firebase database.
        return keyProvider.setup();
      }).then(function() {
        // Setup has completed successfully.  We can now resolve
        // the promise with the setup key provider instance.
        return keyProvider;
      });
    }
  }
  
  // :: ----------------------------------------------------------------------
  // :: Helpers

  /**
   * Returns a firebase.database.Reference instance for the given path under
   * the user's private key storage area.
   *
   * @param {String} path
   *   The optional path of the private key data to which a reference is
   *   desired.  The path when specified is given relative to the user's
   *   private key store.  When omitted, the returned reference will be to the
   *   root of the user's private key store.
   *
   * @returns {firebase.database.Reference}
   *   The reference to the data contained in the path under the user's
   *   private key store.
   */
  function privateKeyStore(path) {
    return m_db.ref("privateKeyStore/" + m_uid + (path ? "/" + path : ""));
  }

  /**
   * Returns a firebase.database.Reference instance to the user's regId in
   * the regIds index.
   *
   * Based on the sample rules, reading from this index is forbidden.
   * However, a user may write their UID to this index.
   *
   * @returns {firebase.database.Reference}
   *   The reference to the user's regId claim entry in the regIds index.
   */
  function regIdStore(regId) {
    return m_db.ref("regIds/" + regId);
  }

  /**
   * Returns a firebase.database.Reference instance for the given path under
   * the user's private key storage area.
   *
   * @param {String} regId
   *   The BBM registration ID of the user whose public key store is to be
   *   accessed.
   *
   * @param {String} path
   *   The optional path of the public key data to which a reference is
   *   desired.  The path, when specified, is given relative to the user's
   *   public key store.  When omitted, the returned reference will be to the
   *   root of the user's public key store.
   *
   * @returns {firbase.database.Reference}
   *   The reference to the data contained in the path under the user's public
   *   key store.
   */
  function publicKeyStore(regId, path) {
    return m_db.ref("publicKeyStore/" + regId + (path ? "/" + path : ""));
  }

  /**
   * A local helper to emit a log message
   *
   * @param {String} message
   */
  function log(message) {
    console.log("FirebaseKeyProvider: ", message);
  }

  /**
   * A local helper to remove all of the user's keys from the database.
   *
   * @returns {Promise}
   *   The promise that all keys associated with the current user UID and
   *   regId will be removed from the database.
   *
   *   A successful resolution has no parameters.
   *
   *   On rejection, the FirebaseError or any error returned by the WebCrypto
   *   APIs is passed.
   */
  function removeAllKeys(regId) {
    // GOTCHA: Because of the how the access control rules are defined for the
    // Firebase database we must remove the key data in the reverse order of
    // how it was setup:
    //   1. Remove the public keys advertised under our claimed regId;
    //   2. Remove the regId claim by removing the entry in the regIds
    //      index; and
    //   3. Remove the private key storage.
    //
    // Refer to rules.sample.js in this directory for more details.
    //
    // Start by removing the public key data.
    return publicKeyStore(regId)
      .remove()

      // Then try to remove the user's claim on the regId.  If the removal of
      // the public key fails, push on and try to remove the regId claim.
      // It's likely futile, but try anyway.
      .then(function() { return regIdStore(regId).remove(); },
            function(error) { return regIdStore(regId).remove(); })

      // Then try to remove the user's private key data.  If the removal of
      // the regId claim fails, push on and try to remove the private key
      // data.  It is possible that the regId has been claimed by another user
      // and the private key data will be allowed to be removed.
      .then(function() { return privateKeyStore().remove(); },
            function(error) { return privateKeyStore().remove(); });
  }

  /**
   * A helper to run the given update function as a transaction against the
   * given reference point in the database.  The transaction will be run such
   * with 'applyLocally' set to false to ensure the transaction does not
   * complete until it has been applied remotely.
   *
   * @param {DatabaseReference} ref
   *   The reference point in the database to be modified by the update
   *   function.
   * @param {Function} update
   *   A developer-supplied function which will be passed the current data
   *   stored at this location (as a JavaScript object). The function should
   *   return the new value it would like written (as a JavaScript object). If
   *   undefined is returned (i.e. you return with no arguments) the
   *   transaction will be aborted and the data at this location will not be
   *   modified.
   *
   * @returns {Promise}
   *   The promise of the transaction status.  The status of the transaction
   *   is returned as an object with the following structure:
   *   {
   *     // A flag indicating whether or not the transaction completed with
   *     // the data begin committed to the database.  When set to false,
   *     // the transaction was aborted and the data was not committed.
   *     committed: {Boolean},
   *
   *     // The data snapshot of the reference location after update has
   *     // completed.
   *     snapshot: {DataSnapshot}
   *   }
   *
   *   If an unexpected error occurs, the returned promise will be rejected
   *   with an error.
   */
  function transaction(ref, update) {
    return ref.transaction(update, function() {}, false);
  }

  /**
   * A helper for returning a rejected promise with a given reason.
   *
   * @param {String} reason
   *   The reason given to the error used to reject the promise.
   *
   * @returns {Promise}
   *  A promise that is synchronously rejected with an error using the given
   *  reason as its message.
   */
    function rejected(reason) {
      return new Promise(function(resolve, reject) {
        reject(new Error(reason));
      });
    }

  // :: ----------------------------------------------------------------------
  // :: Data Members

  // Keep a handle on the firebase database.
  var m_db = null;

  // Remember the user's firebase UID and their BBM regId to access their
  // private and public key stores.
  var m_uid = null;
  var m_regId = null;

  // Remember whether or not setup has successfully completed.
  var m_setupComplete = false;

  // Remember the callback that we use to notify that the firebase key storage
  // is no longer setup.
  var m_setupNeededCallback;

  // Return the FirebaseKeyProvider object as the public interface.
  return FirebaseKeyProvider;
});

//****************************************************************************
