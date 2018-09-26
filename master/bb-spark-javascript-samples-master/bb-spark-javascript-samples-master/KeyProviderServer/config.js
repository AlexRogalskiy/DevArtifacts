/*
 * Copyright (c) 2018 BlackBerry.  All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * Module contains server configuration parameters.
 */
module.exports = {
  // The application ID(s) for which the KeyProviderServer is providing key
  // storage services.  This configuration will be used to verify the 'aud'
  // claim for all security tokens being used to access this service.
  //
  // This configuration value will accept the following types:
  //   * string
  //   * regex
  //   * array of strings
  //   * array of regexes
  applicationIds: 'YOUR APPLICATION ID',

  // The tenant GUID(s) whose users are allowed to interact with the
  // KeyProviderServer.
  //
  // This configuration value will also be used to setup issuer string(s) used
  // to validate the 'iss' claim for all security tokens being used to access
  // this service.
  //
  // This configuration value will accept the following types:
  //   * string
  //   * array of strings
  tenantIds: 'YOUR TENANT ID',

  // The connection string to connect to CosmosDB database. Obtain this
  // string from Azure Portal, in CosmosDB database settings.
  connectionString: 'YOUR DB CONNECTION STRING',

  // Name of the collection (table) where keys are stored. For example type
  // 'KeyStore' if your table name is 'KeyStore'.
  collectionName: 'YOUR TABLE NAME IN DATABASE',

  // Entities partition in the collection. All entities reside in the same
  // partition. For example: 'KeysPartition'.
  collectionPartition: 'YOUR PARTITION NAME',

  // Regular expression that defines the format of user ID, issued by your
  // identity provider.
  userIdRegex: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,

  // CORS settings
  accessControlAllowOrigin: '*',
  accessControlAllowHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  accessControlAllowedMethods: 'GET, PUT',

  // Server private key location (full path).
  keyPath: __dirname + '/cert/privateKey.pem',

  // Server public certificate location (full path).
  certPath: __dirname + '/cert/publicCert.pem',

  // Server key passphrase
  keyPassphrase: 'PASSPHRASE FOR PRIVATE KEY',

  // Indicate if the server should be HTTP or HTTPS.  Using HTTP is NOT
  // recommended outside of a test environment because bearer access tokens
  // will be transmitted in plain text.
  useSsl: true,

  // Server port.
  serverPort: 3000
};
