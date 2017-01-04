(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'webapp/node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'webapp/app',

            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',

            // 3d party libraries
            'ag-grid-ng2': 'npm:ag-grid-ng2',
            'ag-grid': 'npm:ag-grid',
            'ng2-auto-complete': 'npm:ng2-auto-complete/dist',
            'angular2-ui-switch': 'npm:angular2-ui-switch/dist',
            'rxjs': 'npm:rxjs',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            'app/core': {
                main: 'index'
            },
            'app/models': {
                main: 'index'
            },
            app: {
                main: '../main.js',
                defaultExtension: 'js'
            },
            'ag-grid-ng2': {
                defaultExtension: "js"
            },
            'ag-grid': {
                defaultExtension: "js"
            },
            'angular2-ui-switch': {
                main: 'index',
                defaultExtension: "js"
            },
            'ng2-auto-complete': {
                main: 'ng2-auto-complete.umd.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
        }
    });
})(this);
