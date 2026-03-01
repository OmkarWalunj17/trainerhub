import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Settings {}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private baseUrl = environment.backendUrl + 'api/settings/auto-assign';
 
  constructor(private http: HttpClient) {}
 
  getAutoAssignStatus(): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl);
  }
 
  toggleAutoAssign(status: boolean): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl, status);
  }
}