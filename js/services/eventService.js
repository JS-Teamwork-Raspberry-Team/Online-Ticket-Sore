let eventService = (() => {
    function registerEvent(context) {
        let {name, price, date, category, locationName, latitude, longitude, description} = context.params;
        let image = document.getElementById('file').files[0];
        // let mainImg = JSON.stringify(utils.convertImageToByteArray(imageFile));

        let eventData = {
            name: name,
            price: price,
            date: date,
            category: category,
            locationName: locationName,
            latitude: latitude,
            longitude: longitude,
            description: description,
            image: image
        };

        requester.post('events', '', 'kinvey', eventData).then(function (eventInfo) {
            utils.showInfo('Event is registered successfully.');
            context.redirect('#/home');
        }).catch(auth.handleError)
    }

    return {
        registerEvent
    }
})();
