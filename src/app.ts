import express, { Express } from 'express';
import router from './routes/example';

const app: Express = express();

// Middleware
app.use(express.json());

// Router
app.use('/test', router);

export default app;
