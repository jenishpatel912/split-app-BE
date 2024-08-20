import { sendError } from "../utils/response.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization:Authorization } = req.headers;

    if (!Authorization || !Authorization.startsWith("Bearer ")) {
      return sendError(res, 401, "Unauthorized error");
    }
    const token = Authorization.replace("Bearer ", "");
    const userData = jwt.verify(token, process.env.SECRET_KEY);
    if (!userData) {
      return sendError(res, 401, "Invalid access token");
    }
    req.user = userData;
    next();
  } catch (err) {
    console.log(err.message);
    return sendError(res, 401, err.message);
  }
};
