import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { PairComponent } from './pair/pair.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
{path:'', component:HomeComponent},
{path:'pair',component:PairComponent},
{path:'checkout',component:CheckoutComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
