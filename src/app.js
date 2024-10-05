const express = require("express");
const bodyParser = require("body-parser");
require("./db/mongoose");
const Admin = require("./models/Admin");
const User = require("./models/User");
const path = require("path");
const { emitWarning } = require("process");

const port = process.env.PORT || 4040;

const partialsPath = path.join(__dirname, "../public");

const app = express();

app.set("view engine", "hbs");
// allow request from any ip
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(partialsPath));

app.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // console.log(user);
    res.redirect(`/dashboard/${user._id}`);
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.render("signup");
});

app.get("/dashboard/:id", async (req, res) => {
  const _id = req.params.id;
  const user = await User.findById({ _id: _id });
  res.render("dashboard", {
    name: user.name,
    regNo: user.regNo, 
    email: user.email,
  });
  console.log(user);
});

app.post("/admin", async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save()
    // console.log(admin);
    res.redirect(`/lectdash/${admin._id}`);
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/lectdash/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const admin = await Admin.findById(_id);
    res.render('lectdash', {
        name: admin.name,
        email: admin.email
    })
  } catch (err) {
    res.status(500).send("Error finding user: " + err.message);
  }
});

app.get('/time-table', async (req, res) => {
    res.render('time-table')
})

app.get("/testing", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("server listening on port " + port);
});