

import { Injectable } from '@angular/core';

declare var adal: any;

@Injectable()
export class AdalService {

    private authContext: any;

    init = (config: any) => {
        //var authContext: any = new AuthenticationContext(config);

        //// Check For & Handle Redirect From AAD After Login
        //var isCallback = authContext.isCallback(window.location.hash);
        //authContext.handleWindowCallback();

        //if (isCallback && !authContext.getLoginError()) {
        //    //window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
        //}

        //// Check Login Status, Update UI;
        //if (!authContext.getCachedUser()) {
        //    authContext.config.redirectUri = window.location.href;
        //    authContext.login();
        //    return;
        //}
        //authContext.acquireToken(authContext.config.clientId, function (error: any, token: any) {
        //    if (token) {
        //        localStorage.setItem('id_token', token);
        //    }
        //});
    }

    logout = () => {
        this.authContext.logOut();
    }
}