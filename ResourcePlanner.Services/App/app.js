(function () {

    // Enter Global Config Values & Instantiate ADAL AuthenticationContext
    window.config = {
        instance: 'https://login.microsoftonline.com/',
        tenant: 'bluemetal.com',
        clientId: '55324854-cfd5-4d16-bf63-556abddbdf83',  //for localhost testing
        //clientId: 'e36e4a47-114e-41a6-abb0-160b8ead8098',
        cacheLocation: 'sessionStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };
    var authContext = new AuthenticationContext(config);

    // Check For & Handle Redirect From AAD After Login
    var isCallback = authContext.isCallback(window.location.hash);
    authContext.handleWindowCallback();

    if (isCallback && !authContext.getLoginError()) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }

    // Check Login Status, Update UI;
    if (!authContext.getCachedUser()) {
        authContext.config.redirectUri = window.location.href;
        authContext.login();
        return;
    } 
    authContext.acquireToken(authContext.config.clientId, function (error, token) {
        if (token) {
            localStorage.setItem('id_token', token);
        }
    });
}());
