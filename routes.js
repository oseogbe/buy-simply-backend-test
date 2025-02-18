const express = require("express");

const authenticate = require("./middlewares/authenticate");
const { isSuperAdmin } = require("./middlewares/authorize");

const LoanController = require("./controllers/loan.controller");
const AuthController = require("./controllers/auth.controller");

const router = express.Router();

const authController = new AuthController();
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

const loanController = new LoanController();
router.get("/loans", authenticate, loanController.getLoans);
router.get(
  "/loans/:userEmail/get",
  authenticate,
  loanController.getLoansByUserEmail
);
router.get("/loans/expired", authenticate, loanController.getExpiredLoans);
router.delete(
  "/loans/:loanId/delete",
  authenticate,
  isSuperAdmin,
  loanController.deleteLoanById
);

module.exports = router;
