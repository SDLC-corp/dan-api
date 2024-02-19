pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
        disableRestartFromStage()
    }
    tools {
        nodejs "nodejs"
    }
    stages {
        stage('install') {
            when {
                anyOf{
                    expression{env.BRANCH_NAME == 'deploy'}
                    expression{env.BRANCH_NAME == 'deploy-prod'}
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('create-env-dev') {
            when {
                branch 'deploy'
            }
            environment {
                TWRPA_API_QA_PORT = credentials("TWRPA_API_QA_PORT")
                TWRPA_API_QA_MONGODB_URL = credentials("TWRPA_API_QA_MONGODB_URL")
                TWRPA_API_QA_DB_NAME = credentials("TWRPA_API_QA_DB_NAME")
                TWRPA_API_QA_JWT_SECRET = credentials("TWRPA_API_QA_JWT_SECRET")
                TWRPA_API_QA_JWT_ACCESS_EXPIRATION_MINUTES = credentials("TWRPA_API_QA_JWT_ACCESS_EXPIRATION_MINUTES")
                TWRPA_API_QA_JWT_REFRESH_EXPIRATION_DAYS = credentials("TWRPA_API_QA_JWT_REFRESH_EXPIRATION_DAYS")
                TWRPA_API_QA_JWT_RESET_PASSWORD_EXPIRATION_MINUTES = credentials("TWRPA_API_QA_JWT_RESET_PASSWORD_EXPIRATION_MINUTES")
                TWRPA_API_QA_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = credentials("TWRPA_API_QA_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES")
                TWRPA_API_QA_NODE_ENV = credentials("TWRPA_API_QA_NODE_ENV")
                TWRPA_API_QA_S3ACCESSKEYID = credentials("TWRPA_API_QA_S3ACCESSKEYID")
                TWRPA_API_QA_S3ACCESSSECRET = credentials("TWRPA_API_QA_S3ACCESSSECRET")
                TWRPA_API_QA_S3REGION = credentials("TWRPA_API_QA_S3REGION")
                TWRPA_API_QA_S3BUCKET = credentials("TWRPA_API_QA_S3BUCKET")
                TWRPA_API_QA_REGISTERED_USER_KEY = credentials("TWRPA_API_QA_REGISTERED_USER_KEY")
                TWRPA_API_QA_WALLET_VERIFY_EXPIRATION_TIME = credentials("TWRPA_API_QA_WALLET_VERIFY_EXPIRATION_TIME")
                TWRPA_API_QA_OTM_API_USERNAME = credentials("TWRPA_API_QA_OTM_API_USERNAME")
                TWRPA_API_QA_OTM_API_PASSWORD = credentials("TWRPA_API_QA_OTM_API_PASSWORD")
                TWRPA_API_QA_OTM_SANITY_API_USERNAME = credentials("TWRPA_API_QA_OTM_SANITY_API_USERNAME")
                TWRPA_API_QA_OTM_SANITY_API_PASSWORD = credentials("TWRPA_API_QA_OTM_SANITY_API_PASSWORD")
                TWRPA_API_QA_START_FIELDS_EXTRACTION_PROCESS = credentials("TWRPA_API_QA_START_FIELDS_EXTRACTION_PROCESS")
                TWRPA_API_QA_FORM_RECOGNIZER_ENDPOINT = credentials("TWRPA_API_QA_FORM_RECOGNIZER_ENDPOINT")
                TWRPA_API_QA_FORM_RECOGNIZER_API_KEY = credentials("TWRPA_API_QA_FORM_RECOGNIZER_API_KEY")
                TWRPA_API_QA_GOOGLE_GEOCODING_API_KEY = credentials("TWRPA_API_QA_GOOGLE_GEOCODING_API_KEY")
                TWRPA_API_QA_SKIP_DOCUMENT_DUPLICATE_CHECK = credentials("TWRPA_API_QA_SKIP_DOCUMENT_DUPLICATE_CHECK")
                TWRPA_API_QA_OTM_BASE_URL = credentials("TWRPA_API_QA_OTM_BASE_URL")
                TWRPA_API_QA_SENDGRID_API_KEY = credentials("TWRPA_API_QA_SENDGRID_API_KEY")
                TWRPA_API_QA_SENDGRID_FROM = credentials("TWRPA_API_QA_SENDGRID_FROM")
                TWRPA_API_QA_OTM_TW_CHARTER_VOYAGE_URL = credentials("TWRPA_API_QA_OTM_TW_CHARTER_VOYAGE_URL")

                TWRPA_API_QA_IP = credentials("TWRPA_API_QA_IP")
                BRANCH_NAME = '${env.BRANCH_NAME}'
            }
            steps {
                echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
                sh '''#!/bin/bash
                touch .env
                echo PORT=$TWRPA_API_QA_PORT >> .env
                echo "MONGODB_URL=$TWRPA_API_QA_MONGODB_URL" >> .env
                echo DB_NAME=$TWRPA_API_QA_DB_NAME >> .env
                echo JWT_SECRET=$TWRPA_API_QA_JWT_SECRET >> .env
                echo JWT_ACCESS_EXPIRATION_MINUTES=$TWRPA_API_QA_JWT_ACCESS_EXPIRATION_MINUTES >> .env
                echo JWT_REFRESH_EXPIRATION_DAYS=$TWRPA_API_QA_JWT_REFRESH_EXPIRATION_DAYS >> .env
                echo JWT_RESET_PASSWORD_EXPIRATION_MINUTES=$TWRPA_API_QA_JWT_RESET_PASSWORD_EXPIRATION_MINUTES >> .env
                echo JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=$TWRPA_API_QA_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES >> .env
                echo NODE_ENV=$TWRPA_API_QA_NODE_ENV >> .env
                echo S3ACCESSKEYID=$TWRPA_API_QA_S3ACCESSKEYID >> .env
                echo "S3ACCESSSECRET=$TWRPA_API_QA_S3ACCESSSECRET" >> .env
                echo S3REGION=$TWRPA_API_QA_S3REGION >> .env
                echo S3BUCKET=$TWRPA_API_QA_S3BUCKET >> .env
                echo REGISTERED_USER_KEY=$TWRPA_API_QA_REGISTERED_USER_KEY >> .env
                echo WALLET_VERIFY_EXPIRATION_TIME=$TWRPA_API_QA_WALLET_VERIFY_EXPIRATION_TIME >> .env
                echo OTM_API_USERNAME=$TWRPA_API_QA_OTM_API_USERNAME >> .env
                echo OTM_API_PASSWORD=$TWRPA_API_QA_OTM_API_PASSWORD >> .env
                echo OTM_SANITY_API_USERNAME=$TWRPA_API_QA_OTM_SANITY_API_USERNAME >> .env
                echo OTM_SANITY_API_PASSWORD=$TWRPA_API_QA_OTM_SANITY_API_PASSWORD >> .env
                echo START_FIELDS_EXTRACTION_PROCESS=$TWRPA_API_QA_START_FIELDS_EXTRACTION_PROCESS >> .env
                echo FORM_RECOGNIZER_ENDPOINT=$TWRPA_API_QA_FORM_RECOGNIZER_ENDPOINT >> .env
                echo FORM_RECOGNIZER_API_KEY=$TWRPA_API_QA_FORM_RECOGNIZER_API_KEY >> .env
                echo GOOGLE_GEOCODING_API_KEY=$TWRPA_API_QA_GOOGLE_GEOCODING_API_KEY >> .env
                echo SKIP_DOCUMENT_DUPLICATE_CHECK=$TWRPA_API_QA_SKIP_DOCUMENT_DUPLICATE_CHECK >> .env
                echo OTM_BASE_URL=$TWRPA_API_QA_OTM_BASE_URL >> .env
                echo SENDGRID_API_KEY=$TWRPA_API_QA_SENDGRID_API_KEY >> .env
                echo SENDGRID_FROM=$TWRPA_API_QA_SENDGRID_FROM >> .env
                echo OTM_TW_CHARTER_VOYAGE_URL=$TWRPA_API_QA_OTM_TW_CHARTER_VOYAGE_URL >> .env
                
                sed -i 's/environment/qa/g' ecosystem.config.js
                
                '''
            }
        }

        stage('deploy-dev') {
            when {
                branch 'deploy'
            }
            environment {
                TWRPA_API_QA_IP = credentials("TWRPA_API_QA_IP")
            }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: "jenkins-ssl", keyFileVariable: 'sshkey')
                ]) {
                    echo 'deploying the software'
                    sh '''#!/bin/bash
                    echo "Creating .ssh"
                    mkdir -p /var/lib/jenkins/.ssh
                    ssh-keyscan ${TWRPA_API_QA_IP} >> /var/lib/jenkins/.ssh/known_hosts
                    ssh -i $sshkey deployer@${TWRPA_API_QA_IP} "mkdir -p /home/deployer/repo/transworld-rpa-api/$BRANCH_NAME"
                    rsync -avz --info=progress0,name0,flist0,stats2 --stats --exclude  '.git' --delete -e "ssh -i $sshkey" ./ deployer@${TWRPA_API_QA_IP}:/home/deployer/repo/transworld-rpa-api/$BRANCH_NAME
                    ssh -i $sshkey deployer@${TWRPA_API_QA_IP} "cd /home/deployer/repo/transworld-rpa-api/$BRANCH_NAME && pm2 stop ecosystem.config.js && pm2 start ecosystem.config.js && pm2 save"
                    '''
                }
            }
        }

        stage('create-env-prod') {
            when {
                branch 'deploy-prod'
            }
            environment {
                
                TWRPA_API_PROD_PORT = credentials("TWRPA_API_PROD_PORT")
                TWRPA_API_PROD_MONGODB_URL = credentials("TWRPA_API_PROD_MONGODB_URL")
                TWRPA_API_PROD_DB_NAME = credentials("TWRPA_API_PROD_DB_NAME")
                TWRPA_API_PROD_JWT_SECRET = credentials("TWRPA_API_PROD_JWT_SECRET")
                TWRPA_API_PROD_JWT_ACCESS_EXPIRATION_MINUTES = credentials("TWRPA_API_PROD_JWT_ACCESS_EXPIRATION_MINUTES")
                TWRPA_API_PROD_JWT_REFRESH_EXPIRATION_DAYS = credentials("TWRPA_API_PROD_JWT_REFRESH_EXPIRATION_DAYS")
                TWRPA_API_PROD_JWT_RESET_PASSWORD_EXPIRATION_MINUTES = credentials("TWRPA_API_PROD_JWT_RESET_PASSWORD_EXPIRATION_MINUTES")
                TWRPA_API_PROD_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = credentials("TWRPA_API_PROD_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES")
                TWRPA_API_PROD_NODE_ENV = credentials("TWRPA_API_PROD_NODE_ENV")
                TWRPA_API_PROD_S3ACCESSKEYID = credentials("TWRPA_API_PROD_S3ACCESSKEYID")
                TWRPA_API_PROD_S3ACCESSSECRET = credentials("TWRPA_API_PROD_S3ACCESSSECRET")
                TWRPA_API_PROD_S3REGION = credentials("TWRPA_API_PROD_S3REGION")
                TWRPA_API_PROD_S3BUCKET = credentials("TWRPA_API_PROD_S3BUCKET")
                TWRPA_API_PROD_REGISTERED_USER_KEY = credentials("TWRPA_API_PROD_REGISTERED_USER_KEY")
                TWRPA_API_PROD_WALLET_VERIFY_EXPIRATION_TIME = credentials("TWRPA_API_PROD_WALLET_VERIFY_EXPIRATION_TIME")
                TWRPA_API_PROD_OTM_API_USERNAME = credentials("TWRPA_API_PROD_OTM_API_USERNAME")
                TWRPA_API_PROD_OTM_API_PASSWORD = credentials("TWRPA_API_PROD_OTM_API_PASSWORD")
                TWRPA_API_PROD_OTM_SANITY_API_USERNAME = credentials("TWRPA_API_PROD_OTM_SANITY_API_USERNAME")
                TWRPA_API_PROD_OTM_SANITY_API_PASSWORD = credentials("TWRPA_API_PROD_OTM_SANITY_API_PASSWORD")
                TWRPA_API_PROD_START_FIELDS_EXTRACTION_PROCESS = credentials("TWRPA_API_PROD_START_FIELDS_EXTRACTION_PROCESS")
                TWRPA_API_PROD_FORM_RECOGNIZER_ENDPOINT = credentials("TWRPA_API_PROD_FORM_RECOGNIZER_ENDPOINT")
                TWRPA_API_PROD_FORM_RECOGNIZER_API_KEY = credentials("TWRPA_API_PROD_FORM_RECOGNIZER_API_KEY")
                TWRPA_API_PROD_GOOGLE_GEOCODING_API_KEY = credentials("TWRPA_API_PROD_GOOGLE_GEOCODING_API_KEY")
                TWRPA_API_PROD_SKIP_DOCUMENT_DUPLICATE_CHECK = credentials("TWRPA_API_PROD_SKIP_DOCUMENT_DUPLICATE_CHECK")
                TWRPA_API_PROD_OTM_BASE_URL = credentials("TWRPA_API_PROD_OTM_BASE_URL")
                TWRPA_API_PROD_SENDGRID_API_KEY = credentials("TWRPA_API_PROD_SENDGRID_API_KEY")
                TWRPA_API_PROD_SENDGRID_FROM = credentials("TWRPA_API_PROD_SENDGRID_FROM")
                TWRPA_API_PROD_OTM_TW_CHARTER_VOYAGE_URL = credentials("TWRPA_API_PROD_OTM_TW_CHARTER_VOYAGE_URL")

                TWRPA_API_PROD_IP = credentials("TWRPA_API_PROD_IP")
                BRANCH_NAME = '${env.BRANCH_NAME}'
            }
            steps {
                echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
                sh '''#!/bin/bash
                touch .env
                echo PORT=$TWRPA_API_PROD_PORT >> .env
                echo "MONGODB_URL=$TWRPA_API_PROD_MONGODB_URL" >> .env
                echo DB_NAME=$TWRPA_API_PROD_DB_NAME >> .env
                echo JWT_SECRET=$TWRPA_API_PROD_JWT_SECRET >> .env
                echo JWT_ACCESS_EXPIRATION_MINUTES=$TWRPA_API_PROD_JWT_ACCESS_EXPIRATION_MINUTES >> .env
                echo JWT_REFRESH_EXPIRATION_DAYS=$TWRPA_API_PROD_JWT_REFRESH_EXPIRATION_DAYS >> .env
                echo JWT_RESET_PASSWORD_EXPIRATION_MINUTES=$TWRPA_API_PROD_JWT_RESET_PASSWORD_EXPIRATION_MINUTES >> .env
                echo JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=$TWRPA_API_PROD_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES >> .env
                echo NODE_ENV=$TWRPA_API_PROD_NODE_ENV >> .env
                echo S3ACCESSKEYID=$TWRPA_API_PROD_S3ACCESSKEYID >> .env
                echo "S3ACCESSSECRET=$TWRPA_API_PROD_S3ACCESSSECRET" >> .env
                echo S3REGION=$TWRPA_API_PROD_S3REGION >> .env
                echo S3BUCKET=$TWRPA_API_PROD_S3BUCKET >> .env
                echo REGISTERED_USER_KEY=$TWRPA_API_PROD_REGISTERED_USER_KEY >> .env
                echo WALLET_VERIFY_EXPIRATION_TIME=$TWRPA_API_PROD_WALLET_VERIFY_EXPIRATION_TIME >> .env
                echo OTM_API_USERNAME=$TWRPA_API_PROD_OTM_API_USERNAME >> .env
                echo OTM_API_PASSWORD=$TWRPA_API_PROD_OTM_API_PASSWORD >> .env
                echo OTM_SANITY_API_USERNAME=$TWRPA_API_PROD_OTM_SANITY_API_USERNAME >> .env
                echo OTM_SANITY_API_PASSWORD=$TWRPA_API_PROD_OTM_SANITY_API_PASSWORD >> .env
                echo START_FIELDS_EXTRACTION_PROCESS=$TWRPA_API_PROD_START_FIELDS_EXTRACTION_PROCESS >> .env
                echo FORM_RECOGNIZER_ENDPOINT=$TWRPA_API_PROD_FORM_RECOGNIZER_ENDPOINT >> .env
                echo FORM_RECOGNIZER_API_KEY=$TWRPA_API_PROD_FORM_RECOGNIZER_API_KEY >> .env
                echo GOOGLE_GEOCODING_API_KEY=$TWRPA_API_PROD_GOOGLE_GEOCODING_API_KEY >> .env
                echo SKIP_DOCUMENT_DUPLICATE_CHECK=$TWRPA_API_PROD_SKIP_DOCUMENT_DUPLICATE_CHECK >> .env
                echo OTM_BASE_URL=$TWRPA_API_PROD_OTM_BASE_URL >> .env
                echo OTM_TW_CHARTER_VOYAGE_URL=$TWRPA_API_PROD_OTM_TW_CHARTER_VOYAGE_URL >> .env
                echo SENDGRID_API_KEY=$TWRPA_API_PROD_SENDGRID_API_KEY >> .env
                echo SENDGRID_FROM=$TWRPA_API_PROD_SENDGRID_FROM >> .env

                sed -i 's/environment/prod/g' ecosystem.config.js

                '''
            }
        }

        stage('deploy-prod') {
            when {
                branch 'deploy-prod'
            }
            environment {
                TWRPA_API_PROD_IP = credentials("TWRPA_API_PROD_IP")
            }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: "jenkins-ssl", keyFileVariable: 'sshkey')
                ]) {
                    echo 'deploying the software'
                    sh '''#!/bin/bash
                    echo "Creating .ssh"
                    mkdir -p /var/lib/jenkins/.ssh
                    ssh-keyscan ${TWRPA_API_PROD_IP} >> /var/lib/jenkins/.ssh/known_hosts
                    ssh -i $sshkey deployer@${TWRPA_API_PROD_IP} "mkdir -p /home/deployer/repo/transworld-rpa-api/$BRANCH_NAME"
                    rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ deployer@${TWRPA_API_PROD_IP}:/home/deployer/repo/transworld-rpa-api/$BRANCH_NAME
                    ssh -i $sshkey deployer@${TWRPA_API_PROD_IP} "cd /home/deployer/repo/transworld-rpa-api/$BRANCH_NAME && pm2 stop ecosystem.config.js && pm2 start ecosystem.config.js && pm2 save"
                    '''
                }
            }
        }
    }
}