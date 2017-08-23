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
        this.post('#/register', userService.registerUser)

    }).run();
});