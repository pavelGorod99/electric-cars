import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ElectricCar, Manufacture } from '../cars/cars.component';
import { ManufactureService } from '../services/manufacture.service';

@Component({
  selector: 'app-new-manufacture',
  templateUrl: './new-manufacture.component.html',
  styleUrls: ['./new-manufacture.component.css']
})
export class NewManufactureComponent implements OnInit {

  #createManufactureForm!: FormGroup;
  get createManufactureForm() { return this.#createManufactureForm; }

  stateInput!: boolean[];

  #electricCarId!: "";

  constructor(private router: Router,
              private route: ActivatedRoute, 
              private formBuilder: FormBuilder,
              private manufactureService: ManufactureService) {
    this.stateInput= [];
  }

  ngOnInit(): void {
    this.#electricCarId= this.route.snapshot.params['carId'];
    this._initializeFormBuilder();
    this.stateInput.push(false);
  }

  _initializeFormBuilder() {
    this.#createManufactureForm= this.formBuilder.group({
      manufactures: this.formBuilder.array([
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
    this.manufactures.push(this.createManufactureGroup());
  }

  removeManufacture(index: number) {
    this.manufactures.removeAt(index);
  }

  get manufactures() {
    return this.createManufactureForm.get('manufactures') as FormArray;
  }

  showStateInput(index: number) {
    this.stateInput[index] = !this.stateInput[index];
  }

  formErrorMsg= "";
  formSuccessMsg= "";

  fillFromFormGroupManufacturies(form: FormGroup) {
    const partiallyElectricCar: Partial<ElectricCar> = {
      _id: this.#electricCarId,
      manufactures: form.value.manufactures
    }
    return partiallyElectricCar;
  }

  private _checkIfFormInputsAreFilled(form: FormGroup) {
    let formApproved= true;
    let manufactureArr= form.value.manufactures;
    let i= 0;

    manufactureArr.forEach((factory: Manufacture) => {
      if (factory.country === "" || factory.city === "") { formApproved= false; }
      if (this.stateInput[i] == true && factory.state === "") { formApproved= false; }
      i++;
    });

    if (!formApproved) {
      this.formErrorMsg= "You have to fill all inputs!";
    } else {
      this.formErrorMsg= "";
    }

    return formApproved;
  }

  onCreate(form: FormGroup) {
    const formApproved = this._checkIfFormInputsAreFilled(form);
    if (formApproved == true) {

      const manufactureArr= this.fillFromFormGroupManufacturies(form);
      
      this.manufactureService.createManufactures(manufactureArr)
        .subscribe({
          next: (response) => {
            console.log(response);
            
            this._initializeFormBuilder();
            this.stateInput= [];
            this.router.navigate(['cars', this.#electricCarId]);
            // for (let i = this.manufactures.length - 1; i > 0 ; i--) {
            //   this.removeManufacture(i);
            // }
            
            // form.reset();
          },
          error: (err) => {
            console.log(err);
          }
        });
    }
  }
}
