pipeline {
    agent any

    options {
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {
        stage('Test') {
            steps {
                echo "Jenkins pipeline is working"
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('front') {
                    sh 'npm ci || npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('front') {
                    sh 'npm run build --max-old-space-size=256'
                }
            }
        }
    }
}
