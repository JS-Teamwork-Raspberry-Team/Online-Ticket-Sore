let eventService = (() => {
    function registerEvent(context) {
        let {name, price, ticketsCount, date, category, locationName, latitude, longitude, description} = context.params;
        let imageFile = document.getElementById('file').files[0];
        if (imageFile === undefined) {
            utils.showError('You must load an image for the event.');
            return;
        }

        let reader = new FileReader();
        reader.onload = function(){
            let eventData = {
                name: name,
                price: price,
                ticketsCount: ticketsCount,
                date: date.toLocaleString('en-US'),
                category: category,
                locationName: locationName,
                latitude: latitude,
                longitude: longitude,
                description: description,
                image: reader.result
            };

            if(!utils.validateEventData(eventData)) {
                return;
            }
            requester.post('appdata', 'events', 'kinvey', eventData).then(function (eventInfo) {
                utils.showInfo('Event is registered successfully.');
                context.redirect('#/admin');
            }).catch(auth.handleError);
        };
       reader.readAsDataURL(imageFile);
    }

    function loadEvents(context, filter) {
        requester.get('appdata', 'events').then(function (events) {
            let filteredEvents = [];
            let currentDate = new Date().toISOString().split('T')[0];
            switch (filter) {
                case 'events': filteredEvents = events; break;
                case 'venues': filteredEvents = events; break;
                case 'upcoming': filteredEvents = events.filter(e => e.date > currentDate); break;
                case 'finished': filteredEvents = events.filter(e => e.date < currentDate); break;
                default: break;
            }
            auth.getUser(context);
            context.events = filteredEvents;
            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                event: '../html/common/event.hbs',
                eventList: '../html/admin/eventList.hbs',
                jumbotronSection: '../html/admin/jumbotronSection.hbs'
            }).then(function () {
                this.partial('../html/admin/adminPanel.hbs')
            })
        }).catch(auth.handleError)
    }

    function deleteEvent(context) {
        let eventId = context.params.id;
        eventId = eventId.substring(1);
        requester.remove('appdata', 'events/' + eventId, 'kinvey').then(function () {
            loadEvents(context, 'events');
        }).catch(auth.handleError);
    }

    function getEditEventPage(context) {
        let eventId = context.params.id.substring(1);
        sessionStorage.setItem('eventId', eventId);
        eventService.getEventById(eventId).then(function (event) {
            context.name = event.name;
            context.price = event.price;
            context.ticketsCount = event.ticketsCount;
            context.date = event.date.toString().replace(' ', 'T');
            context.category = event.category;
            context.locationName = event.locationName;
            context.latitude = event.latitude;
            context.longitude = event.longitude;
            context.description = event.description;
            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                editEventForm: '../html/event/editEventForm.hbs'
            }).then(function () {
                this.partial('../html/event/editEventPage.hbs');
            });
        })
    }

    function getShowEventPage(context) {
        let eventId = context.params.id.substring(1);
        sessionStorage.setItem('eventId', eventId);
        eventService.getEventById(eventId).then(function (event) {
            context.evenId = eventId;
            context.name = event.name;
            context.image = event.image;
            context.price = event.price;
            context.date = event.date.toString().replace(' ', 'T');
            context.category = event.category;
            context.locationName = event.locationName;
            context.description = event.description;
            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                showEventForm: '../html/event/showEventForm.hbs'
            }).then(function () {
                this.partial('../html/event/showEventPage.hbs');
            });
        })
    }

    function editEvent(context) {
        let eventId = sessionStorage.getItem('eventId');
        eventService.getEventById(eventId).then(function (event) {
            let {name, price, ticketsCount, date, category, locationName, latitude, longitude, description} = context.params;
            let imageFile = document.getElementById('file').files[0];
            let image;
            if (imageFile === undefined) {
                image = event.image;
            } else {
                let reader = new FileReader();
                reader.onload = function () {
                    image = reader.result;
                };
                reader.readAsDataURL(imageFile);
            }

            let newData = {
                name: name,
                price: price,
                ticketsCount: ticketsCount,
                date: date.toString().replace('T', ' '),
                category: category,
                locationName: locationName,
                latitude: latitude,
                longitude: longitude,
                description: description,
                image: image
            };

            utils.validateEventData(newData);
            requester.update('appdata', 'events/' + eventId, 'kinvey', newData).then(function (event) {
                utils.showInfo(`Event with id:${eventId} was updated successfully.`);
                context.redirect('#/admin');
            }).catch(auth.handleError)
        })
    }

    function getEventById(id) {
        return requester.get('appdata', 'events/' + id, 'kinvey');
    }

    function getBuyTicketPage (context) {
        let eventId = context.params.eventId.substring(1);
        getEventById(eventId).then(function (event) {
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
            getEventById(eventId).then(function (event) {
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
        getTicketsByUserId(false).then(function (tickets) {
            let myTickets = [];
            for (let ticket of tickets) {
                getEventById(ticket.event_id).then(function (eventInfo) {
                    myTickets.push({
                        eventName: eventInfo.name,
                        eventLocation: eventInfo.locationName,
                        ticketPrice: eventInfo.price,
                        ticketCount: ticket.tickets_count,
                        total: Number(ticket.tickets_count) * Number(eventInfo.price)
                    });
                });
            }

            context.purchasedTickets = tickets;
            auth.getUser(context);
            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                myTickets: '../html/basket/basketItem.hbs'
            }).then(function () {
                this.partial('../html/basket/basketPage.hbs');
            })
        }).catch(auth.handleError)
    }

    function getTicketsByUserId(isPurchased) {
        let user = sessionStorage.getItem('username');
        return requester.get('appdata', 'tickets', 'kinvey', `?query={"user_id":"${user}", "is_purchased"="${isPurchased}"}&sort={"_kmd.ect": -1}`);
    }

    return {
        registerEvent,
        loadEvents,
        getEventById,
        getEditEventPage,
        getShowEventPage,
        editEvent,
        deleteEvent,
        getBuyTicketPage,
        buyTicket,
        getBasketPage
    }
})();
