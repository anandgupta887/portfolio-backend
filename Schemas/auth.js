const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  link: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true },
});

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  education: { type: [educationSchema] },
  projects: { type: [projectSchema] },
  skills: { type: [skillSchema] },
});

const userAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  resume: { type: resumeSchema },
});

module.exports = {
  UserAuth: mongoose.model("users", userAuthSchema),
  Resume: mongoose.model("Resume", resumeSchema),
};
