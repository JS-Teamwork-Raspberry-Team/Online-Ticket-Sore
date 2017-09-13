$(() => {
    const app = Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', utils.displayHome);
        this.get('#/home', utils.displayHome);
        this.get('#/all-listings', function (context) {
            eventService.getEventsByCategory(context, 'All');
        });
        this.get('#/music', function (context) {
            eventService.getEventsByCategory(context, 'Music');
        });
        this.get('#/cinema', function (context) {
            eventService.getEventsByCategory(context, 'Cinema');
        });
        this.get('#/theater', function (context) {
            eventService.getEventsByCategory(context, 'Theather');
        });
        this.get('#/sport', function (context) {
            eventService.getEventsByCategory(context, 'Sport');
        });
        this.get('#/attractions', function (context) {
            eventService.getEventsByCategory(context, 'Attractions');
        });
        this.get('#/other', function (context) {
            eventService.getEventsByCategory(context, 'Other');
        });
    });

    app.run();
});