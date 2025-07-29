pipeline {
    agent any

    environment {
        // Variables d'environnement Jenkins
        GIT_CREDENTIALS_ID = 'git-credentials' // ID du credential Jenkins pour Git
        DOCKER_CREDENTIALS_ID = 'docker-credentials' // ID du credential Jenkins pour Docker
        KUBERNETES_TOKEN_ID = 'kubernetes-token' // ID du credential Jenkins pour Kubernetes token
        GIT_REPO_URL = 'https://dev.azure.com/hanimedyouni12/MedicalRecordsManagementService/_git/MedicalRecordsManagementService'
        GIT_BRANCH = 'main' // à adapter selon ta branche
        DOCKER_IMAGE = 'medical-records-service'
        KUBERNETES_NAMESPACE = 'medical-records'
        KUBERNETES_SERVER = 'https://<kubernetes-api-server-url>' // URL de l'API Kubernetes
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checkout du code source...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${env.GIT_BRANCH}"]],
                    userRemoteConfigs: [[
                        url: env.GIT_REPO_URL,
                        credentialsId: env.GIT_CREDENTIALS_ID
                    ]]
                ])
            }
        }

        stage('Build & Push Images') {
            steps {
                echo '🔨 Compilation du projet et création de l’image Docker...'
                sh 'mvn clean install -DskipTests'
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Déploiement sur Kubernetes...'
                withCredentials([string(credentialsId: KUBERNETES_TOKEN_ID, variable: 'KUBE_TOKEN')]) {
                    sh """
                        kubectl --server=${KUBERNETES_SERVER} \
                        --token=${KUBE_TOKEN} \
                        --namespace=${KUBERNETES_NAMESPACE} apply -f k8s/deployment.yaml
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                echo '🔍 Vérification de la santé du déploiement...'
                withCredentials([string(credentialsId: KUBERNETES_TOKEN_ID, variable: 'KUBE_TOKEN')]) {
                    sh """
                        kubectl --server=${KUBERNETES_SERVER} \
                        --token=${KUBE_TOKEN} \
                        --namespace=${KUBERNETES_NAMESPACE} rollout status deployment/${DOCKER_IMAGE}
                    """
                }
            }
        }

        stage('Deploy Monitoring Stack') {
            steps {
                echo '📊 Déploiement de la stack de monitoring...'
                withCredentials([string(credentialsId: KUBERNETES_TOKEN_ID, variable: 'KUBE_TOKEN')]) {
                    sh """
                        kubectl --server=${KUBERNETES_SERVER} \
                        --token=${KUBE_TOKEN} \
                        --namespace=${KUBERNETES_NAMESPACE} apply -f k8s/monitoring-stack.yaml
                    """
                }
            }
        }

        stage('Post Actions') {
            steps {
                echo '📦 Archivage des artefacts...'
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
                echo '📜 Nettoyage des images locales...'
                sh "docker rmi ${DOCKER_IMAGE}:latest"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline terminé avec succès !'
        }
        failure {
            echo '❌ Échec du pipeline.'
        }
    }
}
