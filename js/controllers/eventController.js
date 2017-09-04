$(() => {
    Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');
        Handlebars.registerHelper("inc", function(value, options) {
            return parseInt(value) + 1;
        });

        this.get('#/show/:id', eventService.getShowEventPage);

        this.get('#/purchase/:eventId', eventService.getBuyTicketPage);

        this.post('#/ticket/:eventId', eventService.buyTicket);

        this.get('#/basket', eventService.getBasketPage);
    }).run()
});
