pipeline {
    agent any

    stages {
        stage('Clean WorkSpace') {
            steps {
                cleanWs()
            }
        }

        stage('Prepare Environment') {
            steps {
                git branch: '$BRANCH_NAME', url: 'git@gitlab.example.com:group-name/project-name-parent.git'
            }
        }

        stage('Maven pipeline') {
            steps {
                build job: 'maven-pipeline', parameters: [[$class: 'StringParameterValue', name: 'PROJECT_WORKSPACE', value: "${env.WORKSPACE}"]]
            }
        }

        stage('SonarQube analysis') {
            steps {
                script {
                    scannerHome = tool 'SONARQUBE-SCANNER'
                }
                withSonarQubeEnv('SONAR') {
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }

        stage('Post-build Pre-Production Action') {
            when {
                branch 'develop'
            }

            steps {
                build job: 'job-name-compile/develop',
                        propagate: true,
                        wait: false
            }
        }

        stage('Post-build Production Action') {
            when {
                branch 'master'
            }

            steps {
                build job: 'job-name-compile/master',
                        propagate: true,
                        wait: false
            }
        }
    }
}