import { Component, OnInit } from '@angular/core';
import { ElectricCar, Manufacture } from '../cars/cars.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ElectricCarService } from '../services/electric-car.service';

@Component({
  selector: 'app-new-car',
  templateUrl: './new-car.component.html',
  styleUrls: ['./new-car.component.css']
})
export class NewCarComponent implements OnInit {

  electricCar!: ElectricCar;

  #createElectricCarForm!: FormGroup;
  get createElectricCarForm() { return this.#createElectricCarForm; }

  constructor(private formBuilder: FormBuilder,
    private electricCarService: ElectricCarService) {}

  ngOnInit(): void {
    this.#createElectricCarForm= this.formBuilder.group({
      company: "",
      model: "",
      year: "",
      manufacture: this.formBuilder.array([
        this.createManufactureGroup()
      ])
    });
  }

  createManufactureGroup() {
    return this.formBuilder.group({
      country: '',
      state: '',
      city: ''
    });
  }

  addManufacture() {
    this.manufacturies.push(this.createManufactureGroup());
  }

  removeManufacture(index: number) {
    this.manufacturies.removeAt(index);
  }

  get manufacturies() {
    return this.createElectricCarForm.get('manufacture') as FormArray;
  }

  create(form: FormGroup) {
    console.log(form.value);
    const car= new ElectricCar();
    car.company= form.value.company;
    car.name= form.value.model;
    car.year= form.value.year;
    car.manufacture= form.value.manufacture;

    this.electricCarService.createElectricCar(car)
      .subscribe({
        next: (car) => {
          console.log(car);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
