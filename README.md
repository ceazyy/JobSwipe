# JobSwipe

A modern job application platform built with React, Express, and TypeScript.

## 🚀 Features

- Modern React-based frontend with TypeScript
- Express.js backend with TypeScript
- Authentication system using Passport.js
- Real-time updates using WebSocket
- Database integration with Drizzle ORM
- Beautiful UI components using Radix UI and Tailwind CSS
- Form handling with React Hook Form and Zod validation
- Responsive design with modern animations

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- React Query
- React Hook Form
- Zod
- Framer Motion
- Wouter (Routing)

### Backend
- Express.js
- TypeScript
- Passport.js (Authentication)
- Drizzle ORM
- WebSocket
- Express Session
- Multer (File uploads)

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd JobSwipe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with necessary environment variables.

4. Initialize the database:
```bash
npm run db:push
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

This will start both the frontend and backend servers in development mode.

## 🏗️ Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 📁 Project Structure

```
JobSwipe/
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   └── index.html         # Entry HTML file
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── auth.ts           # Authentication logic
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database configuration
│   └── storage.ts        # File storage handling
├── shared/               # Shared types and utilities
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check the codebase
- `npm run db:push` - Push database schema changes

## 🔒 Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests. 
