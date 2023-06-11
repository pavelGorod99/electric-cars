import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManufactureService } from '../services/manufacture.service';
import { Manufacture } from '../cars/cars.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manufacture',
  templateUrl: './manufacture.component.html',
  styleUrls: ['./manufacture.component.css']
})
export class ManufactureComponent implements OnInit {

  manufacture!: Manufacture;
  #manufactureId!: string;
  #electricCarId!: string;

  #manufactureForm!: FormGroup;
  get manufactureForm() { return this.#manufactureForm; }

  constructor(private route: ActivatedRoute, private manufactureService: ManufactureService, private formBuilder: FormBuilder) {
    this.manufacture= new Manufacture();
  }

  ngOnInit(): void {
    this.#manufactureId= this.route.snapshot.params["manufactureId"];
    this.#electricCarId= this.route.snapshot.params["carId"];
    
    this.#manufactureForm= this.formBuilder.group({
      country: "",
      state: "",
      city: ""
    });
    
    this.getManufactureById(this.#electricCarId, this.#manufactureId);
  }

  getManufactureById(electricCarId: string, manufactureId: string) {
    this.manufactureService.getManufactureById(electricCarId, manufactureId)
      .subscribe({
        next: (manufacture) => {
          console.log(manufacture);
          
          this.manufacture= manufacture;

          this.#manufactureForm= this.formBuilder.group({
            country: manufacture.country,
            state: manufacture.state || "",
            city: manufacture.city
          });
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  update(form: FormGroup) {
    console.log(form);
    const manufacture= new Manufacture();
    manufacture.fillFromFormGroup(form);
    console.log(manufacture.toJSON());
    this.manufactureService.updateManufactureById(this.#electricCarId, this.#manufactureId, manufacture)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
