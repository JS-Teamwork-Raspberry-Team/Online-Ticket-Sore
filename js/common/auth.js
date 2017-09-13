let auth = (() => {
    // user/login
    function login(username, password) {
        let userData = {
            username,
            password
        };

        return requester.post('user', 'login', 'basic', userData);
    }

    // user/register
    function register(username, password, email) {
        let userData = {
            username,
            password,
            email,
            isAdmin: '',
            basket: {}
        };

        return requester.post('user', '', 'basic', userData);
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    function saveSession(userInfo) {
        let id = userInfo['_id'];
        let username = userInfo['username'];
        let authtoken = userInfo['_kmd']['authtoken'];
        let isAdmin = userInfo['isAdmin'];

        sessionStorage.setItem('id', id);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('authtoken', authtoken);
        sessionStorage.setItem('isAdmin', isAdmin);
    }

    function getUser(context) {
        context.id = sessionStorage.getItem('id');
        context.username = sessionStorage.getItem('username');
        context.isAdmin = sessionStorage.getItem('isAdmin') !== '';

        return sessionStorage.getItem('username');
    }

    function handleError(reason) {
        utils.showError(reason.responseJSON.description);
    }

    return {
        login,
        register,
        logout,
        saveSession,
        getUser,
        handleError
    }
})();