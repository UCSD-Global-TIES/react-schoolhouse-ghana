const accountDb = require("../models/Account");

module.exports = {
    addAccount: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {
                    // Create document in Student/Teacher/Admin collection

                    // Create document in Account collection

                }
            })
    },
    updateAccount: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {}
            })
    },
    deleteAccount: function (req, res) {
        verifyKey(req.header('Authorization'))
            .then((isVerified) => {
                if (isVerified) {

                    // Delete document in Student/Teacher/Admin collection

                    // Delete References in Announcement/Class collections

                    // Delete document in Account collection

                }
            })
    }
}