let userService = (() => {

    function registerUser(context) {
        let username = context.params.username;
        let email = context.params.email;
        let password = context.params.password;
        let repeatPass = context.params.repeatPassword;

        if (!utils.validateUsername(username)) {
            auth.showError('Username should be at least 3 symbols long.');
            return;
        }

        if (!utils.validatePassword(password)) {
            utils.handleError('Password should be at least 6 symbols long.');
            return;
        }

        if (password !== repeatPass) {
            utils.handleError('Passwords should match.');
            return;
        }

        auth.register(username, password, email)
            .then(function (userInfo) {
                auth.saveSession(userInfo);
                auth.showInfo('User registration successful.');

                // displayCatalog(context);
                ctx.redirect('#/home');
            }).catch(utils.handleError)
    }

    return {
        registerUser
    }
})();
