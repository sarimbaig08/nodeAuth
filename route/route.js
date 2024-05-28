import express from "express";
import {
  signupController,
  loginController,
  otpVerification,
} from "../controller/authController.js";
const route = express.Router();

//Auth apis
route.post("/api/userSingup", signupController);
route.post("/api/userlogin", loginController);
//otp verification
route.post("/api/otpVerification", otpVerification);

export default route;
