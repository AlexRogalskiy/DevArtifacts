FROM myvinod/ubuntu-java-installed:latest

MAINTAINER Vinod

RUN rm -r /var/cache/apt

#CMD echo "This is a test"
#RUN (cp /var/lib/jenkins/jobs/simplescience-docker/workspace/target/*.war /usr/share/tomcat/apache-tomcat-8.0.30/webapps)
#COPY  "//var/lib/jenkins/jobs/simplescience-docker/workspace/target/SimpleScience.war" "/usr/share/tomcat/apache-tomcat-8.0.30/webapps/SimpleScience.war"

RUN /usr/share/tomcat/apache-tomcat-8.0.30/bin/shutdown.sh

COPY  "target/SimpleScience.war" "/usr/share/tomcat/apache-tomcat-8.0.30/webapps/SimpleScience.war"


RUN /usr/share/tomcat/apache-tomcat-8.0.30/bin/startup.sh


RUN /usr/share/tomcat/apache-tomcat-8.0.30/bin/shutdown.sh

EXPOSE 8080

#Adding this to see if it sustains the container run
ENTRYPOINT /usr/share/tomcat/apache-tomcat-8.0.30/bin/catalina.sh run
