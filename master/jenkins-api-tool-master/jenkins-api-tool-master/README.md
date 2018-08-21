You can create a new job in Jenkins by updating the relative template, and then running the below command
```
curl -k -X POST --header "Content-Type: application/xml" -d @template-name.xml https://jenkins.mydomain.com.net/createItem/?name=NEWJOBNAME --user USER:PASSWORD;
```
This script was created to help migrate 4000 jobs from a cron service, to run as a scheduled build in jenkins. Its very flexible, provided you know how to create config templates from Jenkins.

This job will pass a parameter into a template file, and then create a job in jenkins from that template. If you need to create a similar job on your Jenkins instance, but for multiple websites, populate the params.txt list with a list of paramaters to pass into your builds.

Be sure to update the script with your Jenkins Credentials:
```
USER="yourusername"
PASSWORD="yourpass"
```
Right now the params.txt file is used to pass a project path, and a naming convention to the scripts eg:
```
/path/to/project1/ app-1
/path/to/project2/ app-2

```

Then run `bash multiple-jobs.sh` to fire it off.

You can also run the script once off. Make sure your template.xml is configured correctly, then run:

`bash jenkins-job.sh /path/to/proj app-name`.