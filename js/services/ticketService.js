let ticketService = (() => {
    function getBuyTicketPage (context) {
        let eventId = context.params.eventId.substring(1);
        eventService.getEventById(eventId).then(function (event) {
            context.eventId = eventId;
            context.price = event.price;

            auth.getUser(context);
            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                buyTicketForm: '../html/ticket/buyTicketForm.hbs'
            }).then(function () {
                this.partial('../html/ticket/buyTicketPage.hbs');
            });
        });

        $("body").on('change', "#ticketsCount", calculateTotalPrice);
        function calculateTotalPrice() {
            let price = Number($('#eventPrice').text());
            let quantity = Number($('#ticketsCount').val());
            $('#totalPrice').val(price * quantity);
        }
    }

    function buyTicket (context) {
        let eventId = context.params.eventId.substring(1);
        let ticketsCount = Number($('#ticketsCount').val());

        if (ticketsCount < 1 || ticketsCount > 6){
            utils.showError('You can purchase from 1 to 6 tickets.');
        } else {
            eventService.getEventById(eventId).then(function (event) {
                let ticket = {
                    user_id: sessionStorage.getItem('id'),
                    event_id: eventId,
                    tickets_count: ticketsCount,
                    purchase_date: new Date().toLocaleString('en-US'),
                    is_purchased: false
                };

                requester.post('appdata', 'tickets', 'kinvey', ticket).then(function (ticketInfo) {
                    auth.getUser(context);
                    utils.showInfo(`${ticketsCount} tickets successfully purchased.`);
                    context.redirect('#/home');
                });
            }).catch(auth.handleError);
        }
    }

    function getBasketPage(context) {
        getTickets(false).then(function (tickets) {
            console.log(tickets);
            if (tickets){
                let myTickets = [];
                auth.getUser(context);
                for (let ticket of tickets) {
                    eventService.getEventById(ticket.event_id).then(function (eventInfo) {
                        myTickets.push({
                            eventName: eventInfo.name,
                            eventLocation: eventInfo.locationName,
                            ticketId: ticket._id,
                            ticketPrice: eventInfo.price,
                            ticketCount: ticket.tickets_count,
                            total: Number(ticket.tickets_count) * Number(eventInfo.price)
                        });

                        context.tickets = myTickets;
                        context.loadPartials({
                            header: '../html/common/header.hbs',
                            footer: '../html/common/footer.hbs',
                            myTickets: '../html/basket/basketItem.hbs'
                        }).then(function () {
                            this.partial('../html/basket/basketPage.hbs');
                        })
                    });
                }
            }
        }).catch(auth.handleError);
    }

    function getTickets(isPurchased) {
        let user = sessionStorage.getItem('username');
        return requester.get('appdata', 'tickets', 'kinvey', `?query={"user_id":"${user}", "is_purchased"="${isPurchased}"}&sort={"_kmd.ect": -1}`);
    }

    function removeTicket(context) {
        let ticketId = context.params.ticketId.substr(1);
        removeTicketFromBasket(ticketId).then(function () {
            utils.showInfo('Removed ticket');
            getBasketPage(context);
        }).catch(auth.handleError);
    }

    function removeTicketFromBasket(ticketId) {
        return requester.remove('appdata', 'tickets/' + ticketId, 'kinvey');
    }

    function purchaseTickets(context) {
        if (confirm('Do you want to purchase selected tickets?')) {
            getTickets(false).then(function (tickets) {
                auth.getUser(context);
                for (let ticket of tickets) {
                    let newTicket = {
                        event_id: ticket.event_id,
                        is_purchased: true,
                        purchase_date: ticket.purchase_date,
                        tickets_count: ticket.tickets_count,
                        user_id: ticket.user_id
                    };

                    requester.update('appdata', 'tickets/' + ticket._id, 'kinvey', newTicket)
                        .catch(auth.handleError)
                }

                utils.showInfo('Successfully purchased tickets');
            }).catch(auth.handleError);


            //context.redirect('#/home');
        }
    }

    return {
        getBuyTicketPage,
        buyTicket,
        getBasketPage,
        removeTicket,
        purchaseTickets
    }
})();