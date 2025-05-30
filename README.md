# Particle Physics Simulations Dashboard

[ADD IMAGE]

A locally hosted web application for ALICE researchers at CERN to manage Monte Carlo methods.
This functional prototype is built from scratch with the TypeScript language and Next.js framework to address the features below. 

## Main features

The main goal is to integrate the different stages of Monte Carlo simulations management. 
- Which includes their build, automating the creation of custom scripts;
- execution, tracking the operation of parallel runs either in the WLCG or a local server;
- and query, retrieving information such as their content, status and output.

## Installation

Before running this project:
- make sure to have installed [Docker](https://docs.docker.com/get-docker/)
- and check check that it is running,

Note: Docker already implements Node.js to ensure a consistent environment across different systems. 

### 1. Clone and Setup

```bash
# Clone repository
git clone https://github.com/apausa/webApplicationDevelopment
cd webApplicationDevelopment
```

### 2. Start the Application

**Development Mode**
```bash
npm run dev
```

**Production Mode**:
```bash
npm run start
```

Note: Docker already install the dependencies of the project. 

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

The application should load and display the dashboard.

### 4. Stop all running containers

Stop all running containers

```bash
npm run stop
```

## Test and lint code

Run the test suite:

```bash
npm run test
```
