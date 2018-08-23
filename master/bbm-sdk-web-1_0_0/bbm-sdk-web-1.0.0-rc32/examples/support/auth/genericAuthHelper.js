//****************************************************************************
// Copyright 2017 BlackBerry.  All Rights Reserved.
//
// You must obtain a license from and pay any applicable license fees to
// BlackBerry before you may reproduce, modify or distribute this software, or
// any work that includes all or part of this software.
//

"use strict";
/** 
 * @namespace genericAuthHelper contains functions for work with oAuth2 services
 * */
function genericAuthHelper() {
  
  var m_cachedToken;
  var m_configuration;

  /**
   * Requests access token from specified authentification service
   * @param {Object} configuration
   *   Customer oAuth service information object which has properties:
   *   - authService: oAuth service endpoint
   *   - tokenInfoService: token info service endpoint
   *   - userInfoService: user info service endpoint
   *   - scope: scope of the access token being requested
   *   - clientId: application ID configured on oAuth server
   *   - redirectUri: URL required by oAuth server to redirect app after
   *                  access token is aquired
   */
  this.getOAuthAccessToken = function(configuration) {
    return new Promise(function(resolve, reject) {
      
      if (m_configuration === undefined ||
        m_configuration.clientId !== configuration.clientId)
      {
        // Configuration was changed, remove cached token
        m_cachedToken = null;
        // Reset configuration
        m_configuration = configuration;
      }

      if (m_cachedToken) {
        if (m_cachedToken.expiresIn > new Date().getTime()) {
          resolve(m_cachedToken.token);
          return;
        }
      }
      
      const OAUTH_POPUP_HEIGHT = 640; // px
      const OAUTH_POPUP_WIDTH = 480; // px
      const OAUTH_POLL_POPUP_HASH_INTERVAL = 250; // milliseconds
      const OAUTH_POLL_POPUP_CROSS_DOMAIN_INTERVAL = 500; // milliseconds

      /**
       * Checks if passed URL string is absolute.
       * @param {String} url - URL string to be checked.
       */
      var isAbsoluteURL = function(url) {
        return url.startsWith("http://") || url.startsWith("https://");
      }

      /**
       * Resolves relative URL string and returns absolute path.
       * @param {String} url - 
       */
      var resolveRelativeURL = function(url) {
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        var retUrl = a.href;
        a.parentElement.removeChild(a);
        return retUrl;
      }

      /**
       * Waits for oAuth service to redirect popup to redirectUri with access_token 
       * after # in URL
       * @param {Object} popupWindow - created popup window which requests access_token
      */
      var waitForPopupHash = function(popupWindow) {
        return new Promise(function(resolve, reject) {
          var waitValue = function(popupWindow) {
            try {
              if (!popupWindow.location.hash) {
                if (popupWindow.closed) {
                  reject("Failed to obtain parameters from popup window");
                  return;
                }
                // Wait the configured interval and try again.
                setTimeout(function() {
                  waitValue(popupWindow);
                }, OAUTH_POLL_POPUP_HASH_INTERVAL);
              } else {
                resolve(popupWindow.location.hash);
              }
            } catch (err) {
              // This is the case when popup window shows login form from oAuth server.
              // In this case exception will be thrown each time we access popup window
              // info window (due to cross domain access is not allowed). In this case
              // try again after configured interval.
              setTimeout(function() {
                waitValue(popupWindow);
              }, OAUTH_POLL_POPUP_CROSS_DOMAIN_INTERVAL);
            }
          };
          waitValue(popupWindow);
        });
      };

      /**
       * Function parses the oAuth server response in URL and returns access token from it
       * @param {Object} locationHash - the server response string after # in redirectUrl
       * @returns Access token in case of success, null in case of failure.
       */
      var getAccessTokenFromRequestUrl = function(locationHash) {
        try {
          var queryHashParamsString = locationHash.substring(1);
          if (queryHashParamsString === "" ) {
            return null;
          }

          var params = {};
          var regex = /([^&=]+)=([^&]*)/g, m;

          while ((m = regex.exec(queryHashParamsString))) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
          }

          if (params.access_token && params.expires_in) {
            // Do not check for error here. If access_token is present in response,
            // then assume this is a valid access token.

            // Cache received access token
            var dateExpiresIn = new Date(new Date().getTime() + 
              params.expires_in * 1000);

            m_cachedToken = {
              expiresIn: dateExpiresIn,
              token: params.access_token
            }

            return params.access_token;
          } 
          else {
            if (params.error) {
              console.error("oAuth service returned error: " + params.error);
            }
            return null;
          }
        } catch (err) {
          console.log("Failed to get access token from oAuth service: " + err);
          return null;
        }
      };

      var redirectUrl = configuration.redirectUri;
      if (!isAbsoluteURL(redirectUrl))
      {
        redirectUrl = resolveRelativeURL(redirectUrl);
      }

      var form = document.createElement("form");
      form.id = "genericAuthHelperFormId";
      form.setAttribute("method", "get");
      form.setAttribute("action", configuration.authService);

      var params = {
        client_id: configuration.clientId,
        redirect_uri: redirectUrl,
        response_type: "token",
        scope: configuration.scope,
        include_granted_scopes: "true",
        state: "pass-through value"
      };

      for (var p in params) {
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", p);
        input.setAttribute("value", params[p]);
        form.appendChild(input);
      }

      document.body.appendChild(form);
      var serializedData = $("#genericAuthHelperFormId").serialize();

      form.parentElement.removeChild(form);

      // Handle oAuthResponse in new popup window so our main page will not be reloaded
      var oAuthResponseHandlerWindow = window.open(
        configuration.authService + "?" + serializedData,
        "oAuthResponseHandler",
        "height=" + OAUTH_POPUP_HEIGHT + ",width=" + OAUTH_POPUP_WIDTH
      );

      if (oAuthResponseHandlerWindow === null || typeof oAuthResponseHandlerWindow === "undefined") {
        reject( "Please check your browser allows popup windows on this domain and try again." );
        return;
      }

      waitForPopupHash(oAuthResponseHandlerWindow)
        .then(function(popupHash) {
          if (oAuthResponseHandlerWindow !== null && typeof oAuthResponseHandlerWindow !== "undefined") {
            oAuthResponseHandlerWindow.close();
          }
          var access_token = getAccessTokenFromRequestUrl(popupHash);
          if (!access_token) {
            reject("Failed to get access token.");
            return;
          }
          resolve(access_token);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });
  };

  /**
  * Requests the user information from the specified userInfoService associated
  * with the given access_token.
  * 
  * @param {Object} access_token
  * The access token issued by an oAuth service provider.
  * 
  * @param {Object} userInfoService
  * The fully qualified URL of the user info service associated with the oAuth 
  * service that issued the given access_token.
  * 
  * @returns {Promise<Object>}
  * The promise of a user info object, which is opaque data and is returned without 
  * modification. Please refer to the documentation for the user info service that 
  * is being used for details on the structure of the returned user info object.
  * 
  * The promise will be rejected on any failure to retrieve the user info object 
  * from the userInfoService.
  */
  this.getOAuthUserInfo = function(access_token, userInfoService) {
    return new Promise(function(resolve, reject) {
      var url = userInfoService + "?access_token=" + access_token;
      $.get(url, function(data) {
        if (typeof data === "object") {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  };

  /**
  * Requests the user information from the specified tokenInfoService associated
  * with the given access_token.
  * 
  * @param {Object} access_token
  * The access token issued by an oAuth service provider.
  * 
  * @param {Object} tokenInfoService
  * The fully qualified URL of the token info service associated with the oAuth 
  * service that issued the given access_token.
  * 
  * @returns {Promise<Object>}
  * The promise of a token info object, which is opaque data and is returned without 
  * modification. Please refer to the documentation for the token info service that 
  * is being used for details on the structure of the returned token info object.
  *
  * The promise will be rejected on any failure to retrieve the token info object 
  * from the tokenInfoService.
  */
  this.getOAuthTokenInfo = function(access_token, tokenInfoService) {
    return new Promise(function(resolve, reject) {
      var url = tokenInfoService + "?access_token=" + access_token;
      $.get(url, function(data) {
        if (typeof data === "object") {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  };
}