const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { User } = require("../Schemas/auth");

// const JWT_SECRET = 'secret';

// // Google login
// const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// app.post('/auth/google', async (req, res) => {
//   try {
//     const ticket = await googleClient.verifyIdToken({
//       idToken: req.body.tokenId,
//       audience: GOOGLE_CLIENT_ID
//     });
//     const payload = ticket.getPayload();
//     const email = payload.email;
//     const name = payload.name;
//     const googleId = payload.sub;

//     let user = await User.findOne({ email });
//     if (!user) {
//       // Create new user
//       user = new User({ name, email, googleId });
//       await user.save();
//     }

//     const token = jwt.sign({ _id: user._id }, JWT_SECRET);

//     res.send({ token });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// Signup
exports.signup = (req, res) => {
  try {
    const { name, email } = req.body;
    const hashedPassword = bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    user.save();
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});
