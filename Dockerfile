# specify the node base image with your desired version node:<version>
FROM node:lts
RUN apt-get update && apt-get install -y \
  libpq-dev \
   g++ \
   make && rm -rf /var/lib/apt/lists/*
WORKDIR /work
COPY package.json .
RUN npm install
COPY . .
RUN npm run-script build
ENV NODE_OPTIONS="--max-old-space-size=16384"
ENV DEBUG=arq2hrvst