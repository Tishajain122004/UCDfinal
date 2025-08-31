# # # Base image: Ubuntu
# FROM ubuntu:22.04

# # # Set timezone & basic deps
# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt-get update && apt-get install -y \
#     curl wget unzip git build-essential \
#     openjdk-17-jdk \
#     python3 python3-pip \
#     && rm -rf /var/lib/apt/lists/*

# # # Node.js 20 (as per package.json engines)
# RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
#     && apt-get install -y nodejs

# # # NPM global upgrades
# RUN npm install -g npm@latest react-native-cli

# # # Install Gradle 8.14.3 (as per gradle-wrapper.properties)
# RUN wget https://services.gradle.org/distributions/gradle-8.14.3-bin.zip -P /tmp \
#     && unzip /tmp/gradle-8.14.3-bin.zip -d /opt/gradle \
#     && ln -s /opt/gradle/gradle-8.14.3/bin/gradle /usr/bin/gradle

# # # Setup ANDROID SDK
# ENV ANDROID_HOME=/opt/android-sdk
# ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

# RUN mkdir -p ${ANDROID_HOME}/cmdline-tools \
#     && cd ${ANDROID_HOME}/cmdline-tools \
#     && wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O tools.zip \
#     && mkdir -p latest \
#     && unzip tools.zip -d latest \
#     && rm tools.zip

# # # Accept Android SDK licenses & install required packages
# RUN yes | sdkmanager --licenses \
#     && sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# # # Create app dir (mount point for your repo later)
# WORKDIR /app

# # # Default command (no code inside image, only env)
# CMD ["bash"]

# Base image
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${PATH}
ENV GRADLE_HOME=/opt/gradle/gradle-8.14.3
ENV PATH=$GRADLE_HOME/bin:$PATH

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl wget unzip git build-essential \
    openjdk-17-jdk \
    python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (20.x) & React Native CLI
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest react-native-cli yarn

# Install Gradle
RUN wget https://services.gradle.org/distributions/gradle-8.14.3-bin.zip -P /tmp \
    && unzip /tmp/gradle-8.14.3-bin.zip -d /opt/gradle \
    && rm /tmp/gradle-8.14.3-bin.zip

# Install Android SDK Command-line tools
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools \
    && cd ${ANDROID_HOME}/cmdline-tools \
    && wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O commandlinetools.zip \
    && unzip commandlinetools.zip -d ${ANDROID_HOME}/cmdline-tools \
    && rm commandlinetools.zip \
    && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest

# Accept Android licenses & install required SDK packages
RUN yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Set working directory (empty, code mount hoga run ke time)
WORKDIR /app

# Default command (bash khol de)
CMD ["/bin/bash"]
