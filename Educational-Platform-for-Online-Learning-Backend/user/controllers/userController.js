const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Token = require("../models/Token");

const {
  isValidEmail,
  validatePhoneNumber,
} = require("../utils/commonFunctions");

//create new user
const createUser = async (req, res) => {
  const { fullName, email, password, role, contact } = req.body;
  try {
    if (!fullName || !email || !password || !role || !contact) {
      return res.status(422).json({
        success: false,
        message: "Missing required fields. Please fill all the fields",
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format. Please enter a valid email",
      });
    }
    if (!validatePhoneNumber(contact)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid contact number format. Please enter a valid contact number",
      });
    }
    if (password.length < 8) {
      return res.status(422).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Regex patterns for password complexity
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const regexNumber = /\d/;

    if (!regexUpperCase.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!regexLowerCase.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one lowercase letter",
      });
    }

    if (!regexSpecialChar.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one special character",
      });
    }

    if (!regexNumber.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one number",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      contact,
    });
    await user.save();
    if (user) {
      if (role === "student") {
        const token = new Token({
          userId: user.id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        await token.save();
        const link = `http://localhost:4000/email-verification/${token.token}`;
        await verifyEmail(email, link);
        res.status(201).json({
          success: true,
          message:
            "New user created. Please check your email for verification.",
          data: user,
        });
      } else {
        res.status(201).json({
          success: true,
          message: "New user created.",
          data: user,
        });
      }
    } else {
      logger.error("User data not valid during registration");
      res.status(400).json({ success: false, error: "User data not valid" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Error in creating user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.status(422).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const regexNumber = /\d/;
    if (!regexUpperCase.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one uppercase letter",
      });
    }
    if (!regexLowerCase.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one lowercase letter",
      });
    }
    if (!regexSpecialChar.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one special character",
      });
    }
    if (!regexNumber.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one number",
      });
    }
    const user = await User.findOne({ email });
    if (user.role === "student" && !user.verified) {
      return res.status(401).json({
        success: false,
        message: "You need to verify your email before logging in",
      });
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    logger.error("Error while logging in:", error);
    return res.status(500).json({
      success: false,
      error,
      message: "Error while logging in",
    });
  }
};

//controller to update user
const updateUser = async (req, res) => {
  try {
    const { fullName, email, password, role, contact } = req.body;
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    if (email != user.email) {
      return res.status(404).json({
        success: false,
        message: "Email cannot be changed",
      });
    }
    if (!validatePhoneNumber(contact)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid contact number format. Please enter a valid contact number",
      });
    }
    if (password.length < 8) {
      return res.status(422).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    // Regex patterns for password complexity
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const regexNumber = /\d/;

    if (!regexUpperCase.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!regexLowerCase.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one lowercase letter",
      });
    }

    if (!regexSpecialChar.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one special character",
      });
    }
    if (!regexNumber.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Password must contain at least one number",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        password: hashedPassword,
        role,
        contact,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    logger.error("Error while updating User:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating User",
    });
  }
};

//controller to delete a user by id
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting Student:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in deleting student",
    });
  }
};

//controller to get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.status(200).json({
      success: true,
      message: "All Students List",
      students,
    });
  } catch (error) {
    logger.error("Error while getting all students:", error);
    res.status(500).json({
      success: false,
      error,
      message: "Error while getting all Students",
    });
  }
};

//controller to get all instructors
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" });
    res.status(200).json({
      success: true,
      message: "All Instructors List",
      instructors,
    });
  } catch (error) {
    logger.error("Error while getting all Instructors:", error);
    res.status(500).json({
      success: false,
      error,
      message: "Error while getting all Instructors",
    });
  }
};

//controller to get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({
      success: true,
      message: "All Admins List",
      admins,
    });
  } catch (error) {
    logger.error("Error while getting all Admins:", error);
    res.status(500).json({
      success: false,
      error,
      message: "Error while getting all Admins",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Retrieved user by id",
      user,
    });
  } catch (error) {
    logger.error("Error while getting user by Id:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while getting user by Id",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const accessToken = jwt.sign(
    {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  var resetUrl;
  if (user.role === "student") {
    resetUrl = `http://localhost:4000/reset-password/${user.id}/${accessToken}`;
  } else {
    resetUrl = `http://localhost:3000/reset-password/${user.id}/${accessToken}`;
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Reset your password",
    text: "Welcome",
    html: `<p>Dear user,</p>
         <p>To reset your password, please click on the following link:</p>
         <p><a href="${resetUrl}">Reset Password</a></p>
         <p>If you did not request a password reset, please ignore this email.</p>
         <p>Sincerely,<br/>The Administrator</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error while sending email",
      });
    } else {
      logger.error("Email sent: " + info.response);
      res.status(200).json({
        success: true,
        message: "Email sent successfully",
      });
    }
  });
};

const changePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
        message: "Error with token",
      });
    }
    try {
      // Regex patterns for password complexity
      const regexUpperCase = /[A-Z]/;
      const regexLowerCase = /[a-z]/;
      const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
      const regexNumber = /\d/;

      if (!regexUpperCase.test(password)) {
        return res.status(422).json({
          success: false,
          message: "Password must contain at least one uppercase letter",
        });
      }

      if (!regexLowerCase.test(password)) {
        return res.status(422).json({
          success: false,
          message: "Password must contain at least one lowercase letter",
        });
      }

      if (!regexSpecialChar.test(password)) {
        return res.status(422).json({
          success: false,
          message: "Password must contain at least one special character",
        });
      }

      if (!regexNumber.test(password)) {
        return res.status(422).json({
          success: false,
          message: "Password must contain at least one number",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

const verifyEmail = async (email, link) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Account Verification",
      text: "Welcome",
      html: `
      <div>
      <a href="${link}">Click here to activate your account</a>
      </div>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error while sending email:", error.message);
        res.status(500).json({
          success: false,
          error: error.message,
          message: "Error while sending email",
        });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({
          success: true,
          message: "Email sent successfully",
        });
      }
    });
  } catch (error) {
    console.error("Error while sending email:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while sending email",
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Received token:", token);

    // Find the user token
    const userToken = await Token.findOne({ token: token });
    console.log("User token found:", userToken);

    if (!userToken) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    // Update user's verified status
    const updatedUser = await User.updateOne(
      { _id: userToken.userId },
      { $set: { verified: true } }
    );

    console.log("Updated user:", updatedUser);

    if (updatedUser.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or already verified",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified",
    });
  } catch (error) {
    logger.error("Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while confirming user",
    });
  }
};

const addInstructor = async (req, res) => {
  try {
    const { fullName, email, password, contact } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const newInstructor = new User({
      fullName,
      email,
      password,
      role: "instructor",
      contact,
    });

    await newInstructor.save();
    res
      .status(201)
      .json({ success: true, message: "Instructor added successfully" });
  } catch (error) {
    console.error("Error adding instructor:", error);
    res.status(500).json({ success: false, error: "Error adding instructor" });
  }
};

const checkUserRole = (req, res) => {
  const role = req.params.role;
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({
      success: false,
      error: "User is not authorized to access this resource",
    });
  }
  return res.status(200).json({ success: true, message: "User is authorized" });
};

module.exports = {
  createUser,
  loginUser,
  deleteUser,
  getAllStudents,
  getAllInstructors,
  getAllAdmins,
  updateUser,
  getUserById,
  forgotPassword,
  changePassword,
  verifyUser,
  addInstructor,
  checkUserRole,
};
