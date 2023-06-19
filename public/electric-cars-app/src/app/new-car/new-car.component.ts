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

  stateInput!: boolean[];

  #createElectricCarForm!: FormGroup;
  get createElectricCarForm() { return this.#createElectricCarForm; }

  constructor(private formBuilder: FormBuilder,
              private electricCarService: ElectricCarService) {
      this.stateInput = [];
  }

  ngOnInit(): void {
    this.#createElectricCarForm= this.formBuilder.group({
      company: "",
      name: "",
      year: "",
      manufactures: this.formBuilder.array([
        this.createManufactureGroup()
      ])
    });
    this.stateInput.push(false);
  }

  createManufactureGroup() {
    return this.formBuilder.group({
      country: '',
      state: '',
      city: ''
    });
  }

  addManufacture() {
    this.manufactures.push(this.createManufactureGroup());
  }

  removeManufacture(index: number) {
    this.manufactures.removeAt(index);
  }

  get manufactures() {
    return this.createElectricCarForm.get('manufactures') as FormArray;
  }

  showStateInput(index: number) {
    this.stateInput[index] = !this.stateInput[index];
  }

  formErrorMsg= "";
  formSuccessMsg= "";

  private _checkIfFormInputsAreFilled(form: FormGroup) {
    let formApproved= true;
    
    if (form.value.company === "" || form.value.name === "" || form.value.year === "") { formApproved= false; }
    else { formApproved= true; }

    let manufactureArr= form.value.manufactures;

    let i= 0;
    
    manufactureArr.forEach((factory: Manufacture) => {
      if (factory.country === "" || factory.city === "") { formApproved= false; }
      if (this.stateInput[i] == true && factory.state === "") { formApproved= false; }
      i++;
    });

    if (formApproved == false) {
      this.formErrorMsg= "You have to fill all inputs!";
    } else {
      this.formErrorMsg= "";
    }

    return formApproved;
  }

  resetManufactureForm() {
    for (let i = this.manufactures.length - 1; i > 0; i--) {
      this.removeManufacture(i);
    }
  }

  create(form: FormGroup) {
    const car= new ElectricCar();
    const formApproved = this._checkIfFormInputsAreFilled(form);
    if (formApproved == true) {

      car.company= form.value.company;
      car.name= form.value.name;
      car.year= form.value.year;
      car.manufactures= form.value.manufactures;

      this.electricCarService.createElectricCar(car)
        .subscribe({
          next: (car) => {
            console.log(car);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => { 
            this.resetManufactureForm();
            this.formSuccessMsg= "Car was created successfully!"; 
          }
        });
      form.reset();
    }
  }
}
