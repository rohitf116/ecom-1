const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const secret = process.env.SECRET;

exports.isAuth = async (req, res, next) => {
  try {
    const { LOGIN_HASH } = req.cookies;
    const token = req.headers.authorization;
    console.log(req.headers);
    if (!token) {
      return res.status(401).json({ status: false, message: "Please login" });
    }
    const tokennWithout = token.split(" ")[1];

    const decoded = jwt.decode(tokennWithout);

    if (!tokennWithout || isNaN(decoded?.version)) {
      return res.status(401).json({
        status: false,
        message: "token should start with Bearer and token should be valid",
      });
    }
    jwt.verify(
      tokennWithout,
      secret + decoded.version || 1,
      (error, response) => {
        if (error) {
          return res
            .status(401)
            .json({ status: false, message: "Invalid tokens" });
        }
        req.user = response;
        next();
      }
    );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      status: false,
      message: "You are not authorised to access this page",
    });
  }
  next();
};
