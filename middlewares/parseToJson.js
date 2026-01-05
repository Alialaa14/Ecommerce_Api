export const parseVariant = (req, res, next) => {
  if (req.body.variant && typeof req.body.variant === "string") {
    try {
      req.body.variant = JSON.parse(req.body.variant);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid variant JSON",
      });
    }
  }
  next();
};
