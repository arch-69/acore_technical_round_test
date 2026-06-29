import express from 'express';
import cors from 'cors';
import { config } from './config/server.config.js';
import connectDB from './config/db.config.js';
import auth from './middlewares/auth.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import * as authController from './controller/auth.controller.js';
import * as todoController from './controller/todo.controller.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).send('server is running perfectly');
});

app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);

app.get('/api/todos', auth, todoController.list);
app.post('/api/todos', auth, todoController.create);
app.get('/api/todos/:id', auth, todoController.getById);
app.put('/api/todos/:id', auth, todoController.update);
app.patch('/api/todos/:id', auth, todoController.update);
app.delete('/api/todos/:id', auth, todoController.remove);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`server running on ${config.port}`);
  });
});
