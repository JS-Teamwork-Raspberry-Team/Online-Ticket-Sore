let eventService = (() => {
    function registerEvent(context) {
        let {name, price, date, category, locationName, latitude, longitude, description} = context.params;
        let imageFile = document.getElementById('file').files[0];
        if (imageFile == undefined) {
            utils.showError('You must load an image for the event.');
            return;
        }

        let reader = new FileReader();
        reader.onload = function(){
            let eventData = {
                name: name,
                price: price,
                date: date.toString().replace('T', ' '),
                category: category,
                locationName: locationName,
                latitude: latitude,
                longitude: longitude,
                description: description,
                image: reader.result
            };

            utils.validateEventData(eventData);
            requester.post('appdata', 'events', 'kinvey', eventData).then(function (eventInfo) {
                utils.showInfo('Event is registered successfully.');
                context.redirect('#/home');
            }).catch(auth.handleError);
        };
       reader.readAsDataURL(imageFile);
    }

    function loadEvents(context) {
        requester.get('appdata', 'events').then(function (events) {
            context.events = events;
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
            loadEvents(context);
        }).catch(auth.handleError);
    }

    return {
        registerEvent,
        loadEvents,
        deleteEvent
    }
})();
