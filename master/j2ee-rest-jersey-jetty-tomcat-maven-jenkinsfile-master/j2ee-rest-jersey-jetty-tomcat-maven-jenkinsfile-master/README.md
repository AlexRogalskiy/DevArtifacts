# j2ee-rest-jersey-jetty-tomcat-maven-jenkinsfile
Proving ground for J2EE 7 RESTful web services. Jersey will provide grunt for REST. Jetty local development but Tomcat for Integration testing. Maven build framework with Jenkins organising. If that is not enough then SonarQube and Jacoco for code coverage.

* If you just want to play with and extend the JAX-RS REST hello world example then install [Developer Tools](#developer-tools), download sources and go have fun
* If you want to have fun with [Jenkins 2.x Pipeline](https://jenkins.io/doc/pipeline) then install [Deployment Pipeline](#deployment-pipeline) tools. 
* If you want to have fun with **Jenkins 2.x Pipeline** [Jenkinsfile](https://jenkins.io/doc/pipeline/jenkinsfile) or [Zero-downtime Deployment (and Rollback) in Tomcat](http://java-monitor.com/forum/showthread.php?t=1288) then you need:
  * to fork this repository to edit your [Jenkinsfile](Jenkinsfile)
  * the Developer tools
  * the Deployment tools

* This plaground was setup in **July 2016**
* Please do send me fixes for my stupid errors. 
* I did not automate the install of [Deployment Pipeline](#deployment-pipeline) tools. Vagrant and Puppet poc work has been covered in my other projects.
  * https://github.com/lastnitescurry/dctm-vagrant-puppet
  * https://github.com/lastnitescurry/documentum71 

# Development 
Once you have the sources downloaded and [developer tools](#developer-tools) setup execute the follow to compile and run on Jetty for local development

	mvn clean compile jetty:run

NOTE: For hot reload to work, _Eclipse->Project->Build Automatically_ should be enabled

The helloworld REST service will be availabe on:

-   <http://localhost:9998/app/hello>

and the default _index.jsp_ will respond on:

-   <http://localhost:9998>

To do a SonarQube analysis use: 

	mvn clean test sonar:sonar

And to build a distribution package: 

	mvn clean package

## Developer Tools

-   [JDK 8u91](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
-   [Github Desktop](https://desktop.github.com/)
-   [Java Platform, Enterprise Edition (Java EE) 7 - RESTful Web Services with JAX-RS](https://docs.oracle.com/javaee/7/tutorial/jaxrs.htm#GIEPU)
-   [Jersey, 2.23.1](https://jersey.java.net/download.html)
-   [Apache Maven, 3.3.9](https://maven.apache.org/download.cgi)
-   [Eclipse - Java EE Developers, Neon](https://www.eclipse.org/downloads/eclipse-packages/)

# Deployment Pipeline

The following tools are used in my hello world deployment pipeline:

-   [JDK 8u91](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
-   [Git Client](https://git-scm.com/downloads)
-   [Apache Maven, 3.3.9](https://maven.apache.org/download.cgi)
-   [Apache Tomcat, 8.5.4](http://tomcat.apache.org/download-80.cgi)
-   [Jenkins, 2.15](https://jenkins.io/)
-   [Nexus, 3.01](http://www.sonatype.com/download-oss-sonatype)
-   [SonarQube, 5.6.1](http://www.sonarqube.org/downloads/)

I use the following [custom launcher scripts](src/site/resources) for the tools: 

-   F:\Apps\Nexus\NexusRunner.cmd
-   F:\Apps\SonarQube\sonarqube-5.6.1\bin\windows-x86-64\StartSonar.bat
-   F:\Apps\Tomcat\TomcatRunner.cmd
-   F:\Apps\Jenkins\JenkinsRunner.cmd

Applications use their default ports hence are available on:

-   [Tomcat](http://localhost:8080)
-   [Jenkins](http://localhost:9090)
-   [Nexus](http://localhost:8081)
-   [SonarQube](http://localhost:9000)

Applications are used **as is** except for Jenkins which needs to be informed of where [tools are located](http://localhost:9090/configureTools):

* JDK
* Maven
  * Use **M3** as maven client name 
* Git Client

You need to configure at least one job in jenkins! I have two. One for [inline pipeline script](src/site/resources/JenkinsHome/jobs/HelloWorldPipeline/config.xml) and one [reading pipeline script from source code control](src/site/resources/JenkinsHome/jobs/HelloWorldJenkinsfile/config.xml)

Once everything is configured, build and deploy war files to tomcat via your jenkins job(s). The app will be available on:  

-   <http://localhost:8080/RESTful/app/hello>
-   [Default index page](http://localhost:8080/RESTful/)

And Jenkins jobs on:

-   <http://localhost:9090/job/HelloWorldJenkinsfile/workflow-stage>
-   <http://localhost:9090/job/HelloWorldPipeline/workflow-stage>

Jenkins Pipeline Syntax Snippet Generator
-   <http://localhost:9090/pipeline-syntax>

# Bibliography
### REST 

-   <http://martinfowler.com/articles/richardsonMaturityModel.html>
-   <https://spring.io/understanding/HATEOAS>
-   <http://restcookbook.com/Miscellaneous/rest-and-http>
-   <http://restcookbook.com/Mediatypes/json>

### REST Jersey

-   <https://www.ibm.com/developerworks/library/wa-aj-tomcat>
-   <http://www.vogella.com/tutorials/REST/article.html>
-   <https://jersey.java.net/documentation/latest/modules-and-dependencies.html>
-   <https://jersey.java.net/documentation/latest/deployment.html#deployment.servlet>

### REST Jersey Examples

-   <https://github.com/jersey/jersey/tree/master/examples/servlet3-webapp>
-   <https://github.com/jersey/jersey/blob/master/examples/java8-webapp>

### REST file upload

-   <https://philsturgeon.uk/api/2016/01/04/http-rest-api-file-uploads>
-   <https://javatutorial.net/java-file-upload-rest-service>
-   <https://jersey.java.net/documentation/latest/user-guide.html#multipart>
-   <http://howtodoinjava.com/jersey/jersey-file-upload-example>
-   <http://www.mkyong.com/webservices/jax-rs/file-upload-example-in-jersey>

### REST Testing
#### UNIT

-   <https://jersey.java.net/documentation/latest/test-framework.html>
-   <http://memorynotfound.com/test-jersey-rest-service-with-junit>
-   <http://www.logicbig.com/tutorials/java-ee-tutorial/jax-rs>
-	<http://www.logicbig.com/tutorials/java-ee-tutorial/jax-rs/jax-rs-unit-testing>

#### Intergration

-   <https://jersey.java.net/apidocs/2.23.1/jersey/org/glassfish/jersey/test/external/ExternalTestContainerFactory.html>
-	<http://www.sonarqube.org/measure-coverage-by-integration-tests-with-sonar-updated>
-   <http://www.eclemma.org/jacoco/trunk/doc/agent.html>

### Tomcat 

-	<https://www.javacodegeeks.com/2011/06/zero-downtime-deployment-and-rollback.html>
-   <http://maven.apache.org/guides/introduction/introduction-to-the-pom.html#Available_Variables>

### Jenkins

-   <https://wiki.jenkins-ci.org/display/JENKINS/Starting+and+Accessing+Jenkins>
-   <https://jenkins.io/doc/pipeline>
-   <https://jenkins.io/doc/pipeline/jenkinsfile>
-   <https://jenkins.io/doc/pipeline/steps>

### SonarQube

-   <http://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner+for+Maven>
-   <http://docs.sonarqube.org/display/PLUG/Code+Coverage+by+Integration+Tests+for+Java+Project>
-   <http://www.eclemma.org/jacoco/trunk/doc/prepare-agent-integration-mojo.html>
-   <https://aroundthecode.org/2014/07/07/unit-and-integration-tests-coverage-with-sonarqube-and-jacoco>

### Markdown

* https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf
