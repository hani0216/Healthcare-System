pipeline {
    agent {
        docker {
            image 'docker:20.10.16-dind' // version Docker avec daemon Docker
            args '-v /var/run/docker.sock:/var/run/docker.sock' // partage socket Docker avec hôte
        }
    }

    environment {
        REGISTRY = 'docker.io/hani016' 
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
                    def services = [
                        'Auth-service': 'backend/Auth-service',
                        'api-gateway': 'backend/api-gateway',
                        'eureka-server': 'backend/eureka-server',
                        'user-profile-management': 'backend/user-profile-management',
                        'medical-records-management': 'backend/medical-records-management',
                        'notification-management': 'backend/notification_management',
                        'billing-management': 'backend/billing_management',
                        'frontend': 'frontend'
                    ]

                    withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"

                        services.each { serviceName, servicePath ->
                            def imageTag = "${REGISTRY}/${IMAGE_NAME}:${serviceName}"
                            echo "Build & push image: ${imageTag} from ${servicePath}"
                            sh "docker build -t ${imageTag} ./${servicePath}"
                            sh "docker push ${imageTag}"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}
