# wx-mail

Wondering what to do with my new Raspberry Pi last winter, I decided to use it to email myself the weather forecast every morning and evening. Because: Lazy. Also, because I wanted to learn more about using Python to send emails.

## Usage

* Sign up for a free API key from [Weather Underground](http://www.wunderground.com/weather/api/). You won't be hitting the API much, so the free plan will work just fine.
* Find the city you want for your forecast and edit this line in wx-mail.py:

`mail_url = 'http://api.wunderground.com/api/' + api_key + '/' + request_type +'/forecast/q/VA/Leesburg.json'`

* Add the key and your email information to `settings.py`. In there, you can also specify a list of the email addresses to send your forecast to.
* You'll probably want to edit the email HTML also to suit your needs.
* Set this to run on a cron job and enjoy having the forecast sent your way.
