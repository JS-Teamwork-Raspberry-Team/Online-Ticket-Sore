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
            context.username = sessionStorage.getItem('username');

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

                    displayHome(context);
                }).catch(auth.handleError);
        });

    }).run();
});