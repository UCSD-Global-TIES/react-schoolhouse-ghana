const bcrypt = require('bcryptjs');

export default {
    encryptPassword: (password) => {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(password, salt);
    }

}
