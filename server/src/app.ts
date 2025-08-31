import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QuickLeave API running 🚀");
});

// routes
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);




export default app;