$(() => {
    const app = Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');

        // WELCOME
        this.get('index.html', displayHome);
        this.get('#/home', displayHome);
        function displayHome(context) {
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
    });

    app.run();
});