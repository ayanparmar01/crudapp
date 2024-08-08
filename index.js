var express = require("express");
var mongoose = require("mongoose");
var session = require("express-session");
var dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);
app.use(express.static("./uploads"))

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
app.set("view engine", "ejs");

app.use("", require("./routes/routes"));
const port = 4000;

app.listen(port, () => {
  console.log("server is ready");
});

mongoose
  .connect(
    "mongodb+srv://ayanparmar26:ayan123@cluster0.rwxq5vx.mongodb.net/demo?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("data base connected"))
  .catch((err) => console.log("Error:", err));
