export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    const userRoles = req.user.user.role;
    const isAllowed = roles.some((role) => userRoles.includes(role));
    console.log(isAllowed);

    if (!isAllowed)
      return res.status(400).json({
        success: false,
        message: "Not AUTHORIZED TO DO THIS FUNCTION",
      });

    return next();
  };
};
