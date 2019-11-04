import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'people',
    loadChildren: () =>
      import('./people/people.module').then(m => m.PeopleModule)
  },
  {
    path: 'kinships',
    loadChildren: () =>
      import('./kinships/kinships.module').then(m => m.KinshipsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
