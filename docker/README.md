# Docker Configuration

This directory contains all Docker-related files for the project.

## Files

- `Dockerfile.dev` - Development environment Docker configuration
- `Dockerfile.prod` - Production environment Docker configuration  
- `docker-compose.yml` - Docker Compose configuration for both environments
- `.dockerignore` - Files and directories to exclude from Docker builds

## Usage

From the project directory:

```bash
# Start development environment
npm run dev

# Start production environment  
npm run start

# Stop containers
npm run stop

# Run linting in development container
npm run lint

# Run tests in development container
npm run test
``` 