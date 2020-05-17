module.exports = class User {
    clientId;
    email;
    password;

    constructor(clientId, email, password) {
        this.clientId = clientId;
        this.email = email;
        this.password = password;
    }
};