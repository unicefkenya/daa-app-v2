FROM mobiledevops/android-sdk-image

USER root

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

ENV NVM_DIR="$HOME/.nvm"
ENV NODE_VERSION 18

# RUN source $NVM_DIR/nvm.sh
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default"
RUN echo "source $NVM_DIR/nvm.sh" >> /home/mobiledevops/.bashrc
RUN echo "nvm use default" >> /home/mobiledevops/.bashrc

RUN /bin/bash -c "source $NVM_DIR/nvm.sh && npm install -g npm@10.2.4 "
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && npm i -g cordova "
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && npm i -g @angular/cli "

RUN apt update && apt install -y wget
ENV GRADLE_VERSION=6.5.1
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp
RUN unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip
RUN ln -s /opt/gradle/gradle-${GRADLE_VERSION} /opt/gradle/latest 
RUN echo "export GRADLE_HOME=/opt/gradle/latest" >> /home/mobiledevops/.bashrc
RUN echo "export PATH=\${GRADLE_HOME}/bin:\${PATH}" >> /home/mobiledevops/.bashrc

RUN sdkmanager "build-tools;32.0.0" --sdk_root=/opt/android-sdk-linux

EXPOSE 4200

# COPY package.json /home/mobiledevops/package.json
# COPY package-lock.json /home/mobiledevops/package-lock.json
# RUN /bin/bash -c "source $NVM_DIR/nvm.sh && npm i --force "

