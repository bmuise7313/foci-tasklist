import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import cors from 'cors'; // Import the cors package

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors()); // Add this line

// Task model interface
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

// Helper function to read data from the JSON file
const readData = (): Task[] => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data) as Task[];
};

// Helper function to write data to the JSON file
const writeData = (data: Task[]) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// CRUD Endpoints

// Get all tasks
app.get('/tasks', (req, res) => {
  const tasks = readData();
  res.json(tasks);
});

// Get a single task by ID
app.get('/tasks/:id', (req, res) => {
  const tasks = readData();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(task);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTask: Task = {
    id: Date.now().toString(),
    title,
    description,
    dueDate,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };

  const tasks = readData();
  tasks.push(newTask);
  writeData(tasks);

  return res.status(201).json(newTask);
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const { title, description, dueDate, isCompleted } = req.body;
  const tasks = readData();
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    title: title ?? tasks[taskIndex].title,
    description: description ?? tasks[taskIndex].description,
    dueDate: dueDate ?? tasks[taskIndex].dueDate,
    isCompleted: isCompleted ?? tasks[taskIndex].isCompleted,
  };

  tasks[taskIndex] = updatedTask;
  writeData(tasks);

  return res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
  const tasks = readData();
  const filteredTasks = tasks.filter((t) => t.id !== req.params.id);

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ message: 'Task not found' });
  }

  writeData(filteredTasks);
  return res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});