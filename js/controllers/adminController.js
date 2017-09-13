$(() => {
    Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/admin', function (context) {
            auth.getUser(context);
            eventService.loadEvents(context, 'events')
        });
        
        this.get('#/add-event', function (context) {
            auth.getUser(context);

            this.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                addEventForm: '../html/event/addEventForm.hbs'
            }).then(function () {
                this.partial('../html/event/addEventPage.hbs')
            })
        });

        this.post('#/add-event', eventService.registerEvent);

        this.get('#/edit/:id', eventService.getEditEventPage);

        this.post('#/edit', eventService.editEvent);

        this.get('#/delete/:id', eventService.deleteEvent);
        
        this.get('#/admin-filter/venues', function (context) {
            eventService.loadEvents(context, 'venues');
        });

        this.get('#/admin-filter/events', function (context) {
            eventService.loadEvents(context, 'events');
        });

        this.get('#/admin-filter/upcoming', function (context) {
            eventService.loadEvents(context, 'upcoming');
        });

        this.get('#/admin-filter/finished', function (context) {
            eventService.loadEvents(context, 'finished');
        });
    }).run()
});
