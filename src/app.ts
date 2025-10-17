import express, { Express } from 'express';
import router from './routes/authRoute';

const app: Express = express();

// Middleware
app.use(express.json());

// Router
app.use('/auth', router);

export default app;
