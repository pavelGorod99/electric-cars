import { Component, OnInit } from '@angular/core';
import { ElectricCarService } from '../services/electric-car.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectricCar } from '../cars/cars.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ManufactureService } from '../services/manufacture.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  electricCar!: ElectricCar;

  // #electricCarId!: string;

  #updateElectricCarForm!: FormGroup;
  get updateElectricCarForm() { return this.#updateElectricCarForm; }

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private formBuilder: FormBuilder, 
              private electricCarService: ElectricCarService,
              private manufactureService: ManufactureService) {
    this.electricCar= new ElectricCar();
  }

  ngOnInit(): void {
    const electricCarId= this.route.snapshot.params["carId"];
    this.#updateElectricCarForm= this.formBuilder.group({
      company: "",
      name: "",
      year: ""
    });
    this.getElectricCarById(electricCarId);
  }

  getElectricCarById(_id: string) {
    this.electricCarService.getElectricCarById(_id)
      .subscribe({
        next: (electricCar) => {
          console.log(electricCar);
          this.electricCar= electricCar;

          this.#updateElectricCarForm= this.formBuilder.group({
            company: electricCar.company,
            name: electricCar.name,
            year: electricCar.year
          });

          // console.log(this.#updateElectricCarForm);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  buildPartiallyUpdatedElecticCar(form: FormGroup) {
    return {
      _id: this.electricCar._id,
      company: form.value.company,
      name: form.value.model,
      year: form.value.year
    };
  }

  fillFromFormGroupPartiallyElectricCar(form: FormGroup) {
    const partiallyElectricCar: Partial<ElectricCar> = {
      _id: this.electricCar._id,
      company: form.value.company,
      name: form.value.name,
      year: form.value.year
    }

    return partiallyElectricCar;
  }
 
  updateCar(form: FormGroup) {
    // console.log(form.value);

    const partiallyUpdatedElectricCar= this.fillFromFormGroupPartiallyElectricCar(form);
    // console.log(partiallyUpdatedElectricCar);
    
    this.electricCarService.updatePartiallyElectricCar(partiallyUpdatedElectricCar)
      .subscribe({
        next: (response) => {

          
          console.log(response);
          
          
          this.getElectricCarById(this.electricCar._id);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteCar() {
    console.log(this.electricCar._id);
    this.electricCarService.deleteElectricCarById(this.electricCar._id)
      .subscribe({
        next: () => {
          this.router.navigate(['/cars']);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteManufacture(maunfactureId: string) {
    this.manufactureService.deleteManufactureById(this.electricCar._id, maunfactureId)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.getElectricCarById(this.electricCar._id);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
