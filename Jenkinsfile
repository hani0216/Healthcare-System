pipeline {
    agent any

    environment {
        // Remplace par ton nom d'utilisateur Docker Hub
        REGISTRY = 'docker.io/hani016' 
        // L'image de base est le nom du repo sur Docker Hub
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
                    // Structure pour gérer les chemins différents
                    def services = [
                        'Auth-service': 'backend/Auth-service',
                        'api-gateway': 'backend/api-gateway',
                        'eureka-server': 'backend/eureka-server',
                        'user-profile-management': 'backend/user-profile-management',
                        'medical-records-management': 'backend/medical-records-management',
                        'notification-management': 'backend/notification_management', // Attention au _
                        'billing-management': 'backend/billing_management',      // Attention au _
                        'frontend': 'frontend'
                    ]

                    // Utilisation des credentials Jenkins pour Docker Hub
                    withCredentials([string(credentialsId: 'DOCKER_HUB_PASSWORD', variable: 'DOCKER_PASSWORD'),
                                     string(credentialsId: 'DOCKER_HUB_USERNAME', variable: 'DOCKER_USERNAME')]) {
                        
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"

                        services.each { serviceName, servicePath ->
                            def imageTag = "${REGISTRY}/${IMAGE_NAME}:${serviceName}"
                            echo "Building and pushing ${imageTag} from ${servicePath}"
                            
                            sh "docker build -t ${imageTag} ./${servicePath}"
                            sh "docker push ${imageTag}"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Assure-toi que kubectl est configuré sur l'agent Jenkins
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}
