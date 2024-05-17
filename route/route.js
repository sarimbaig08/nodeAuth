import express from "express";
import { signupController } from "../controller/authController.js";
const route = express.Router();

route.post("/api/postdata", signupController);

export default route;
