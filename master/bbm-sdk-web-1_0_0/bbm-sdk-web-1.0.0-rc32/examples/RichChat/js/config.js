//****************************************************************************
// Copyright 2017 BlackBerry.  All Rights Reserved.
//
// You must obtain a license from and pay any applicable license fees to
// BlackBerry before you may reproduce, modify or distribute this software, or
// any work that includes all or part of this software.
//

"use strict";

// This domain is a string known to the BBM Enterprise server, which is generally a GUID.
var ID_PROVIDER_DOMAIN = "your_idp_domain";

// This configuration contains service endpoints and information for OAuth2 authentification.
var OAUTH_CONFIGURATION = {
  
  // OAuth 2.0 endpoint for requesting an access token
  // To use googple OAuth service, put : "https://accounts.google.com/o/oauth2/v2/auth"
  authService : "your_auth_service_endpoint",
  
  // OAuth 2.0 endpoint for token validation
  // To use google toke info service, put : "https://www.googleapis.com/oauth2/v3/tokeninfo"
  tokenInfoService : "your_oauth_token_info_endpoint",
  
  // OAuth 2.0 endpoint for obtaining user information (name, email, avatar URL)
  // To use goolge user info service, put: "https://www.googleapis.com/plus/v1/people/me"
  userInfoService : "your_oauth_user_info_endpoint",
  
  // Scopes of OAuth 2.0 access token (which resousces it can access)
  // If google OAtuh service is used, put following scopes:
  // "profile https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/userinfo.email"
  scope : "your_scope_oauth",
  
  // The client ID of application registered on OAuth 2.0 server
  clientId: "your_client_id",
  
  // Redirect URL same as registered on OAuth 2.0 server. Required by OAuth 2.0 server to redirect 
  // application after issuing an access token.
  redirectUri : "your_redirect_url"
}