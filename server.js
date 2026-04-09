const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const SECRET = "evcaresecret";

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/evcare24");

// Models
const Booking = mongoose.model("Booking", {
  name: String,
  phone: String,
  service: String,
  problem: String,
  location: String
});

const Admin = mongoose.model("Admin", {
  username: String,
  password: String
});

// Create default admin (run once)
async function createAdmin() {
  const hash = await bcrypt.hash("1234", 10);
  await Admin.create({ username: "admin", password: hash });
}
// Uncomment first time only
// createAdmin();

// LOGIN API
app.post("/login", async (req, res) => {
  const user = await Admin.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Wrong password");

  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ token });
});

// Middleware
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

// Booking
app.post("/book", async (req, res) => {
  await new Booking(req.body).save();
  res.send("Saved");
});

// Protected route
app.get("/bookings", auth, async (req, res) => {
  const data = await Booking.find();
  res.json(data);
});

app.listen(3000, () => console.log("Server running"));
