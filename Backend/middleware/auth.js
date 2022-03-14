//Vérifier les Tokens utilisateurs.
const jwt = require("jsonwebtoken");

//Vérification de la concordance d'authentification.
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valide";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Requête non valide!"),
    });
  }
};
