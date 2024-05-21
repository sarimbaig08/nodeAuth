import express from "express";
import mongoose from "mongoose";
import route from "./route/route.js";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => console.log("mongodb connect"))
  .catch((err) => console.log("mongo err", err.message));

app.use(route);

app.listen(PORT, () => console.log("server running of port 5000"));
