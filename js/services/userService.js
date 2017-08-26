let userService = (() => {

    function registerUser(context) {
        let username = context.params.username;
        let email = context.params.email;
        let password = context.params.password;
        let repeatPass = context.params.repeatPassword;

        if (!utils.validateUsername(username)) {
            utils.showError('Username should be at least 3 symbols long.');
            return;
        }

        if (!utils.validateEmail(email)) {
            utils.showError('Invalid email.');
            return;
        }

        if (!utils.validatePassword(password)) {
            utils.showError('Password should be at least 6 symbols long.');
            return;
        }

        if (password !== repeatPass) {
            utils.showError('Passwords should match.');
            return;
        }

        auth.register(username, password, email)
            .then(function (userInfo) {
                auth.saveSession(userInfo);
                utils.showInfo('User registration successful.');

                context.redirect('#/home');
            }).catch(auth.handleError)
    }

    function loginUser(context) {
        let username = context.params.username;
        let password = context.params.password;

        if(!utils.validateUsername(username)){
            utils.showError('Username should be at least 3 symbols long.');
            return;
        }

        if(!utils.validatePassword(password)){
            utils.showError('Password should be at least 6 symbols long.');
            return;
        }

        auth.login(username, password)
            .then(function (userInfo) {
                auth.saveSession(userInfo);
                utils.showInfo('Login successful.');

                utils.displayHome(context);
            }).catch(auth.handleError);
    }

    return {
        registerUser,
        loginUser
    }
})();
