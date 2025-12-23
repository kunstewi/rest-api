import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import connectDB from "./db/db";
import http from "http";
import "dotenv/config";
import router from "./router/router";

// Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World! REST API is running.");
});

// API routes
app.use("/", router());

const server = http.createServer(app);

(async () => {
  await connectDB(MONGO_URI); // wait for DB connection
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
