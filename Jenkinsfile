pipeline {
    agent any

    environment {
        GIT_CREDENTIALS_ID = 'git-credentials'
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        KUBERNETES_TOKEN_SECRET = 'jenkins-sa-token' // Nom du Secret Kubernetes
        GIT_REPO_URL = 'https://dev.azure.com/hanimedyouni12/MedicalRecordsManagementService/_git/MedicalRecordsManagementService'
        GIT_BRANCH = 'develop'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_NAMESPACE = 'hani016/medical-records-management-system'
        KUBERNETES_NAMESPACE = 'default'
        KUBERNETES_SERVER = 'https://kubernetes.docker.internal:6443'
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
                            if (fileExists('pom.xml')) {
                                sh 'mvn clean install -DskipTests'
                                def imageName = "${DOCKER_NAMESPACE}-${service}"
                                sh "docker build -t ${imageName}:latest ."

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
                script {
                    // Vérifier et récupérer dynamiquement le token du Secret  
                    def kubeToken = sh(
                        script: "kubectl get secret ${KUBERNETES_TOKEN_SECRET} -o jsonpath='{.data.token}' ",
                        returnStdout: true
                    ).trim()

                    if (!kubeToken) {
                        error "❌ Échec : Le token Kubernetes est vide ou introuvable."
                    }

                    sh """
                        for file in k8s/*.yaml; do
                            echo "📁 Déploiement de \$file"
                            kubectl --server=${KUBERNETES_SERVER} \\
                                    --token="${kubeToken}" \\
                                    --namespace=${KUBERNETES_NAMESPACE} \\
                                    apply --validate=false --insecure-skip-tls-verify -f \$file
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
                                kubectl --server=${KUBERNETES_SERVER} \\
                                        --token="\$KUBE_TOKEN" \\
                                        --namespace=${KUBERNETES_NAMESPACE} \\
                                        rollout status deployment/${service}
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
                        sh "docker rmi ${imageName}:latest || true"
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
