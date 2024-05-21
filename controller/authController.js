import userModel from "../modals/userModal.js";
import bcrypt, { hash } from "bcrypt";

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
    const userObj = {
      ...req.body,
      password: hashPass,
    };
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
