import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { CheckoutComponent } from './checkout/checkout.component';
import { PairComponent } from './pair/pair.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    PairComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
	HttpClientModule,
    BrowserModule,
	BrowserAnimationsModule,
    AppRoutingModule,
	ReactiveFormsModule,
	FormsModule,
	ToastrModule.forRoot({
	timeOut: 5000, positionClass: 'toast-top-center', preventDuplicates: true,}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
