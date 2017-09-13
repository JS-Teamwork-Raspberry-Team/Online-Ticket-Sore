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

        context.email = sessionStorage.getItem('email');
        context.isAdmin = sessionStorage.getItem('isAdmin');
        context.basket = sessionStorage.getItem('basket');
        context.firstName = sessionStorage.getItem('firstName');
        context.middleName = sessionStorage.getItem('middleName');
        context.lastName = sessionStorage.getItem('lastName');
        context.address = sessionStorage.getItem('address');
        context.phone = sessionStorage.getItem('phone');

        getUser(userId).then(function (userInfo) {
            context.username = userInfo.username;
            context.id = sessionStorage.getItem('id');
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

    function updateEditUser(userId, email, firstName, middleName, lastName, address, phone) {
        let updatedUserObj = {
            email,
            firstName,
            middleName,
            lastName,
            address,
            phone
        };

        return requester.update('user', `${userId}`, 'kinvey', updatedUserObj);
    }

    return {
        registerUser,
        loginUser,
        getProfilePage,
        updateEditUser
    }
})();
