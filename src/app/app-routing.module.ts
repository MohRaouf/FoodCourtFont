import { FoodCourtComponent } from './components/food-court/food-court.component';
import { ErrorComponent } from './components/error/error.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: FoodCourtComponent,
    pathMatch: "full",
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
