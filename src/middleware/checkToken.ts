const jwt = require("jsonwebtoken");

// Middleware function to check if a token exists and is not expired
module.exports.checkToken=(req, res, next)=> {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Unauthorized Request",status:401 });
  } else {
    try {
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.TOKEN_SECRET
      );
      req.tokenData = decoded; // Attach token data to the request object
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized Request" ,status:401});
    }
  }
}


