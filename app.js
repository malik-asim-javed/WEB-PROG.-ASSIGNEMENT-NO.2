const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// === 1) MongoDB Connection ===
// replace <YOUR_URI> with your local URI (e.g. 'mongodb://localhost:27017/dailyPlanner')
// or your Atlas connection string
mongoose
  .connect("<YOUR_URI>", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === 2) Middleware & View Engine ===
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(express.static(path.join(__dirname, "public"))); // for CSS

// === 3) Mongoose Schema & Model ===
const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});
const Task = mongoose.model("Task", taskSchema);

// === 4) Routes ===
// GET home page – list tasks
app.get("/", async (req, res) => {
  const tasks = await Task.find().sort("dueDate");
  res.render("index", { tasks });
});

// POST add a task
app.post("/add", async (req, res) => {
  const { description, dueDate } = req.body;
  await Task.create({ description, dueDate: dueDate || null });
  res.redirect("/");
});

// POST delete a task
app.post("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// === 5) Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
