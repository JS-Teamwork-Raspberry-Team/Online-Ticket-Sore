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
            let availableTickets = event.ticketsCount  === "0" ? 'No' : event.ticketsCount;
            auth.getUser(context);
            context.evenId = eventId;
            context.name = event.name;
            context.image = event.image;
            context.price = event.price;
            context.date = event.date.toString().replace(' ', 'T');
            context.category = event.category;
            context.locationName = event.locationName;
            context.description = event.description;
            context.ticketsCount = availableTickets;
            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                showEventForm: '../html/event/showEventForm.hbs'
            }).then(function () {
                this.partial('../html/event/showEventPage.hbs').then(function () {
                    if (availableTickets === 'No') {
                        $('#purchaseBtn').hide()
                    }
                });
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

    function getEventsByCategory(context, category) {
        requester.get('appdata', 'events').then(function (events) {
            auth.getUser(context);

            if (category === 'All') {
                context.events = events;
            } else {
                context.events = events.filter(e => e.category === category);
            }

            context.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                event: '../html/common/event.hbs'
            }).then(function () {
                this.partial('../html/categories/categoryPage.hbs');
            })
        }).catch(auth.handleError);
    }

    function updateEvent(event) {
        return requester.update('appdata', 'events/' + event._id, 'kinvey', event);
    }

    return {
        registerEvent,
        loadEvents,
        getEventById,
        getEditEventPage,
        getShowEventPage,
        editEvent,
        deleteEvent,
        getEventsByCategory,
        updateEvent
    }
})();
