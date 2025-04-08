# JobSwipe

A Tinder-like application for job matching where users can swipe on jobs and get matched with companies. (STILL IN DEVELOPMENT)

## Features

- User profile creation with job application details
- Job swiping interface
- Real-time notifications
- AI-powered job application automation
- Company matching system
- Advanced filtering options

## Tech Stack

- Frontend: Vue.js 3 + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Real-time: Socket.IO
- Authentication: JWT
- AI Integration: OpenAI API

## Project Structure

```
jobswipe/
├── client/             # Vue.js frontend
├── server/             # Node.js backend
├── shared/             # Shared types and utilities
└── docs/              # Documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Add necessary API keys and configuration

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm run dev
   ```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details 
