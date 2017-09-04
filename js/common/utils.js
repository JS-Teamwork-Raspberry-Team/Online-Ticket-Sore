let utils = (() => {

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    function validateUsername(username) {
        return /^[\w\-]{3,10}(\s?[\w\-]{1,10})$/.test(username);
    }

    function validatePassword(password) {
        return /^[a-zA-Z0-9!@#$%\^&\*\)\(+=\._-]{6,}$/.test(password);
    }

    function validateEmail(email) {
        return /^[^<>()\[\]\.,;:\s@\"+\.[^<>()\[\]\.,;:\s@\"]+@[^<>()[\]\.,;:\s@\"]+\.+[^<>()[\]\.,;:\s@\"]{2,4}$/i.test(email);
    }

    function displayHome(context) {
        let events = [
            { eventId: 1, title: 'Hawaii Party', description: 'Come to our party and have fun! We love you <3 '},
            { eventId: 2, title: 'Chris Brown Concert at Sofia, Bulgaria', description: 'Do you love Chris Brown? Come to see him.'},
            { eventId: 3, title: 'Art fest at the zoo', description: 'Dogs, elephants, donkeys, monkeys and others are going to have a fest.'}
        ];

        context.lastEvents = events;
        context.topEvents = events;
        auth.getUser(context);

        context.loadPartials({
            header: '../html/common/header.hbs',
            footer: '../html/common/footer.hbs',
            event: '../html/home/event.hbs'
        }).then(function () {
            this.partial('../html/home/homePage.hbs');
        });
    }

    function validateEventData(data) {
        if (!/^[\w\-\s?]{5,30}$/.test(data.name)) {
            utils.showError('Invalid event name. It must be at least 5 symbols long and contains only one space between words.');
            return false;
        }

        if (data.price === '' || isNaN(data.price)) {
            utils.showError('Invalid price for event.');
            return false;
        }

        if (data.ticketsCount === '' || isNaN(data.ticketsCount)) {
            utils.showError('Invalid tickets count for event.');
            return false;
        }

        if (data.date === '' || data.date === undefined) {
            utils.showError('You did not specify the date of the event.');
            return false;
        }

        if (data.date < new Date().toISOString().split('T')[0]) {
            utils.showError('You cannot create an event from the past.');
            return false;
        }

        if (!/^[\w]{1,}.*$/.test(data.description)) {
            utils.showError('The description cannot start with empty space.');
            return false;
        }

        return true;
    }

    return {
        showInfo,
        showError,
        validateUsername,
        validatePassword,
        validateEmail,
        displayHome,
        validateEventData
    }
})();
