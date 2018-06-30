
=======
[![Coverage Status](https://coveralls.io/repos/4justinstewart/Polity/badge.png)](https://coveralls.io/r/4justinstewart/Polity)

[![Build Status](https://travis-ci.org/4justinstewart/Polity.svg?branch=master)](https://travis-ci.org/4justinstewart/Polity)

Polity
======

90% of political action that directly affects you happens at the local level within town our city counsel, however, a marginal amount of people have knowledge of politics at this level.  Polity is a web and mobile based app to bridge this gap and create a tighter sense of community.

## Git Commits

Let's shine by being thoughtful with our commits guys!! Start all commit messages with one of the following keywords to generally describe what's going on:

1.) `feature` -> describes anything adding value to the application.  Most things in development will be features...

2.) `chore` -> describes anything that is clean up within the application.  Change in the behavior of the opp should be minimal

3.) `bugfix` -> pretty self explanatory, but anytime you something in the app that isn't working

4.) `styling` -> anything adding presentation value to the project


A few quick examples:

`git commit -m "feature: added instance method to User model to find connections within his/her ward"`

`git commit -m "chore: refactored method in Legislation model to reduce database load time"`

`git commit -m "bugfix: changed view logic in users/show to display favored legistlation, not all legistlation"`

`git commit -m "styling: created grid.css for fixed design on all application pages.  Plans to migrate to responsive design as project progresses"`

## Git Workflow

```
1.) git clone <link to master>

2.) git checkout -b <branch name ie. dashboard, crud, try to avoid names>

Adding and commiting should happen often -> 15 - 30 minutes

3.) git add -A

4.) git commit -m "ie. crud complete"
```
Anytime anyone in the group merges one of their branches into the github master, you want to work with the most current mater. Doing this will mitigate merge conflicts. Follow Steps 5 - 8.
```
5.) git checkout master (See the current local master on your machine)

6.) git pull (Retrieves the current master on github and merges with the your local master)

7.) git checkout <branch name from above>

8.) git merge master (Your branch is now merged with the master)
```
Now when you are ready to push to the Github, run through Steps 3 - 8, then push your remote branch
```
9.) git push origin <branch name from above>
```
Now your code is on github

### Resources for Development

[Check Voter Registration](http://www.chicagoelections.com/voterinfo.php)

[City Council Reports](http://chicityclerk.com/council/reports.php)

[City Budget Documentation](http://chicityclerk.com/legislation-records/journals-reports/city-budgets/)

[Open City Apps](http://opencityapps.org/)

[Alderman Contact Info](https://data.cityofchicago.org/Facilities-Geographic-Boundaries/Ward-Offices/htai-wnw4)

[Find your Alderman](https://webapps1.cityofchicago.org/ezbuy/getgeoWardLookup.do)

