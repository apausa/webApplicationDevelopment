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

## Languages and technologies justification

**Programming languages**
- **TypeScript**: strongly typed JavaScript for code maintainability and error reduction
- **Bash**: Native scripting language for simulation library integration

**Frontend Stack:**
- **Next.js**: React framework with advanced routing and optimized performance
- **Node.js**: JavaScript runtime for server-side rendering and API functionality
- **Tailwind CSS**: utility-first CSS framework for rapid styling
- **NextUI**: modern component library with seamless Next.js integration
- **UUID**: unique identifier generation for system operations
- **D3-graphviz**: visualization library for rendering DOT notation graphs
- **Git**: industry-standard version control with branching capabilities
- **ESLint**: static code analysis tool with Airbnb configuration for code quality
- **Docker**: containerization platform for consistent development environments
- **Jest**: JavaScript testing framework with comprehensive testing capabilities

## Structure of the project

```
├── __tests__/                # Test suite
├── app/                      # Application directory (main code)
│   ├── _private/             # Private components and utilities
│   │   ├── components/       # Components organized by page
│   │   ├── context/          # Context provider to maintain a global state of ongoing processes
│   │   ├── lib/              # Business logic, actions, and reducers
│   │   ├── types/            # Type definitions
│   │   └── utils/            # Utility functions
│   ├── (pages)/              # Group for organized routing
│   │   ├── configuration/    # Configuration page
│   │   └── simulation/       # Details and visualization pages
│   ├── @configuration/       # Parallel route for configuration screen as modal
│   ├── @simulation/          # Parallel route for for details screen as modal
│   └── api/                  # API routes
├── docker/                   # Docker files
├── configuredMethods/        # Folder for generated scripts
└── public/                   # Static assets
```
