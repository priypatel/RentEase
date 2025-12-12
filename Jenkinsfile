pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'front-end', url: 'git@github.com:priypatel/RentEase.git'
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
                    sh 'npm run build'
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
