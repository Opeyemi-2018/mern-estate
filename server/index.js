import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import listingRoute from "./routes/listingRoute.js";
import favoriteRoute from "./routes/favoriteListingRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000!");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

app.use(express.json());

app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);
app.use("/api/favorite", favoriteRoute);
app.use("/api/message", messageRoute);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
