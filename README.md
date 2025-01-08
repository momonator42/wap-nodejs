# WAP-Webserver

## Overview
The **WAP-Webserver** is a microservice backend for the game *Mühle (Nine Men's Morris)*. It manages state using Redis and provides RESTful APIs to handle game logic, multiplayer interactions, and player actions.

This service is written in **Node.js** and designed to be lightweight and scalable.

---

## Features
- **Stateful Game Management**: Uses Redis for efficient state handling.
- **RESTful API**: Provides endpoints for creating games, making moves, and managing players.
- **Multiplayer Support**: Handles real-time game interactions for multiple players.
- **Docker Support**: Easily deployable via Docker.

---

## Requirements
- **Heroku CLI** (for deployment)
- **Node.js** (v16 or higher)
- **Redis** (an add-on on heroku)
- **Docker** (for containerized deployment)

---

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/momonator42/wap-webserver.git
```

### 2. Navigate into the Project Directory
```bash
cd wap-webserver
```

### 3. Install Dependencies
```bash
npm install
```

### 3. Build the server
```bash
npm run build
```

### 4. Set an environment variable for the [wap-mill](https://github.com/momonator42/wap-mill)
```bash
$env:WAP_MILL = "<your-wap-mill-host>"
$env:JWT_SECRET = "<your-password>"
```

### 5. Set an environment variable for redis
```bash
$env:REDIS_TLS_URL= "<your-REDIS-Host>"
```

### 6. Start the server
```bash
npm run start
```

## Deployment

### 1. push in your heroku (docker image will be built automatically)
```bash
heroku container:push web --a <app-name> 
```

### 2. release it and enjoy
```bash
heroku container:release web --app <app-name>
```

### 3. set the same environment variables in heroku app configuration as before 
```bash
heroku config:set WAP_MILL=<your-wap-mill-host> -a <app-name>
heroku config:set JWT_SECRET=<your-password> -a <app-name>
heroku config:set REDIS_TLS_URL=<your-REDIS-Host> -a <app-name>
```

## Set a webhook between redis and wap-webserver

### 1. generate a heroku token
```bash
heroku login
```
```bash
heroku auth:token
```

### 2. copy the generated token and set it as a environemt variable
```bash
heroku config:set HEROKU_API_TOKEN=<your-api-token> -a <app-name>
```

### 3. set the webhook for your redis app
```bash
heroku webhooks:add -i api:release -l notify -u <your-wap-webserver-host>/webhook/redis -a <your-redis-app>
```





