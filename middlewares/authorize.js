const isSuperAdmin = (req, res, next) => {
  if (req.user.role === "superAdmin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Forbidden: Super Admin access required" });
  }
};

module.exports = { isSuperAdmin };
