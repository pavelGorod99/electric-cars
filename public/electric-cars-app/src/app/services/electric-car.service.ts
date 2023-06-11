import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectricCar } from '../cars/cars.component';

@Injectable({
  providedIn: 'root'
})
export class ElectricCarService {

  constructor(private _http: HttpClient) {}

  base_url: string= "http://localhost:3000/api/"

  getAllElectricCars(): Observable<ElectricCar[]> {
    return this._http.get<ElectricCar[]>(this.base_url+"electric-cars");
  }

  getElectricCarById(_id: string): Observable<ElectricCar> {
    return this._http.get<ElectricCar>(this.base_url+"electric-cars/"+_id);
  }

  
}
