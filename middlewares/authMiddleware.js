const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Read authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with Bearer
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // extract token

    if (!token) {
      console.log("Token missing from header");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
      // Verify token
      if (!process.env.JWT_SECRET) {
        console.error("FATAL: JWT_SECRET is not defined!");
        return res.status(500).json({ message: "Server configuration error" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token Verified Successfully. User:", decoded.username);

      // Attach decoded user to request
      req.user = decoded;
      console.log("Decoded user:", req.user);

      next(); // Continue to next middleware/controller

    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    // If no Authorization header
    console.log("Authorization header missing. Received:", req.headers);
    return res.status(401).json({ message: "Authorization header missing" });
  }
};


module.exports = verifyToken;
