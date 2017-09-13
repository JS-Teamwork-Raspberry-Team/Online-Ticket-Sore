$(() => {
    Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/register', function (context) {
            this.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                registerForm: '../html/register/registerForm.hbs'
            }).then(function () {
                this.partial('../html/register/registerPage.hbs')
            })
        });
        this.post('#/register', userService.registerUser);

        this.get('#/login', function (context) {
            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                loginForm: '../html/login/loginForm.hbs'
            }).then(function () {
                this.partial('../html/login/loginPage.hbs');
            });
        });
        this.post('#/login', userService.loginUser);

        // LOGOUT
        this.get('#/logout', function (context) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    utils.showInfo('Logout successful.');

                    context.redirect('#/home');
                }).catch(auth.handleError);
        });

        this.get('#/profile/:id', userService.getProfilePage);

        // UPDATE USER PROFILE
        this.post('#/updateProfile/:id', function (context) {
            let userId = context.params.id.substr(1);
            let email = context.params.email;
            let firstName = context.params.firstName;
            let middleName = context.params.middleName;
            let lastName = context.params.lastName;
            let address = context.params.address;
            let phone = context.params.phone;

            userService.updateEditUser(userId, email, firstName, middleName, lastName, address, phone)
                .then((respInfo) => {
                    auth.saveSession(respInfo);
                    utils.showInfo('User information updated successfully.');
                    context.redirect(`#/profile/:${userId}`);
                }).catch(auth.handleError);
        });
    }).run();
});