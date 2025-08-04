pipeline {
    agent any

    environment {
        GIT_CREDENTIALS_ID = 'git-credentials'
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        KUBERNETES_TOKEN_SECRET = 'jenkins-sa-token'
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
                "billing_management",
                "eureka-server",
                "frontend",
                "medical-records-management",
                "notification_management",
                "user-profile-management"
            ]

                    for (service in services) {
                        echo "📦 Compilation du service : ${service}"

                        if (service == "frontend") {
                            dir("frontend") {
                                echo "📂 Vérification du répertoire frontend..."
                                sh 'pwd && ls -la'
                                
                                if (fileExists('package.json')) {
                                    echo "✅ package.json trouvé, installation des dépendances..."
                                    sh 'npm install'
                                    
                                    def imageName = "${DOCKER_NAMESPACE}-frontend"
                                    echo "🐳 Construction de l'image : ${imageName}"
                                    sh "docker build -t ${imageName}:latest ."

                                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                        sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS} ${DOCKER_REGISTRY}"
                                        sh "docker push ${imageName}:latest"
                                    }
                                } else {
                                    echo "❌ Le fichier package.json est introuvable dans ${service}. Ignorer ce service."
                                }
                            }
                        } else {
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
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Déploiement des microservices sur Kubernetes...'
                withCredentials([string(credentialsId: 'kubernetes-token', variable: 'KUBE_TOKEN')]) {
                    sh """
                        for file in k8s/*.yaml; do
                            echo "📁 Déploiement de \$file"
                            kubectl --server=${KUBERNETES_SERVER} \\
                                    --token="\$KUBE_TOKEN" \\
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
                        withCredentials([string(credentialsId: 'kubernetes-token', variable: 'KUBE_TOKEN')]) {
                            sh """
                                kubectl --insecure-skip-tls-verify \\
                                        --server=${KUBERNETES_SERVER} \\
                                        --token="\$KUBE_TOKEN" \\
                                        --namespace=${KUBERNETES_NAMESPACE} \\
                                        rollout status deployment/${service} || true
                            """
                        }
                    }
                }
            }
        }

        stage('Post Actions') {
            steps {
                echo '📦 Archivage des artefacts...'
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true, allowEmptyArchive: true
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
