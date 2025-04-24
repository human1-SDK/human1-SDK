# Human1 SDK Demo

This project demonstrates the use of Human1 SDK with a React frontend and Express backend. The application allows users to perform natural language queries against their data.

## Project Structure

```
/human1-test/
├── client/                     # React frontend
│   ├── src/                    # React source code
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   ├── postcss.config.mjs      # PostCSS configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── tsconfig.json           # TypeScript configuration for client
│   └── vite.config.ts          # Vite configuration
├── server/                     # Express backend
│   ├── src/                    # Server source code
│   │   ├── controllers/        # Route controllers
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic
│   │   ├── models/             # Data models
│   │   └── index.ts            # Server entry point
│   ├── package.json            # Backend dependencies
│   └── tsconfig.json           # TypeScript configuration for server
└── package.json                # Workspace scripts
```

## Technology Stack

- **Frontend**: React with TypeScript, Vite, Tailwind CSS v4
- **Backend**: Express with TypeScript
- **SDK Integration**: Human1 SDK for natural language queries

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
2. Install dependencies for workspace, client, and server:

```bash
# Install workspace dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

3. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add your Human1 API key:
   ```
   PORT=3001
   HUMAN1_API_KEY=your_api_key_here
   ```

### Running the Application

Start both the frontend and backend with a single command:

```bash
npm start
```

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:3001

You can also start them individually:

```bash
# Start only the frontend
npm run start:client

# Start only the backend
npm run start:server
```

## Features

- Natural language querying of data
- Display of query results in appropriate formats (tables, paragraphs)
- Query history tracking
- Error handling and display

## API Endpoints

The server provides the following endpoints:

- `POST /api/query`: Execute a natural language query
- `GET /api/query/history`: Get history of previous queries
- `GET /health`: Health check endpoint

## License

ISC 