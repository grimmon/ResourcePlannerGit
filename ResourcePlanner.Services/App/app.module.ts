import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { Hello }         from '../Hello.js';

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, Hello],
    bootstrap: [AppComponent]
})
export class AppModule { }
