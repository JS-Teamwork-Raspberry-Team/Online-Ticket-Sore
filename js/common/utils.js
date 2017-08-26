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
        return /^[\w\-]{3,10}(\s?[\w\-]{1,10})?$/.test(username);
    }

    function validatePassword(password) {
        return /^[a-zA-Z0-9!@#$%\^&\*\)\(+=\._-]{6,}$/.test(password);
    }

    function validateEmail(email) {
        return /^[^<>()\[\]\.,;:\s@\"+\.[^<>()\[\]\.,;:\s@\"]+@[^<>()[\]\.,;:\s@\"]+\.+[^<>()[\]\.,;:\s@\"]{2,4}$/i.test(email);
    }

    function encodeImageFileAsURL(byteArray) {
        var binary = '';
        var bytes = new Uint8Array( byteArray );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    function convertImageToByteArray(image) {
        let fileData = new Blob([image]);
        let promise = new Promise(getBuffer);
        promise.then(function(data) {
            return data;
        }).catch(function(err) {
            utils.showError(err);
        });
        /*
         Create a function which will be passed to the promise
         and resolve it when FileReader has finished loading the file.
         */
        function getBuffer(resolve) {
            let reader = new FileReader();
            reader.readAsArrayBuffer(fileData);
            reader.onload = function() {
                let arrayBuffer = reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            }
        }
    }


    function displayHome(context) {
        let events = [
            { eventId: 1, title: 'Hawaii Party', description: 'Come to our party and have fun! We love you <3 '},
            { eventId: 2, title: 'Chris Brown Concert at Sofia, Bulgaria', description: 'Do you love Chris Brown? Come to see him.'},
            { eventId: 3, title: 'Art fest at the zoo', description: 'Dogs, elephants, donkeys, monkeys and others are going to have a fest.'}
        ];

        context.lastEvents = events;
        context.topEvents = events;
        context.username = sessionStorage.getItem('username');

        context.loadPartials({
            header: '../html/common/header.hbs',
            footer: '../html/common/footer.hbs',
            event: '../html/home/event.hbs'
        }).then(function () {
            this.partial('../html/home/homePage.hbs');
        });
    }

    return {
        showInfo,
        showError,
        validateUsername,
        validatePassword,
        validateEmail,
        displayHome,
        convertImageToByteArray,
        encodeImageFileAsURL
    }
})();
