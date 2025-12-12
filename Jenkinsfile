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
        stage('Deploy Frontend') {
            steps {
                sh '''
                    rm -rf /var/www/rentapp/*
                    cp -R front/dist/* /var/www/rentapp/
                '''
            }
        }
    }
}
