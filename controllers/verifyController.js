const accountDb = require("../models/Account");
const {
    verifyPassword
} = require("../scripts/encrypt");

module.exports = {
    // https://stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
    verifyAccount: function (req, res) {
        // Find account document with matching username
        const {
            username,
            password
        } = JSON.parse(req.header('Authorization'));
        accountDb
            .findOne({
                username
            })
            .populate('profile')
            .then((account) => {
                // If an account with the provided username is found
                if(account) {
                    // If passwords match, return populated document
                    if (verifyPassword(password, account.password)) {
                        // Set session user cookie (in login)
                        req.session.user = {
                            type: account.type,
                            profile: account.profile,
                            key: account._id
                        };
    
                        // API KEY SHOULD NOT BE ACCOUNT _id (future feature)
                        res.json({
                            type: account.type,
                            profile: account.profile,
                            key: account._id
                        });
                    } else {
                        res.json(null);
                    }
                } 
                // If an account with the provided username is NOT found
                else {
                    res.json(null)
                }

            })
    }, // ~ 100 ms

    verifySession: function (req, res) {
        if (req.session.user && req.cookies.user_sid) res.json(req.session.user);
        else res.json(null);
    }, // ~ 0.5 - 1.5 ms
    destroySession: function (req, res) {
        if (req.session.user && req.cookies.user_sid) {
            res.clearCookie('user_sid');
        }
        res.json(null);
    }, // ~ 0.5 ms
    verifyKey: function (key, access_type) {
        const types = access_type.split(",");

        return new Promise((resolve, reject) => {
            // API KEY SHOULD NOT BE ACCOUNT _id (future feature)
            accountDb
                .findOne({
                    _id: key
                })
                .then((account) => {
                    resolve(types.includes(account.type));
                })
        })
    }
}