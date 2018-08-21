pipeline {

	agent any
    
    options {
    	    buildDiscarder(logRotator(numToKeepStr:'10'))   	    // Keep only the 10 most recent builds 
  	}
  	
  	environment {
  		SONAR = credentials('sonar')						    // Sonar Credentials
  		SONAR_SERVER = "http://sonar.beedemo.net:9000"		// Sonar Server Address
  		DOCKERHUB = credentials('dockerhub')				    // Docker Hub Credentials
		DOCKERHUB_REPO = "craigcloudbees"					// Repo on Docker Hub to push our image to
		APP_VERSION = "0.0.1"								// Version of the app, used to tag the Docker image
		DOCKER_IMG_NAME = "sample-rest-server"				// Name of our Docker image
		CONTAINER_ADDRESS = "localhost"						// Address at which running container can be reached
															// for http based testing ex: http://localhost:4567/hello
  	}

	stages {
	
		// Extract the application version number from the pom.xml file
		stage('Parse POM') {
			steps {
				script {
					pom = readMavenPom file: 'pom.xml'
					APP_VERSION = pom.version
				}
			}
		}

		stage('Build') {
			steps {
				sh 'mvn clean package'
				junit allowEmptyResults: true, testResults: '**/target/surefire-reports/TEST-*.xml'
			}
		}	
		
		stage('Create Docker Image') {
			steps {
				// First make sure that a version of this image isn't already running
				sh 'docker stop $(docker ps -q --filter ancestor="${DOCKERHUB_REPO}/${DOCKER_IMG_NAME}:${APP_VERSION}") || true'
				
				// Then delete any images that already exist for this version of the API
				sh 'docker images | grep "${DOCKERHUB_REPO}/${DOCKER_IMG_NAME}" | xargs docker rmi -f || true'
				
				// Now build a new docker image for this version of the API
				sh "docker build -t ${DOCKERHUB_REPO}/${DOCKER_IMG_NAME}:${APP_VERSION} ./"
			}
		}
		
		stage('Run Docker Image') {
			steps {
				// Start the new image we just created
				sh 'docker run -d -p 4567:4567 ${DOCKERHUB_REPO}/${DOCKER_IMG_NAME}:${APP_VERSION}'
			}
		}
		
		stage('Test Docker Image') {
			steps {
				retry (10) {
					// Use httpRequest to check default API endpoint, will throw an error if the endpoint
					// isn't accessible at the address specified, retry utilized here to give the container
					// time to start
					script {
						env.RESULT = httpRequest "http://${CONTAINER_ADDRESS}:4567/hello"
							
						// Write the test results to a file we can archive
						writeFile file: "target/restApiTests.txt", text: "${RESULT}"
					}
				}
			}
		}

		// Checkpoints are currently only supported on CloudBees Jenkins Enterprise
      	// using the following Enterprise plugin:
      	// https://go.cloudbees.com/docs/cloudbees-documentation/cje-user-guide/index.html#workflow-sect-checkpoint
      	stage("Checkpoint") {
     		agent none
      		steps {
        		  checkpoint 'Completed Docker Image Testing'
    		    }
        	}

		// Pushes the Docker image to Docker Hub - Master only
		stage('Push Docker Image') { 
			when {
				branch 'master'
			}
			steps {
				sh """
					docker login -u $DOCKERHUB_USR -p $DOCKERHUB_PSW
					docker push ${DOCKERHUB_REPO}/${DOCKER_IMG_NAME}:${APP_VERSION}
				"""
			}
		}
		
		stage('Quality Analysis') {
			when {
				branch 'master'
			}
			steps {
				parallel (
					"Integration Test" : {
						echo 'Run integration tests here...'
					},
					"Sonar Scan" : {
						//sh "mvn sonar:sonar -Dsonar.host.url=$SONAR_SERVER -Dsonar.organization=$SONAR_USR -Dsonar.login=$SONAR_PSW"
						echo 'Skipping sonar run...'
					}, failFast: true
				)	
			}
		}
		
		stage('Create Site') {
			when {
				branch 'master'
			}
			steps {
				sh 'mvn site:site'
			}
		}		
		
		stage('Archive Artifacts') {
			when {
				branch 'master'
			}
			steps {
				// Archive the jar files created
				archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
				
				// Zip up the site directory and archive it
				sh 'zip -r target/site.zip target/site'
				archiveArtifacts artifacts: '**/target/*.zip', fingerprint: true
				
				// Archive API test results
				archiveArtifacts artifacts: '**/target/*.txt', fingerprint: true
			}
		}		
		
		stage('Debug Output') {
			when {
				branch 'development'
			}
			steps {
				sh 'pwd'
				sh 'ls -l'
				sh 'ls -l target'
			}
		}		
		
    }
    
    post {
    	// Clean up our environment
    	  always {
    		// Stop the docker container if started
    		sh 'docker stop $(docker ps -q --filter ancestor="${DOCKERHUB_REPO}/${DOCKER_IMG_NAME}:${APP_VERSION}") || true'
    		
    		// Delete the docker image created
    		sh 'docker images | grep "${DOCKERHUB_REPO}/${DOCKER_IMG_NAME}" | xargs docker rmi -f || true'
    	  }
    }

}