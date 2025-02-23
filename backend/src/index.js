import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { app, server } from "./lib/socket.js";
dotenv.config({ path: `${process.cwd()}/.env` });
const __dirname = path.resolve();
const startServer = async () => {
  try {
    await connectDB(); // Wait for DB to connect

    app.use(
      cors({
        origin: `${process.env.CLIENT_URL}`,
        credentials: true,
      })
    );

    // Middleware
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/messages", messageRoutes);

    //route not found
    app.use(async (req, res, next) => {
      next(createError.NotFound());
    });

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../frontend/dist")));

      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
      });
    }

    //error middleware
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });

    // Start Server
    server.listen(process.env.PORT, () => {
      console.log(`Server listening on PORT: ${process.env.PORT || 6000}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit process on failure
  }
};

startServer();
