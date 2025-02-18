const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../lib/jwt");

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    const staffData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/staffs.json"))
    );

    try {
      const user = staffData.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ message: "Login successful", accessToken });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = generateAccessToken({
        email: decoded.email,
        role: decoded.role,
      });
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  }

  async logout(req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
      res.json({ message: "Logout successful" });
    } catch (err) {
      res.status(403).json({ message: "Invalid refresh token" });
    }
  }
}

module.exports = AuthController;
