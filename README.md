# Crypitor: High-Performance Real-Time Blockchain Activities Monitoring
Welcome to Crypitor, a cutting-edge platform designed for high-performance, real-time monitoring of blockchain activities. Our mission is to provide developers, businesses, and enthusiasts with the tools they need to stay updated on blockchain transactions and events across various networks.

# Key Features

- Real-Time Monitoring: Instantly receive notifications for blockchain activities and transactions as they happen.
- Multi-Network Support: Seamlessly create monitors across multiple blockchain networks.
- Comprehensive Coverage: Support for native transfers, ERC20, and ERC721 tokens.
- Webhook Integration: Effortlessly integrate with your existing systems using our robust webhook endpoint.
- Retry System: Ensure reliable data delivery with our webhook retry mechanism.
## Dependancies

The following dependancies have been added to improve developer workflow and build the application.

*  **Docker** Docker is a containerization software.
*  **MongoDB** MongoDB database.
*  **Nest.js** Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications.
* **Apache Kafka** Apache Kafka is a distributed streaming platform for real-time data processing.

## Getting started

Clone the repository, **change all references to {PROJECT_NAME} in all files (do find and replace)**, also ensure project name matches the root directory name Eg: docker-compose.yml, Makefile, .env files (client/app) etc..

```bash
git clone https://github.com/crypitor/blockchain-webhook
```

**Update .env files** for both client and app.

Change directory.

```bash
cd /app
```
Install node_modules.

```bash
yarn install
```

Install Nest.js CLI globally

```bash
yarn global add @nestjs/cli
```

Start docker dependencys.
```bash
make up-deps
```

Start the application.
```bash
yarn start:dev onebox
yarn start:dev monitor-service
yarn start:dev worker-service
```
Visit back-end [http://localhost:3002](http://localhost:3002).

## Start Docker containers (server, db etc..)
**Update .env files** for docker.
Run the following command to build the containers and start the development environment, make sure to be inside the "app" directory.

```bash
cd docker
docker compose up -d
```

access http://localhost

## MongoDB

Get connection string URL's, run the following command in **/app** directory.:

```bash
make db
```

Access MongoDB outside Docker containers:

```bash
mongodb://{PROJECT_NAME}:{PROJECT_NAME}@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.0
```

Access MongoDB within the Docker containers, use this URL for the app to connect to MongoDB instance:

```bash
mongodb://{PROJECT_NAME}:{PROJECT_NAME}@mongo:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.0
```


## View the app

Visit front-end [http://localhost:3000](http://localhost:3000).
