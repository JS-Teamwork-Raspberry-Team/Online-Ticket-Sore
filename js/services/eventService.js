let eventService = (() => {
    function registerEvent(context) {
        let {name, price, date, category, locationName, latitude, longitude, description} = context.params;
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
                date: date,
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

    function editEvent(context) {
        let eventId = sessionStorage.getItem('eventId');
        eventService.getEventById(eventId).then(function (event) {
            let {name, price, date, category, locationName, latitude, longitude, description} = context.params;
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

    return {
        registerEvent,
        loadEvents,
        getEventById,
        getEditEventPage,
        editEvent,
        deleteEvent
    }
})();
