import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Payment {}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  public baseUrl = environment.backendUrl + 'api/payment';

  constructor(private http: HttpClient) { }

  createOrder(requirementId: number, amount: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create-order`, { requirementId, amount });
  }

  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify`, paymentData);
  }
}