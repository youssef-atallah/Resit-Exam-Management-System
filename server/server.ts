import express from 'express';
import {  RequestMiddleware } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';
dotenv.config();

// Import route files
import studentRoutes from './routes/studentRoutes';
import instructorRoutes from './routes/instructorRoutes';
import courseRoutes from './routes/courseRoutes';
import secretaryRoutes from './routes/secretaryRoutes';
import authRoutes from './routes/authRoutes';
import path from 'path';
import { initializeDb } from './datastore';

(async () => {
  await initializeDb();

    
  const app = express();

  // frontend files  
  // serve static files from the web directory
  // web directory is in the root directory
  app.use(express.static(path.join(__dirname, '../web')));

  // Middleware
  app.use(express.json());
  app.use(RequestMiddleware);

  // Use route files
  app.use('/auth', authRoutes);
  app.use('/', studentRoutes);
  app.use('/', instructorRoutes);
  app.use('/', courseRoutes);
  app.use('/', secretaryRoutes);

  // general error handler for all errors
  app.use(errorHandler);

  const port =  3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
    console.log(`go to : http://localhost:3000/index.html`); 
    
  }); 

})();