# Node Express Starter 2.0

A modern, feature-rich starter template for building scalable web applications with Node.js, Express, MySQL, and Socket.io. This template provides a solid foundation for developing web applications using the MVC architecture pattern.

## Features

- **Authentication Ready**: Built-in authentication system supporting both REST API and cookie-based EJS authentication flows
  - User registration and login with email/password
  - JWT-based API authentication
  - Cookie-based session management
  - Password reset functionality
  - OAuth integration ready

- **MVC Architecture**: Clean and organized code structure following the Model-View-Controller pattern
  - Modular and scalable project structure
  - Clear separation of concerns
  - Easy to maintain and extend
  - Pre-configured routing system

- **Real-time Support**: Integrated Socket.io for real-time communication
  - Bidirectional event-based communication
  - Room-based messaging
  - Real-time notifications
  - Auto-reconnection handling

- **Database Integration**: Preconfigured Sequelize ORM with MySQL support
  - Model associations and relationships
  - Database migrations
  - Query optimization
  - Connection pooling

- **API Validation**: Request validation using Joi
  - Schema-based validation
  - Custom validation rules
  - Error handling middleware
  - Input sanitization

- **Modern UI**: Clean and responsive user interface
  - Mobile-first design
  - Modern CSS practices
  - Customizable themes
  - Interactive components

- **Security**: Implementation of best security practices
  - CSRF protection
  - XSS prevention
  - Rate limiting
  - Secure headers
  - SQL injection prevention

- **Email Integration**: Nodemailer setup for sending emails
  - HTML email templates
  - Queue system for bulk emails
  - SMTP configuration
  - Email verification

- **Session Management**: Express session with cookie support
  - Secure session handling
  - Session persistence
  - Multiple session stores
  - Session middleware

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn

## Quick Start

You can get started with Node Express Starter 2.0 in two ways:

### Option 1: Using npx (Recommended)

```bash
npx ne-starter my-project
cd my-project
```

This will create a new project in the `my-project` directory with all dependencies installed.

### Option 2: Clone the Repository

1. Clone the repository
```bash
git clone https://github.com/khokonm/node-express-starter-2.0.git
cd node-express-starter-2.0
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server
```bash
npm run dev
```

5. For production
```bash
npm start
```

## Project Structure

```
├── controllers/        # Route controllers (handle incoming requests)
│   ├── api/           # API controllers for REST endpoints
│   ├── auth/          # Authentication controllers
│   └── views/         # View controllers for server-side rendering
├── events/            # Event handlers for Socket.io and system events
├── libs/              # Library functions and shared business logic
├── middleware/        # Express middleware (auth, validation, etc.)
├── models/            # Database models and schemas
├── routes/            # Application routes and API endpoints
├── services/          # Business logic and external service integration
├── utils/             # Utility functions and helpers
├── validations/       # Request validators and schemas
├── views/             # EJS templates and static assets
├── app.js             # Express app setup and configuration
└── server.js          # Server entry point and Socket.io setup
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=your_database
DB_PORT=3306

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret
SESSION_EXPIRES=24h

# Mail Configuration (Optional)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## API Documentation

Detailed API documentation is available at `/api-playground` when running the development server. The documentation includes:

- Authentication endpoints
- User management
- Business logic APIs
- WebSocket events
- Request/Response examples
- Schema validation rules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

Khokon M. (khokon.dev)

## Support

For support and questions, please use the [GitHub Issues](https://github.com/khokonm/node-express-starter-2.0/issues) page.

## Acknowledgments

- Express.js team for the excellent web framework
- Sequelize team for the robust ORM
- Socket.io team for real-time capabilities
- The open-source community for various packages and inspirations