# Note App with DevOps Pipeline

A full-stack note application with modern DevOps practices including CI/CD pipeline, Docker containerization, and cloud deployment.

✅ Backend:
🔗 https://circleci-demo.onrender.com

✅ Frontend:
🔗 https://circleci-demo-1.onrender.com

## Architecture Overview

### Tech Stack
- Frontend: React.js
- Backend: Node.js/Express
- Database: MongoDB Atlas
- CI/CD: CircleCI
- Containerization: Docker
- Cloud Platform: Render
- Monitoring: Telegram notifications

### Project Structure


## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Kurok00/CircleCI-demo.git

cd <project-directory>

# 2. Install dependencies:

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

3.Environment Setup:

Create .env files:

server/.env: 
PORT=3000
MONGODB_URI=your_mongodb_connection_string

client/.env.development
REACT_APP_API_URL=http://localhost:3000

4.Run the application:

# Development mode (both frontend and backend)
docker-compose up

#Docker Setup
The application uses Docker for containerization. Key files:

docker-compose.yml: Orchestrates multiple containers
client/Dockerfile: Frontend container configuration
server/Dockerfile: Backend container configuration
To build and run with Docker: docker-compose up --build

DevOps Pipeline
CI/CD Workflow
Push to master/main triggers CircleCI
Automated tests & builds run
Successful builds deploy to Render
Telegram notifications sent
Deployment URLs
Frontend: https://circleci-demo-1.onrender.com
Backend API: https://circleci-demo.onrender.com
API Docs: https://circleci-demo.onrender.com/api/docs
Monitoring
Health: /health
Metrics: /metrics
Build Status: CircleCI Dashboard
Notifications: Telegram Bot


Docker Commands
# Development
docker-compose up

# Rebuild
docker-compose up --build

# Stop
docker-compose down

# Logs
docker-compose logs
