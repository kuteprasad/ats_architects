import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Server listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

