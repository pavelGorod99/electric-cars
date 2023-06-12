import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { CarsComponent } from './cars/cars.component';
import { CarComponent } from './car/car.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ManufactureComponent } from './manufacture/manufacture.component';
import { NewCarComponent } from './new-car/new-car.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    FooterComponent,
    CarsComponent,
    CarComponent,
    ManufactureComponent,
    NewCarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "cars",
        component: CarsComponent
      },
      {
        path: "cars/new-car",
        component: NewCarComponent
      },
      {
        path: "cars/:carId",
        component: CarComponent
      },
      {
        path: "cars/:carId/manufacture/:manufactureId",
        component: ManufactureComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
