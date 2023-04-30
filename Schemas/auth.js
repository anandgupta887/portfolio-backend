const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  linkedIn: { type: String },
  github: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  about: { type: String },
  location: { type: String, required: true },
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  from: { type: Date, required: true },
  to: { type: Date },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectDescription: { type: String },
  link: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number },
});

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  education: { type: [educationSchema] },
  projects: { type: [projectSchema] },
  skills: { type: [skillSchema] },
  profile: { type: profileSchema },
  experience: { type: [experienceSchema] },
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
  Resume: mongoose.model("resume", resumeSchema),
};
