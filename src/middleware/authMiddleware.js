import admin from "../firebaseAdmin";

export const authMiddleware = async (req, res, next)=> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
       res.status(403).json({ message: "No token provided" })
       return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(403).json({ message: "Invalid token format" })
      return;
    }

    // Verify token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("DECODED_TOKEN", decodedToken)
    req.user = decodedToken;
    console.log("REQ_USER", req.user.uid)

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Unauthorized" });
  }
};