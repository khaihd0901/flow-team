import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

//REGISTER
export const register = async (req, res) => {
  try {
    const { username, password, confirmPassword, firstName, lastName, email } =
      req.body;

    if (
      !username ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !email
    ) {
      return res.status(400).json({ message: "All Field Are Required !!!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords Do Not Match !!!" });
    }

    const duplicate = await User.findOne({ username });

    if (duplicate) return res.status(409).json({ message: "User Exited !!!" });

    const hashedPassword = await bcrypt.hash(password, 10); //salt = 10

    await User.create({
      username,
      hashedPassword,
      email,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
    });
    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !!!" });
  }
};

//LOGIN
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing Email or Password !!!" });
    }
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password !!!" });
    }
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password !!!" });
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    const refreshToken = crypto.randomBytes(64).toString("hex");
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    res
      .status(200)
      .json({ message: "User logged in successfully", accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//LOGOUT
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(400).json({ message: "No refresh token found" });
    }
    await Session.deleteOne({ refreshToken: token });
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    (console.log(err),
      res.status(500).json({ message: "Internal Server Error" }));
  }
};

//REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(400).json({ message: "No refresh token found" });
    }
    const session = await Session.findOne({ refreshToken: token });
    if (session?.expiresAt < new Date()) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    res.status(200).json({ accessToken });
  } catch (err) {
    (console.log(err),
      res.status(500).json({ message: "Internal Server Error" }));
  }
};
