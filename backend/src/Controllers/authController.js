import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

const createAuthTokens = async (user, res) => {
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
    secure: false,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_TTL,
  });

  return accessToken;
};

//REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, firstName, lastName } = req.body;

    if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
      return res.status(400).json({ message: "All Field Are Required !!!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords Do Not Match !!!" });
    }

    const duplicate = await User.findOne({ $or: [{ email }, { username }] });

    if (duplicate)
      return res.status(409).json({ message: "User Already Exists !!!" });

    const hashedPassword = await bcrypt.hash(password, 10); //salt = 10

    await User.create({
      username,
      email,
      hashedPassword,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      providers: [
    {
      type: "local",
      providerId: email, // or user._id later
    },
  ],
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
    if (!user.hashedPassword) {
  return res.status(400).json({
    message: "Please login with GitHub/Google",
  });
}
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password !!!" });
    }
    const accessToken = await createAuthTokens(user, res);
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

//GITHUB OAUTH
export const authGitHub = async (req, res) => {
  try {
    const redirectUri = "http://localhost:5001/api/auth/github/callback";
    const clientId = process.env.GITHUB_CLIENT_ID;

    const state = crypto.randomBytes(16).toString("hex");

    res.cookie("oauth_state", state, { httpOnly: true });

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${state}`;
    res.redirect(url);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authGithubCallback = async (req, res) => {
  const code = req.query.code;

  try {
    if (req.query.state !== req.cookies.oauth_state) {
      return res.status(403).send("Invalid state");
    }
    // 1. Get access token from GitHub
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );
    if (!tokenRes.data.access_token) {
      return res.status(400).json({
        message: "Failed to get access token",
        error: tokenRes.data,
      });
    }
    const githubAccessToken = tokenRes.data.access_token;

    // 2. Get user info from GitHub
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    let email = emailRes.data.find((e) => e.primary && e.verified)?.email;

    if (!email) {
      email = `${userRes.data.id}@github.local`; 
    }
    const githubId = userRes.data.id;

// 1. Try find user by providerId
let user = await User.findOne({
  providers: {
    $elemMatch: {
      type: "github",
      providerId: githubId,
    },
  },
});

// 2. If not found → try find by email (account linking)
if (!user) {
  user = await User.findOne({ email });

  if (user) {
    // 🔗 Link GitHub to existing account
    user.providers.push({
      type: "github",
      providerId: githubId,
    });

    await user.save();
  }
}

// 3. If still not found → create new user
if (!user) {
  // split name safely
  let firstName = "";
  let lastName = "";

  if (userRes.data.name) {
    const parts = userRes.data.name.split(" ");
    firstName = parts[0];
    lastName = parts.slice(1).join(" ");
  }

  user = await User.create({
    email,
    username: userRes.data.login,
    firstName,
    lastName,
    fullName: userRes.data.name || userRes.data.login,
    avatarUrl: userRes.data.avatar_url,
    providers: [
      {
        type: "github",
        providerId: githubId,
      },
    ],
  });
}

    // 4. Create tokens
    const accessToken = await createAuthTokens(user, res);

    // 5. Redirect to frontend with token
    res.redirect(
      `http://localhost:5173/`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("GitHub Auth failed");
  }
};
