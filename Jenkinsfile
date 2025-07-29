pipeline {
    agent any

    environment {
        // Variables d'environnement Jenkins
        GIT_CREDENTIALS_ID = 'git-credentials' // ID du credential Jenkins pour Git
        DOCKER_CREDENTIALS_ID = 'docker-credentials' // ID du credential Jenkins pour Docker
        KUBERNETES_TOKEN_ID = 'kubernetes-token' // ID du credential Jenkins pour Kubernetes token
        GIT_REPO_URL = 'https://dev.azure.com/hanimedyouni12/MedicalRecordsManagementService/_git/MedicalRecordsManagementService'
        GIT_BRANCH = 'develop' // Branche à utiliser
        DOCKER_REGISTRY = 'docker.io' // Registre Docker Hub
        DOCKER_NAMESPACE = 'hani016/medical-records-management-system' // Namespace Docker Hub
        KUBERNETES_NAMESPACE = 'medical-records'
        KUBERNETES_SERVER = 'https://kubernetes.docker.internal:6443' // URL de l'API Kubernetes
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
                echo '🔨 Compilation des microservices et création des images Docker...'
                script {
                    def services = [
                        "api-gateway",
                        "auth-service",
                        "billing-management",
                        "eureka-server",
                        "frontend",
                        "medical-records-management",
                        "notification-management",
                        "user-profile-management"
                    ]
                    for (service in services) {
                        echo "📦 Compilation du service : ${service}"
                        dir("backend/${service}") {
                            // Vérifier si le fichier pom.xml existe
                            if (fileExists('pom.xml')) {
                                sh 'mvn clean install -DskipTests'

                                // Utiliser les noms d'images correctement formatés
                                def imageName = "${DOCKER_NAMESPACE}-${service}"
                                sh "docker build -t ${imageName}:latest ."

                                // Utiliser les credentials Docker
                                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                    sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS} ${DOCKER_REGISTRY}"
                                    sh "docker push ${imageName}:latest"
                                }
                            } else {
                                echo "⚠️ Le fichier pom.xml est introuvable dans backend/${service}. Ignorer ce service."
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Déploiement des microservices sur Kubernetes...'
                withCredentials([string(credentialsId: KUBERNETES_TOKEN_ID, variable: 'KUBE_TOKEN')]) {
                    sh """
                        for file in $(ls k8s/*.yaml); do
                            kubectl --server=${KUBERNETES_SERVER} \
                            --token=$(cat <<< "${KUBE_TOKEN}") \
                            --namespace=${KUBERNETES_NAMESPACE} apply -f $file;
                        done
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                echo '🔍 Vérification de la santé du déploiement...'
                script {
                    def services = [
                        "api-gateway",
                        "auth-service",
                        "billing-management",
                        "eureka-server",
                        "frontend",
                        "medical-records-management",
                        "notification-management",
                        "user-profile-management"
                    ]
                    for (service in services) {
                        echo "🔍 Vérification de la santé du service : ${service}"
                        withCredentials([string(credentialsId: KUBERNETES_TOKEN_ID, variable: 'KUBE_TOKEN')]) {
                            sh """
                                kubectl --server=${KUBERNETES_SERVER} \
                                --token=$(cat <<< "${KUBE_TOKEN}") \
                                --namespace=${KUBERNETES_NAMESPACE} rollout status deployment/${service}
                            """
                        }
                    }
                }
            }
        }

        stage('Post Actions') {
            steps {
                echo '📦 Archivage des artefacts...'
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
                echo '📜 Nettoyage des images locales...'
                script {
                    def services = [
                        "api-gateway",
                        "auth-service",
                        "billing-management",
                        "eureka-server",
                        "frontend",
                        "medical-records-management",
                        "notification-management",
                        "user-profile-management"
                    ]
                    for (service in services) {
                        def imageName = "${DOCKER_NAMESPACE}-${service}"
                        sh "docker rmi ${imageName}:latest"
                    }
                }
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
