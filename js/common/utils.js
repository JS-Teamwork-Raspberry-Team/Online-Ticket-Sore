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
        let usernameRegex = '/^[\w-]{3,}$/';
        return username.match(usernameRegex)
    }

    function validatePassword(password) {
        let passRegex = '/^[a-zA-Z0-9!@#$%\^&\*\)\(+=\._-]{6,}$/';
        return password.match(passRegex);
    }

    return {
        showInfo,
        showError,
        validateUsername,
        validatePassword
    }
})();
