import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Trainer {}
import { Injectable } from '@angular/core';
import { Trainer } from '../models/trainer.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  baseUrl = environment.backendUrl+"api/trainer"
  constructor(private http:HttpClient) { }
 
  getAllTrainers():Observable<Trainer[]>{
    return this.http.get<Trainer[]>(this.baseUrl);
  }
 
  getTrainerById(trainerId:number):Observable<Trainer>{
    return this.http.get<Trainer>(this.baseUrl+"/"+trainerId);
  }
 
  addTrainer(trainer: Trainer):Observable<Trainer>{
    return this.http.post<Trainer>(this.baseUrl, trainer);
  }
 
  updateTrainer(trainerId:number, trainer:Trainer):Observable<Trainer>{
    return this.http.put<Trainer>(this.baseUrl+"/"+trainerId, trainer);
  }
 
  deleteTrainer(trainerId:number):Observable<Trainer>{
    return this.http.delete<Trainer>(this.baseUrl+"/"+trainerId);
  }
 
  getTrainerResume(trainerId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/${trainerId}/resume`,
      { responseType: 'blob' }
    );
  }
 
}
 
 