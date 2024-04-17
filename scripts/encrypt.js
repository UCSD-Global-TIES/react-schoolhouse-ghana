const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals
} = require('unique-names-generator');

module.exports = {

    encryptPassword: function (password) {
        // const saltRounds = 10;
        // const salt = bcrypt.genSaltSync(saltRounds);
        // return bcrypt.hashSync(password, salt);
        return password;
    },

    verifyPassword: function (password, hash) {
        // return bcrypt.compareSync(password, hash);
        return password === hash;
    },

    // console.log(verifyPassword("test", encryptPassword("test")));

    generatePassword: function (length, allowNum, allowSymbol) {
        return generator.generate({
            length: length,
            numbers: allowNum !== undefined ? allowNum : false,
            symbols: allowSymbol !== undefined ? allowSymbol : false
        });
    },

    generateAccounts: function (num, u_len, p_len) {
        const generatePasswords = (num, length, allowNum, allowSymbol) => {
            return generator.generateMultiple(num, {
                length: length,
                numbers: allowNum !== undefined ? allowNum : false,
                symbols: allowSymbol !== undefined ? allowSymbol : false
            });
        }

        // console.log(generatePasswords(15, 3));

        const generateUsernames = (num, length) => {
            let usernames = [];
            for (let i = 0; i < num; i++) {
                usernames.push(uniqueNamesGenerator({
                    dictionaries: [adjectives, animals, colors],
                    length: length
                }));
            }

            return usernames;
        }

        // console.log(generateUsernames(15, 3));

        const ALLOW_NUM = true;
        const ALLOW_SYMBOLS = false;
        let accounts = [];
        const usernames = generateUsernames(num, u_len);
        const passwords = generatePasswords(num, p_len, ALLOW_NUM, ALLOW_SYMBOLS);

        for (let i = 0; i < num; i++) {
            accounts.push({
                username: usernames[i],
                password: passwords[i]
            });
        }

        return accounts;

    }
}
