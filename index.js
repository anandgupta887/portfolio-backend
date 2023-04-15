const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserAuth, Resume } = require("./Schemas/auth");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// MongoDB connection
mongoose.connect(process.env.USER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connection successful.");
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user.email;
    next();
  });
};

//signup
app.post("/auth/signup", async (req, res) => {
  const { name, email, password, username } = req.body;
  try {
    const existingUsername = await UserAuth.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists." });
    }
    const existingUser = await UserAuth.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserAuth({
      name,
      email,
      password: hashedPassword,
      username,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign({ email: savedUser.email }, "secret_key");
    res.status(201).json({ message: "User created successfully!", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

//login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserAuth.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign({ email: user.email }, "secret_key");
    res
      .status(200)
      .json({ name: user?.name, message: "Login successful.", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

//profiledata
app.post("/profiles", verifyToken, async (req, res) => {
  const { name, title, linkedIn, github, email, phone, image } = req.body;
  const userEmail = req.user;

  try {
    const user = await UserAuth.findOne({ email: userEmail });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = {
      name,
      title,
      linkedIn,
      github,
      email,
      phone,
      image,
      userId: user._id,
    };

    const resume = user.resume || new Resume({ userId: user._id });
    resume.profile = profile;

    await resume.save();

    return res.status(201).json({ message: "Profile created", profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//profiledata
app.post("/skills", verifyToken, async (req, res) => {
  const { name, title, linkedIn, github, email, phone, image } = req.body;
  const userEmail = req.user;

  try {
    const user = await UserAuth.findOne({ email: userEmail });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = {
      name,
      title,
      linkedIn,
      github,
      email,
      phone,
      image,
      userId: user._id,
    };

    const resume = user.resume || new Resume({ userId: user._id });
    resume.profile = profile;

    await resume.save();

    return res.status(201).json({ message: "Profile created", profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
