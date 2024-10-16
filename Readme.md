# ChatApp-2.0

ChatApp-2.0 is a real-time chat application built with modern technologies to deliver fast and scalable messaging features. The frontend is built on Next.js (v14) with TypeScript, utilizing OAuth (Google) for authentication, while the backend architecture is powered by TypeScript, Express, Socket.io for real-time WebSocket connections, Redis for PUB-SUB messaging, Kafka for message queuing, and PostgreSQL for data persistence.

## Features

- **Real-time messaging**: Enables real-time communication using WebSockets.
- **Private rooms**: Users can create private rooms, visible only to the creator.
- **Public rooms**: Open rooms visible to all users.
- **OAuth (Google) Authentication**: Secure login with Google.
- **Scalable architecture**: The backend leverages Redis for PUB-SUB communication across WebSocket servers, Kafka for message queuing, and PostgreSQL for database storage.
- **Dockerized Services**: Zookeeper, Kafka, and Redis are containerized using Docker.

## Technologies Used

### Frontend
- **Next.js v14**
- **TypeScript**
- **OAuth (Google) for Authentication**

### Backend
- **Socket.io**: WebSocket connections for real-time messaging.
- **Redis**: PUB-SUB model for communication between WebSocket servers.
- **Kafka**: Message queue to manage and offload messages to the database.
- **PostgreSQL**: Relational database for message storage.
- **Docker**: Containers for Redis, Kafka, and Zookeeper.

## Architecture
![image](https://github.com/user-attachments/assets/a365307b-0284-4f4d-8bdc-cec347a18171)

## Prerequisites to Run on local Machine

- **Docker**: Make sure Docker is installed and running on your machine.
- **Node.js**: Ensure Node.js is installed (v16 or higher recommended).
- **PostgreSQL**: Running as the main database (via Docker or locally).

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ar-rana/ChatApp-2.0.git
cd ChatApp-2.0
```

### 2. SetUp Environment Variable
GOOGLECLIENT_ID<br/>
GOOGLECLIENT_SECRET

### 3. Install Dependencies

#### for server: 
```bash
cd server
npm install
```
#### for client
```bash
cd client
npm install
```

### 4. Start Docker Containers
```bash
docker-compose up
```

### 5. Start The Project
#### for client - (will be running on localhost:3000)
```bash
npm run dev
```

#### for server - (will be running on localhost:8000)
```bash
npm run dev
```
