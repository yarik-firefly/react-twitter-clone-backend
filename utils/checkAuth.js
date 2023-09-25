import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.userId = decoded.data;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Токен не прочитан!",
      });
    }
  } else {
    return res.status(403).json({
      status: "error",
      message: "Нет доступа!",
    });
  }
};
