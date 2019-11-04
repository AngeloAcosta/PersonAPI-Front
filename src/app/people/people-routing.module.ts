import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { InspectComponent } from './inspect/inspect.component';
import { TreeComponent } from './tree/tree.component';


const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: 'edit', component: EditComponent },
  { path: 'inspect', component: InspectComponent },
  { path: 'list', component: ListComponent },
  { path: ':id/tree', component: TreeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
