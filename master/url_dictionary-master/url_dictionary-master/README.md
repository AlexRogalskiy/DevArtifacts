# UrlDictionary

A library to resolve url segments for sites

### How to use

Get a Dictionary instance for the site you want to use

    dk_dict = UrlDictionary.load('dk')

Read some keys

    dk_dict.translate 'province'
    => "landsdele"

    dk_dict.translate 'location.office'
    => "kontorlokaler"

the translate method is also aliased as t.

    dk_dict.t 'location.store'
    => "butikslokaler"

### Performance

UrlDictionary loads the latest dictionary data from GitHub upon first load request and caches the data in a class variable for subsequent requests. In case the request fails, UrlDictionary will use the local data source in lib/url_dictionary/data.yml

UrlDictionary can be configured to always use the local data (useful for speeding up specs). Just call the following configuration method before calling UrlDictionary.load

    UrlDictionary::Config.use_local_dictionary!

If you change your mind in the process (pun intended) and want to go back to the default, call this method:

    UrlDictionary::Config.use_remote_dictionary!

## Note about lifespan

This library will no longer be necessary if and when the sales site is merged into the main app, as we will then be able to keep this list of translations local to that app.
