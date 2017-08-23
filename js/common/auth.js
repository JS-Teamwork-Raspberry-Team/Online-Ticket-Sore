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
            basket: []
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

        sessionStorage.setItem('id', id);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('authtoken', authtoken);
    }

    return {
        login,
        register,
        logout,
        saveSession
    }
})();