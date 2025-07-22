pipeline {
    agent any

    environment {
        // Remplace par ton nom d'utilisateur Docker hub
        REGISTRY = 'docker.io/hani016' 
        // Nom de l'image (repository) sur Docker Hub
        IMAGE_NAME = 'medical-records-management-system'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Push Images') {
            steps {
                script {
                    // Dictionnaire des services et leurs chemins respectifs
                    def services = [
                        'Auth-service': 'backend/Auth-service',
                        'api-gateway': 'backend/api-gateway',
                        'eureka-server': 'backend/eureka-server',
                        'user-profile-management': 'backend/user-profile-management',
                        'medical-records-management': 'backend/medical-records-management',
                        'notification-management': 'backend/notification_management', // Attention au _
                        'billing-management': 'backend/billing_management',          // Attention au _
                        'frontend': 'frontend'
                    ]

                    // Utilisation des credentials Jenkins de type Username with password
                    withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        
                        // Login Docker
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"

                        // Build & push pour chaque service
                        services.each { serviceName, servicePath ->
                            def imageTag = "${REGISTRY}/${IMAGE_NAME}:${serviceName}"
                            echo "Building and pushing image: ${imageTag} from path: ${servicePath}"
                            
                            sh "docker build -t ${imageTag} ./${servicePath}"
                            sh "docker push ${imageTag}"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Assure-toi que kubectl est configuré et accessible sur l'agent Jenkins
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}
