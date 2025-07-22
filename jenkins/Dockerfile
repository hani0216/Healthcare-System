FROM jenkins/jenkins:lts

USER root

# Installer curl + Docker CLI + docker-compose
RUN apt-get update && apt-get install -y \
    curl \
    docker.io \
    docker-compose \
    && apt-get clean

# Télécharger kubectl binaire officiel
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    rm kubectl

USER jenkins
