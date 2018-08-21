# Jenkins REST API's
Sample AngularJS application showing how to use Jenkins REST API's for custom integrations in your environments.

A followup to [this blog post](http://udaypal.com/workflow-integration-using-rest-api/)

## Build & development

1. `npm install`
2. `bower install`
3. Run `grunt` for building and `grunt serve` for preview.

## Setup
1. Jenkins running on port 8081 (localhost). URL is currently hardcoded to http://localhost:8081 but can be changed [here](https://github.com/uaarkoti/jenkins-rest-api-consumer/blob/master/app/scripts/services/jenkins-api.js)
2. If this webapp is not running on the same host as Jenkins, you'll need to install [CORS Plugin](https://github.com/uaarkoti/cors-plugin) with the host you are trying to connect in the [whitelist](https://github.com/uaarkoti/cors-plugin/blob/master/src/main/java/org/jvnet/hudson/plugins/cors/JenkinsCorsFilter.java). Then compile `mvn package` to generate the .hpi file that you can upload to Jenkins Plugins (Advanced tab)

## Testing

Running `grunt test` will run the unit tests with karma.
