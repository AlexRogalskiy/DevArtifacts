Thorax & Parse Todo Seed
------------------------

*Example of persistent ToDos with Facebook authentication using Thorax and
Parse*



### Configuration



-   Create a [Facebook Application][1]

[1]: <http://developer.facebook.com>

-   Register & Create a new app at [Parse.com][2]

[2]: <http://www.parse.com>

-   Edit your /js/routers/todo-list.js and replace the placeholders with your
    Parse initialize script & Facebook App ID

        Parse.initialize("REPLACE ME", "REPLACE ME");

        window.fbAsyncInit = function() {

            Parse.FacebookUtils.init({

                appId      : 'REPLACE ME',

                cookie      : true,

                xfbml      : true

                });

            };

-   Run npm start

-   ?

-   PROFIT


Check out a demo [here][3]

[3]: <http://kenwheeler.github.io>

