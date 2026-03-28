import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  // 1. Get data from request body
  const { name, email, password, businessName, businessPhone } = req.body;
  // 2. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use." });
  }

  // 3. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // 4. Create the user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    businessName,
    businessPhone,
  });
  // 5. Create a token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // 6. Send back the token
  res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const returnUser = await User.findOne({ email });
  if (!returnUser) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, returnUser.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ id: returnUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({ token });
});
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json(user);
});

export default router;
