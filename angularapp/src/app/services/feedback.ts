import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Feedback {}
import { Injectable } from '@angular/core';
import { Feedback } from '../models/feedback.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  baseUrl = environment.backendUrl + 'api/feedback';

  constructor(private http: HttpClient) { }

  sendFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.baseUrl}`, feedback);
  }

  getAllFeedbacksByUserld(userld: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}/user/${userld}`);
  }

  deleteFeedback(feedbackld: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${feedbackld}`);
  }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}`);
  }

  getFeedbacksPaged(page: number, size: number): Observable<PageResponse<Feedback>> {
    const params = new HttpParams().set('page', page.toString())   .set('size', size.toString());
    return this.http.get<PageResponse<Feedback>>(`${this.baseUrl}/paged`, { params });
  }

  getAllFeedbacksByUserIdPaged(userId: number, page: number, size: number): Observable<PageResponse<Feedback>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PageResponse<Feedback>>(`${this.baseUrl}/user/${userId}/paged`, { params });
  }
}


