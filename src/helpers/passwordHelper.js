const BCrypt = require('bcrypt');
const { promisify } = require('util');

const hashAsync = promisify(BCrypt.hash);
const compareAsync = promisify(BCrypt.compare);
const SALT = parseInt(process.env.SALT_PWD);

class PasswordHelper {
    static hashPassword(pass) {
        return hashAsync(pass, SALT);
    }

    static comparePassword(pass, hash) {
        return compareAsync(pass, hash);
    }
}


module.exports = PasswordHelper;