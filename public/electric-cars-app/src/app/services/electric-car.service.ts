import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectricCar } from '../cars/cars.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElectricCarService {

  constructor(private _http: HttpClient) {}

  base_url: string= environment.baseUrl;

  getAllElectricCars(): Observable<ElectricCar[]> {
    return this._http.get<ElectricCar[]>(this.base_url+"electric-cars");
  }

  getElectricCarById(_id: string): Observable<ElectricCar> {
    return this._http.get<ElectricCar>(this.base_url+"electric-cars/"+_id);
  }

  createElectricCar(car: ElectricCar): Observable<ElectricCar> {
    return this._http.post<ElectricCar>(this.base_url+"electric-cars", car.toJson());
  }

  updatePartiallyElectricCar(electricCar: Partial<ElectricCar>) {
    return this._http.patch(this.base_url+"electric-cars/"+electricCar._id, electricCar);
  }

  deleteElectricCarById(id: string) {
    return this._http.delete(this.base_url+"electric-cars/"+id);
  }
}
