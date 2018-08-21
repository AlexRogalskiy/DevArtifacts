aptly-plugin
===============

Jenkins plugin for aptly debian repository manager

# Setting up development environment

## Install aptly

(from http://www.aptly.info/download/)
```shell
echo "deb http://repo.aptly.info/ squeeze main" >> /etc/apt/sources.list
apt-key adv --keyserver keys.gnupg.net --recv-keys E083A3782A194991
apt-get update
apt-get install aptly
```

Running it:
```shell
aptly api serve -listen=:1080
```


Setting up the testproject:
```shell
aptly repo create -distribution="jessie" -component="coolproject-testing" coolproject-testing-jessie
aptly repo add coolproject-testing-jessie smartframeserver-snmpd_0.2.1_amd64.deb
aptly publish repo coolproject-testing-jessie
```


```shell
aptly repo create -distribution="jessie" -component="coolproject-testing" coolproject-testing-jessie
aptly publish repo -architectures="amd64,i386" coolproject-testing-jessie
```

```shell
aptly repo add coolproject-testing-jessie mypack_0.2.1_amd64.deb
aptly publish update jessie
```



## Jenkins plugin setup
mvn -U org.jenkins-ci.tools:maven-hpi-plugin:create

mvnDebug hpi:run

## Notes
### Bookmarks
REST client lib: http://unirest.io/java.html

Aptly multiple distributions
https://groups.google.com/forum/#!topic/aptly-discuss/QhgkRlR577w

https://morph027.gitlab.io/post/protect-aptly-api-with-basic-authentication/
https://pypkg.com/pypi/pyptly/f/pyptly/api.py

## Usecases
* One package into one repository
* Multiple packages into one repository
* Packages from dir into one repository

* Packages into multiple repositories


## Terminology

aptly site: a remote or the local host where Aptly is running and serving the
REST API, and one and more repositories

repository: a repository on an Aptly site. One Aptly site can have multiple
repositories

package: a .deb file, which has to be uploaded and added to a repository
registeren on an aptly site
