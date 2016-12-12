import { NgModule } from '@angular/core';

import { AdminRoutingModule, routedComponents } from './admin-routing.module';
import { RolesComponent } from './roles/roles.component';
import { RoleListComponent } from './roles/roleList/roleList.component';
import { RoleMembersComponent } from './roles/roleMembers/roleMembers.component';
import { RoleMemberAddComponent } from './roles/roleMemberAdd/roleMemberAdd.component';
import { RolePermissionsComponent } from './roles/rolePermissions/rolePermissions.component';
import { RolePermissionAddComponent } from './roles/rolePermissionAdd/rolePermissionAdd.component';

@NgModule({
    imports: [AdminRoutingModule],
    declarations: [
        RolesComponent,
        RoleListComponent,
        RoleMembersComponent,
        RoleMemberAddComponent,
        RolePermissionsComponent,
        RolePermissionAddComponent,
        routedComponents
    ]
})
export class AdminModule { }