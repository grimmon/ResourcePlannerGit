import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'resource-planner-404',
    template: `
    <article style="position:absolute;top:108px;width: calc(100% - 56px)">
      <h4>Sorry!</h4>
      <div>This page is not found.</div>
    </article>
  `
})
export class PageNotFoundComponent { }