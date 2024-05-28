import userModel from "../modals/userModal.js";
import bcrypt, { hash } from "bcrypt";
import nodemailer from "nodemailer";
import { EmailVerificationHtml } from "../templates/otpTemplate.js";

export const signupController = async (req, res) => {
  console.log(req.body);

  try {
    const { fullName, age, phoneNumber, gender, email, password } = req.body;
    if (!fullName || !age || !phoneNumber || !gender || !email || !password) {
      res.json({
        message: "error required fields are missing",
        data: [],
        status: false,
      });
      return;
    }

    const hashPass = await bcrypt.hash(password, 10);

    const isEmail = await userModel.findOne({ email });
    if (isEmail) {
      return res.json({
        message: "Email already in use",
        data: [],
        status: false,
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    const userObj = {
      ...req.body,
      otp,
      password: hashPass,
    };

    // send otp using promise
    await SendOTP(email, otp);

    const userResponse = await userModel.create(userObj);
    res.json({
      message: "User Created successfully",
      data: userResponse,
      status: true,
    });
  } catch (error) {
    res.json({
      message: "error while adding Record",
      data: [],
      error: error.message,
      status: false,
    });
  }
};

export const otpVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.json({
        message: "Otp or email is missing",
        data: [],
        status: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (user.otp !== otp) {
      res.json({
        message: "error! invalid email or otp",
        data: [],
        status: false,
      });
    }
    // await userModel.findOneAndUpdate({ email }, { isVerified: true });
    user.isVerified = true;
    user.save();
    console.log("verified");
    res.json({
      message: "Otp verified successfully",
      data: user,
      status: true,
    });
  } catch (error) {
    res.json({
      message: "error while verifying otp",
      data: [],
      error: error.message,
      status: false,
    });
  }
};

export const loginController = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({
        message: "error required fields are missing",
        data: [],
        status: false,
      });
      return;
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        message: "Email or password is incorrect",
        data: [],
        status: false,
      });
    }

    const hashPass = await bcrypt.compare(password, user.password);

    res.json({
      message: "User Logged in successfully",
      data: user,
      status: true,
    });
  } catch (error) {
    res.json({
      message: "error while logging in",
      data: [],
      error: error.message,
      status: false,
    });
  }
};

const SendOTP = (email, otp) => {
  console.log(email);
  if (!email || !otp) {
    console.log("email or otp is missing");
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.otpFromEmail,
      pass: process.env.otpPassKey,
    },
  });
  console.log("transporrter", transporter);
  const response = transporter.sendMail({
    from: "process.env.otpFromEmail",
    to: email,
    subject: "Email Verfication",
    html: EmailVerificationHtml(otp),
  });
};
