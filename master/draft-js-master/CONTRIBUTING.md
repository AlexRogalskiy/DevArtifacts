# Contributing to Draft.js
We want to make contributing to this project as easy and transparent as
possible.

## Code of Conduct 
Facebook has adopted a Code of Conduct that we expect project
participants to adhere to. Please [read the full text](https://code.facebook.com/codeofconduct)
so that you can understand what actions will and will not be tolerated.

## Our Development Process
We use GitHub to sync code to and from our internal repository. We'll use GitHub
to track issues and feature requests, as well as accept pull requests.

## Pull Requests
We actively welcome your pull requests.

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. If you haven't already, complete the Contributor License Agreement ("CLA").

## Contributor License Agreement ("CLA")
In order to accept your pull request, we need you to submit a CLA. You only need
to do this once to work on any of Facebook's open source projects.

Complete your CLA here: <https://code.facebook.com/cla>

## Issues
We use GitHub issues to track public bugs. Please ensure your description is
clear and has sufficient instructions to be able to reproduce the issue. 
If possible please provide a minimal demo of the problem. You can use this 
jsfiddle to get started: https://jsfiddle.net/stopachka/m6z0xn4r/.

Facebook has a [bounty program](https://www.facebook.com/whitehat/) for the safe
disclosure of security bugs. In those cases, please go through the process
outlined on that page and do not file a public issue.

## Coding Style  
* 2 spaces for indentation rather than tabs
* 80 character line length
* Run `npm run lint` to conform to our lint rules

## Stability
Our philosophy regarding API changes is as follows:
 * We will avoid changing APIs and core behaviors in general
 * In order to avoid stagnation we will allow for API changes in cases where
 there is no other way to achieve a high priority bug fix or improvement.
 * When there is an API change:
    * Changes will have a clearly documented reason and migration path
    * When deprecating a pattern, these steps will be followed:
        * We will test the change internally first at FB
        * A version will be released that supports both, with deprecation warnings
        * The following version will fully remove the deprecated pattern

## License
By contributing to Draft.js, you agree that your contributions will be licensed
under its BSD license.
