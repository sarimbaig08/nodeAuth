import express from "express";
import {
  signupController,
  loginController,
} from "../controller/authController.js";
const route = express.Router();

route.post("/api/userSingup", signupController);
route.post("/api/userlogin", loginController);

export default route;
