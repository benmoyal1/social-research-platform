# Israel War Social Media Research Platform - TypeScript Edition

A full-stack TypeScript application for analyzing social media data from Telegram and Twitter related to the Israel-Hamas war. This project features JWT authentication, PostgreSQL database, streaming CSV exports, and a modern React frontend.

## Tech Stack

### Backend
- **TypeScript 5.3.3** - Type-safe backend code
- **Node.js 18** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Docker** - Containerization

### Frontend
- **TypeScript 5.3.3** - Type-safe frontend code
- **React 18** - UI framework
- **Create React App** - Build tooling
- **CSS3** - Styling with gradients and animations

## Quick Start

### Using Docker (Recommended)

1. Navigate to project directory:
```bash
cd israel-war-project
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Start all services:
```bash
docker-compose up --build
```

4. Access the application:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001
- **PostgreSQL**: localhost:5432

## Features

- JWT-based authentication
- Real-time data pagination
- Advanced filtering (date ranges, users/channels, engagement metrics)
- Streaming CSV exports
- TypeScript type safety throughout
- Clean architecture with separation of concerns

## API Ports

- **Backend**: 5001 (Changed from 5000 to avoid conflicts)
- **Frontend**: 3001 (Changed from 3000 to avoid conflicts)
- **Database**: 5432

## Development

### Backend Development
```bash
cd backend
npm install
npm run watch  # Auto-reload on file changes
```

### Frontend Development
```bash
cd front
npm install
npm start  # Starts dev server with hot reload
```

## TypeScript Build

### Backend
```bash
cd backend
npm run build  # Compiles src/ to dist/
npm start      # Runs compiled code
```

### Frontend
```bash
cd front
npm run build  # Creates production build
```

## Contact

- Prof Ilan Manor: manor.ilan@gmail.com
- Prof Orly Manor: orlyma@ekmd.huji.ac.il

## License

ISC License
