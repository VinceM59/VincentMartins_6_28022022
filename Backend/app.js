const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

var username = "Vince";
var password = "baba";
var host = "cluster0.thdjl.mongodb.net";
var db = "p6";

mongoose
  .connect(
    "mongodb+srv://" +
      username +
      ":" +
      password +
      "@" +
      host +
      "/" +
      db +
      "?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

//Permet de protéger l'application de certaines vulnérabilités.
app.use(helmet({ crossOriginResourcePolicy: false }));
//Permet de nettoyer les données de l'utilisateur.
app.use(mongoSanitize());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
