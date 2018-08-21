# Restricted registration plugin for Jenkins CI

Idea behind this plugin is to provide an additional control over account creation.

It does that by adding [UnprotectedRootAction](http://javadoc.jenkins-ci.org/hudson/model/UnprotectedRootAction.html)
under `/restrictedRegister/` URL.

## Configuration and usage

Plugin configuration can be found in Global security settings within section labeled `Restricted Registration`.

By default plugin is disabled.

Each supported Security Realm has its own configuration section.

### Verification methods / Rules

Access to various registration steps is restricted by testing form input data against rules
defined in configuration page.

If no rules are defined, then registration flow is treated as being open to everyone.

If multiple rules are defined, then form data must pass all checks defined within one of them.

For example, if you define separate rules, one with secret key check for value `foo` and second one
with check for value `bar`, then both secret keys will work.

#### Secret key authentication

If added, then users won't be able to register new account unless a GET parameter
named `rr_secret` with matching value is passed as part of URL.

Example:

Let's say root URL of your Jenkins instance is `http://example.com/jenkins/`
and you defined rules with Secret key authentication check for value `qwerty`.

In such case, registration form can be accessed via url `http://example.com/jenkins/restrictedRegister/?rr_secret=qwerty`.

### Security realms

Each supported security realm has its own registration flow / page.

Right now, only HudsonPrivateSecurityRealm is supported.

#### HudsonPrivateSecurityRealm

It is displayed as `Jenkins’ own user database` in Global security configuration page.

2-step registration flow is implemented for this Security Realm:

1. User creation
2. User activation

In first step, user account is created / updated using information provided in registration form:

- username
- e-mail address
- display name (full name)

Once submitted, message is sent to e-mail address above which contains activation link.

Activation link will redirect user back to registration page,
but this time different form is displayed, asking user to provide new password.

After submitting this form, user receives e-mail with welcome message and should be able to sign in.

##### E-mail templates

If you're not happy with templates used for confirmation or welcome e-mails,
then you can provide your own templates in configuration details for this security realm.

Following variables can be used inside e-mail message content:

- RR_SIGN_IN_LINK - Link to Jenkins' sign in page
- RR_CONFIRMATION_LINK - Link which redirects user to account activation page
- RR_USER_DISPLAY_NAME, RR_USER_EMAIL, RR_USER_ID - those 3 fields are provided by user in registration form.

###### Confirmation E-mail

This e-mail is sent to user after first step is completed. It should contain RR_CONFIRMATION_LINK.

Default subject:

```
[Jenkins] New account
```
Default content:

```
<h4>Hello ${RR_USER_DISPLAY_NAME},</h4>
<p>Your account has been added, but it must be activated first before you can sign in.</p>
<p>You can do that by clicking the link below and following instructions displayed on account activation page.</p>
<p><a href="${RR_CONFIRMATION_LINK}">${RR_CONFIRMATION_LINK}</a></p>
```

###### Welcome E-mail

This e-mail is sent to user after second step is completed (account becomes active).

Default subject:

```
[Jenkins] Account activated
```
Default content:

```
<h4>Hello ${RR_USER_DISPLAY_NAME},</h4>
<p>Your account with id <i>${RR_USER_ID}</i> is now active.</p>
<p>You can sign in at <a href="${RR_SIGN_IN_LINK}">${RR_SIGN_IN_LINK}</a></p>
```

## Development

WIP @AdamKobus

Source code structure might still change in nearest future, so please keep this in mind when developing features.

### Planned work

Multiple features are planned to be added in nearest future:

- verification method, which will validate configured field value against regexp patterns (whitelist)
- Same as above, but with blacklist
- CAPTCHA in HudsonPrivateSecurityRealm registration implementation
- Test button to verify e-mail configuration
- configurable Terms & Condition

## Requirements

- [Jenkins](https://jenkins.io/) >= 1.610
- [jQuery Plugin](https://wiki.jenkins-ci.org/display/JENKINS/jQuery+Plugin) >= 1.0.2
- [Mailer Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Mailer) >= 1.17


## Changelog

### 0.1 (June 03 2016)

Initial release. Includes registration implementation for HudsonPrivateSecurityRealm

## License

Released under the MIT license. See the LICENSE file for more info.
