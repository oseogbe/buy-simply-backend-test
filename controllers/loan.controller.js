const fs = require("fs");
const path = require("path");

class LoanController {
  getLoans(req, res) {
    const { status } = req.query;

    let loansData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/loans.json"))
    );

    if (status) {
      loansData = loansData.filter((loan) => loan.status === status);
    }

    if (req.user.role !== "admin" && req.user.role !== "superAdmin") {
      loansData = loansData.map((loan) => {
        const { totalLoan, ...rest } = loan.applicant;
        return { ...loan, applicant: rest };
      });
    }

    res.json({
      success: true,
      data: loansData,
    });
  }

  getLoansByUserEmail(req, res) {
    const { userEmail } = req.params;

    const loansData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/loans.json"))
    );

    const userLoans = loansData.filter(
      (loan) => loan.applicant.email === userEmail
    );

    if (userLoans.length === 0) {
      return res.json({ loans: [] });
    }

    res.json({
      success: true,
      data: userLoans,
    });
  }

  getExpiredLoans(req, res) {
    const loansData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/loans.json"))
    );

    const expiredLoans = loansData.filter(
      (loan) => new Date(loan.maturityDate) < new Date()
    );

    res.json({
      success: true,
      data: expiredLoans,
    });
  }

  deleteLoanById(req, res) {
    const { loanId } = req.params;

    const loansData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/loans.json"))
    );

    const loanIndex = loansData.findIndex((loan) => loan.id === loanId);

    if (loanIndex === -1) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loansData.splice(loanIndex, 1);

    fs.writeFileSync(
      path.join(__dirname, "../data/loans.json"),
      JSON.stringify(loansData, null, 2)
    );

    res.json({
      success: true,
      message: "Loan deleted",
    });
  }
}

module.exports = LoanController;
