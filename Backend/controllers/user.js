//Création modules pour le cryptage et la sécurité des données
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const emailValidator = require("email-validator");

const User = require("../models/user");

//Configuration modèle du password.
const schema = new passwordValidator();
schema
  .is()
  .min(3)
  .is()
  .max(50)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1)
  .has()
  .not()
  .spaces();

//Création du compte client avec cryptage.
exports.signup = (req, res, next) => {
  if (!emailValidator.validate(req.body.email)) {
    //si l'email n'est pas valide alors.
    return res
      .status(401)
      .json({ message: "Veuillez entrer une adresse email valide" });
  }

  if (!schema.validate(req.body.password)) {
    //Si le password n'est pas valide au schema.
    return res.status(401).json({
      message:
        "Le mot de passe doit avoir une longueur de 3 a 50 caractères avec au moins un chiffre, une minuscule, une majuscule et ne possédant pas d'espace !!!",
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connexion compte client à l'aide du Token.
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
