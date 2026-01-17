import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './mongodbConfig.js';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// routes
import signUp from './routes/signUp.js';
import logIn from './routes/logIn.js';
import tasks from './routes/tasks.js';
import auth from './routes/auth.js';
import logout from './routes/logout.js';
import addTask from './routes/addTask.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
connectDB();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:3000", "http://localhost:5500"],
    credentials: true,
  })
);

// Use routes
app.use('/api/signup', signUp()); // for signup
app.use('/api/login', logIn()); // for login
app.use('/api/tasks', tasks()); // for tasks
app.use('/api/auth', auth()); // for auth verification
app.use('/api/logout', logout()); // for logout
app.use('/api/addtask', addTask()); // for adding tasks

// Landing page route
app.get('/', (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, 'todo', 'landing', 'index.html'));
});

// Static routes for specific folders
app.use('/landing', express.static(path.join(PROJECT_ROOT, 'todo', 'landing')));
app.use('/login', express.static(path.join(PROJECT_ROOT, 'todo', 'login')));
app.use('/main', express.static(path.join(PROJECT_ROOT, 'todo', 'main'))); 
// Note: /dashboard is handled by specific route below, not static

// Serve specific HTML files for clean URLs
app.get('/login', (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, 'todo', 'login', 'index.html'));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, 'todo', 'main', 'app.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});