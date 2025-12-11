pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                echo "Jenkins pipeline is working"
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('front') {
                    sh 'npm install'
                }
            }
        }
    }
}
