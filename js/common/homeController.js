$(() => {
    const app = Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');

        // WELCOME
        this.get('index.html', displayHome);
        this.get('#/home', displayHome);
        function displayHome(context) {
            console.log(context);
            let events = [
                { eventId: 1, title: 'Hawaii Party', description: 'Come to our party and have fun! We love you <3 '},
                { eventId: 2, title: 'Chris Brown Concert at Sofia, Bulgaria', description: 'Do you love Chris Brown? Come to see him.'},
                { eventId: 3, title: 'Art fest at the zoo', description: 'Dogs, elephants, donkeys, monkeys and others are going to have a fest.'}
            ];

            context.lastEvents = events;
            context.topEvents = events;

            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                event: '../html/home/event.hbs'
            }).then(function () {
                this.partial('../html/home/homePage.hbs');
            });
        }

        this.get('#/login', function (ctx) {
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                loginForm: '../html/login/loginForm.hbs'
            }).then(function () {
                this.partial('../html/login/loginPage.hbs');
            });
        });
        this.post('#/login', function (context) {
            let username = context.params.username;
            let password = context.params.password;

            if(!utils.validateUsername(username)){
                auth.showError('Username should be at least 3 symbols long.');
                return;
            }

            if(!utils.validatePassword(password)){
                auth.showError('Password should be at least 6 symbols long.');
                return;
            }

            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Login successful.');

                    displayCatalog(context);
                }).catch(auth.handleError);
        });
        this.post('#/register', function (context) {
            let username = context.params.username;
            let password = context.params.password;
            let repeatPass = context.params.repeatPass;

            if(!utils.validateUsername(username)){
                auth.showError('Username should be at least 3 symbols long.');
                return;
            }

            if(!utils.validatePassword(password)){
                auth.showError('Password should be at least 6 symbols long.');
                return;
            }

            if(password !== repeatPass){
                auth.showError('Passwords should match.');
                return;
            }

            auth.register(username, password, name)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('User registration successful.');

                    displayCatalog(context);
                }).catch(auth.handleError)
        });

        // LOGOUT
        this.get('#/logout', function (context) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    auth.showInfo('Logout successful.');

                    displayHome(context);
                }).catch(auth.handleError);
        });
    });

    app.run();
})