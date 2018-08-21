pipeline{
  agent none
  stages{
    stage('Clean') {
            agent any
            steps {
                deleteDir()
            }
        }
    stage('Build') {
            agent { dockerfile { dir 'ci' } }
            steps {
                sh 'docker build .'
            }
        }
      }
    }