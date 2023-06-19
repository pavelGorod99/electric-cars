import { Component, OnInit } from '@angular/core';
import { ElectricCarService } from '../services/electric-car.service';
import { FormGroup } from '@angular/forms';

export class City {
  #city!: string;
  get city() { return this.#city; }
  set city(city: string) { this.#city= city; }

  constructor() {}
}

export class State {
  #state!: string;
  #cities!: City[];

  get state() { return this.#state; }
  get cities() { return this.#cities }

  set state(state: string) { this.#state= state; }
  set cities(cities: City[]) { this.#cities= cities; }

  constructor() {}

  setCity(city: City) {
    this.#cities.push(city);
  }
}

export class Manufacture {
  #_id!: string;
  #country!: string;
  #state?: string;
  #city!: string;

  get _id() { return this.#_id; }
  get country() { return this.#country; }
  get state() { return this.#state || ""; }
  get city() { return this.#city; }

  set _id(_id: string) { this.#_id= _id; }
  set country(country: string) { this.#country= country; }
  set state(state: string) { this.#state= state; }
  set city(city: string) { this.#city= city; }

  constructor() {}

  fillFromFormGroup(form: FormGroup) {
    this.country= form.value.country;
    if (form.value.state) {
      this.state= form.value.state;
    }
    this.city= form.value.city;
  }

  toJSON() {
    return {
      country: this.country,
      state: this.state === '' ? null : this.state,
      city: this.city
    }
  }
}

export class ElectricCar {
  #_id!: string;
  #name!: string;
  #company!: string;
  #year!: number;
  #manufactures!: Manufacture[];

  get _id() { return this.#_id; }
  get name() { return this.#name; }
  get company() { return this.#company; }
  get year() { return this.#year; }
  get manufactures(): Manufacture[] { return this.#manufactures; }

  set _id(_id: string) { this.#_id= _id; }
  set name(name: string) { this.#name= name; }
  set company(company: string) { this.#company= company; }
  set year(year: number) { this.#year= year; }
  set manufactures(manufactures: Manufacture[]) { this.#manufactures= manufactures; }

  setNewManufacture(manufacture: Manufacture) {
    this.#manufactures.push(manufacture);
  }

  toJson() {
    return {
      name: this.name,
      company: this.company,
      year: this.year,
      manufactures: this.manufactures
    }
  }
}

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit{
  
  electricCars: ElectricCar[] = [];

  constructor(private _electricCarService: ElectricCarService) {}

  ngOnInit(): void {
    this.getAllElectricCars();
  }

  getAllElectricCars() {
    this._electricCarService.getAllElectricCars()
      .subscribe({
        next: (electricCars) => {
          console.log("RESPONSE");
          console.log(electricCars);
          this.electricCars= electricCars;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
}
