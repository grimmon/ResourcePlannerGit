import { Component } from '@angular/core';

@Component({
    selector: 'Hello',
    template: `
        <p>Hello {{name}}</p>
    `
})
export class Hello {
    name: string = 'John';
}