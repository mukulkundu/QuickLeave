import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import leaveRoutes from "./routes/leave.routes";
import calendarRoutes from './routes/calender.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QuickLeave API running 🚀");
});

// Health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// routes
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/leave", leaveRoutes);
app.use("/calendar", calendarRoutes);




export default app;