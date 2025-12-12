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
            sudo rm -rf /var/www/rentapp/*
            sudo cp -R front/dist/* /var/www/rentapp/
            sudo chown -R www-data:www-data /var/www/rentapp
        '''
    }
}


    }
}
