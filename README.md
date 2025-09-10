# Task Management App (Node.js + Express + MongoDB)

A simple multi-user task management app with authentication (JWT in HTTP-only cookies), role-based access (admin/user), categories, and server-rendered views using EJS.

## Features

- Authentication with register/login/logout flows
- JWT stored in HTTP-only cookies
- Role-based access: admin can see all tasks, users see only their own
- CRUD for tasks (create, list, edit, delete)
- Category management (create, list, delete) and assign category to task
- Server-side rendered pages using EJS templates

## Tech Stack

- Node.js, Express
- MongoDB with Mongoose
- EJS for views
- bcryptjs for password hashing
- jsonwebtoken for authentication
- cookie-parser and body-parser for request handling

## Project Structure

```
FInal-exam/
├─ config/
│  └─ db.js                 # MongoDB connection (local default)
├─ controllers/             # Controller logic for auth, tasks, categories
├─ middleware/
│  └─ authMiddleware.js     # Auth check and user extraction from JWT
├─ models/                  # Mongoose models: User, Task, Category
├─ public/
│  └─ css/style.css         # Static assets
├─ routes/                  # Express routes for auth, tasks, categories
├─ views/                   # EJS templates (login, register, taskList, taskForm, categoryList, partials)
├─ index.js                 # App entrypoint
├─ .env                     # Environment variables (JWT secret, etc.)
├─ package.json
└─ README.md
```

## Prerequisites

- Node.js 18+ recommended
- MongoDB running locally (default) or a connection string you provide

## Environment Variables

Create a `.env` file in the project root. The project currently expects:

- `JWT_SECRET` (required): Secret used to sign JWTs
- `PORT` (optional): Defaults to 3000

Example `.env`:

```
JWT_SECRET=your_long_random_secret_here
PORT=3000
```

Note: The database connection in `config/db.js` currently uses the local default `mongodb://127.0.0.1/task-manager`. To use a custom connection string, update `config/db.js` accordingly (e.g., read from `process.env.MONGODB_URI`).

## Installation

1. Install dependencies
   ```bash
   npm install
   ```

2. Start MongoDB
   - Local: ensure MongoDB service is running
   - Atlas: update `config/db.js` with your connection string

3. Run the app
   - Development with auto-reload:
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

The server will start on `http://localhost:3000` by default and redirect `/` to `/login`.

## Available Scripts

- `npm run dev` — Start with nodemon (auto-restart on file changes)
- `npm start` — Start with node

## Routes Overview

- Auth (`routes/authRoutes.js`)
  - `GET /register` — Render registration page
  - `POST /register` — Create user (username, password, role)
  - `GET /login` — Render login page
  - `POST /login` — Authenticate user, set JWT cookie, redirect to `/tasks`
  - `GET /logout` — Clear cookie and redirect to `/login`

- Tasks (`routes/taskRoutes.js`) — protected
  - `GET /tasks` — List tasks
    - Admin: all tasks
    - User: own tasks only
  - `GET /tasks/add` — Render create task form
  - `GET /tasks/form` — Same as above (alias)
  - `POST /tasks/add` — Create task
  - `GET /tasks/edit/:id` — Render edit form
  - `POST /tasks/edit/:id` — Update task
  - `POST /tasks/delete/:id` — Delete task

- Categories (`routes/categoryRoutes.js`) — protected
  - `GET /categories` — List categories
  - `POST /categories/add` — Create category
  - `POST /categories/delete/:id` — Delete category

## Data Models (high level)

- `User`
  - `username` (unique), `password` (hashed), `role` (`admin` | `user`), and helpers like `comparePassword`
- `Task`
  - `title`, `description`, `status`, `category` (ref), `user` (ref)
- `Category`
  - `name`, `user` (owner/ref in some routes)

## Authentication Notes

- JWT is issued on login and stored in an HTTP-only cookie named `token`
- Middleware in `middleware/authMiddleware.js` verifies token and attaches `req.user`
- Use `ensureAuthenticated` to protect routes

## Views

- EJS templates are in `views/`
  - `login.ejs`, `register.ejs`
  - `taskList.ejs`, `taskForm.ejs`
  - `categoryList.ejs`
  - Partials in `views/partials/` such as `navbar.ejs` and `taskItem.ejs`

## Changing the Database Connection

The current connection is set in `config/db.js` to:
```
mongoose.connect('mongodb://127.0.0.1/task-manager')
```
To use an environment variable instead:
```
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1/task-manager';
mongoose.connect(uri);
```
Then set `MONGODB_URI` in your `.env`.

## Security Considerations

- Keep `JWT_SECRET` private and long/random. Do not commit `.env`.
- Cookies are `httpOnly`; set `secure: true` in production over HTTPS.
- Validate and sanitize user input as needed.

## Troubleshooting

- MongoDB connection errors: ensure MongoDB is running and `config/db.js` points to a reachable URI.
- Login fails: verify the user exists and the password is correct. Ensure `JWT_SECRET` is defined.
- Views not rendering: confirm `app.set('view engine', 'ejs')` and templates exist in `views/`.

## License

ISC
