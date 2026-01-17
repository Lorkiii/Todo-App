import express from "express";
import Users from "../../models/users.js";
import bcrypt from "bcryptjs";

export default function signUp() {
  const router = express.Router();

  router.post("/signup", async (req, res) => {
    try {
      const { firstName, middleInitial, lastName, email, password } = req.body;
      //validate input
      if (
        !firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
      // Check if user already exists
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create new user
      const newUser = new Users({
        firstName,
        middleInitial: req.body.middleInitial || "",
        lastName,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      // Respond with success
      res.status(201).json({
        message: "User created successfully",
        userId: newUser._id,
      });
      // Handle errors
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: "Error signing up user" });
    }
  });
  return router;
}
