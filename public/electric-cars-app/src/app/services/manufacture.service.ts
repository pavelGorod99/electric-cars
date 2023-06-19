import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElectricCar, Manufacture } from '../cars/cars.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManufactureService {

  base_url: string= "http://localhost:3000/api/electric-cars/"

  constructor(private http: HttpClient) {}

  getManufactureById(electricCarId: string, maunfactureId: string): Observable<Manufacture> {
    return this.http.get<Manufacture>(this.base_url + electricCarId + "/manufacture/" + maunfactureId);
  }

  updateManufactureById(electricCarId: string, manufactureId: string, manufacture: Manufacture): Observable<Manufacture> {
    return this.http.put<Manufacture>(this.base_url + electricCarId + "/manufacture/" + manufactureId, manufacture.toJSON());
  }

  deleteManufactureById(electricCarId:string, manufactureId: string): Observable<Manufacture> {
    return this.http.delete<Manufacture>(this.base_url + electricCarId + "/manufacture/" + manufactureId);
  }

  createManufactures(electricCar: Partial<ElectricCar>) {
    return this.http.post(this.base_url+electricCar._id+"/manufactures", electricCar);
  }
}
