let userService = (() => {

    function registerUser(context) {
        let username = context.params.username;
        let email = context.params.email;
        let password = context.params.password;
        let repeatPass = context.params.repeatPassword;
        auth.getUser(context);

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

                utils.displayHome(context);
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

    function getProfilePage(context) {
        let userId = context.params.id.substr(1);
        getUser(userId).then(function (userInfo) {
            context.username = userInfo.username;
            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                profile: '../html/profile/profile.hbs'
            }).then(function () {
                this.partial('../html/profile/profilePage.hbs');
            });
        }).catch(auth.handleError);
    }

    function getUser(userId) {
        return requester.get('user', userId, 'kinvey');
    }

    return {
        registerUser,
        loginUser,
        getProfilePage
    }
})();
