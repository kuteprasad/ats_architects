import express, { application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import bodyParser from "body-parser";
import seedRoutes from "./routes/seedRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import googleRoutes from "./routes/googleRoutes.js";

dotenv.config();


// Suppress deprecation warnings
process.env.NODE_NO_WARNINGS = '1';

const app = express();
 const port = process.env.PORT ||3001 ;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/interviews", interviewRoutes);
app.use("/applications", applicationRoutes);
app.use("/seedDatabase", seedRoutes);
app.use('/google', googleRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.redirect('/dashboard');
});


// Server listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
