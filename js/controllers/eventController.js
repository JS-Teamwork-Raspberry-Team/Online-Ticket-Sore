$(() => {
    Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');
        Handlebars.registerHelper("inc", function(value, options) {
            return parseInt(value) + 1;
        });

        this.get('#/show/:id', eventService.getShowEventPage);

        this.get('#/purchase/:eventId', ticketService.getBuyTicketPage);

        this.post('#/ticket/:eventId', ticketService.buyTicket);

        this.get('#/basket', ticketService.getBasketPage);

        this.get('#/removeTicket/:ticketId', ticketService.removeTicket);

        this.get('#/purchaseTickets', ticketService.purchaseTickets);
    }).run()
});
