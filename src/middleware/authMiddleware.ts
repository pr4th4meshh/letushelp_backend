import admin from "../firebaseAdmin";

export const authMiddleware = async (req: any, res: any, next: any)=> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       res.status(403).json({ message: "Unauthorized: No token provided" })
       return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(403).json({ message: "Invalid token format" })
      return;
    }

    // Verify token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next(); // move ahead to the next middleware/route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Unauthorized" });
  }
};