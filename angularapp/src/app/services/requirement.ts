import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Requirement {}
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Requirement } from '../models/requirement.model';
import { Trainer } from '../models/trainer.model';
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
export class RequirementService {

  public baseUrl = environment.backendUrl + 'api/requirement';

  constructor(private http: HttpClient) { }

  getAllRequirements(): Observable<Requirement[]> {
    return this.http.get<Requirement[]>(this.baseUrl);
  }

  getRequirementsByManagerPaged(managerId: number, page: number, size: number, search?: string, status?: string): Observable<PageResponse<Requirement>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (search && search.trim()) params = params.set('search', search.trim());
    if (status && status.trim()) params = params.set('status', status.trim());
    return this.http.get<PageResponse<Requirement>>(`${this.baseUrl}/manager/${managerId}/paged`,{params});
  }

  getSelectedRequirementsPagedByManager(managerId: number,page: number,size: number,search?: string): Observable<PageResponse<Requirement>> 
  {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<PageResponse<Requirement>>(`${this.baseUrl}/manager/${managerId}/selected/paged`,{ params });
  }

  getRequirementById(requirementId: number): Observable<Requirement> {
    return this.http.get<Requirement>(this.baseUrl + '/' + requirementId);
  }

  addRequirement(requirement: Requirement): Observable<Requirement> {
    return this.http.post<Requirement>(this.baseUrl, requirement);
  }

  updateRequirement(requirementId: number, requirement: Requirement): Observable<Requirement> {
    return this.http.put<Requirement>(this.baseUrl + '/' + requirementId, requirement);
  }

  getRequirementsByTrainerId(trainerId: number): Observable<Requirement> {
    return this.http.get<Requirement>(`${this.baseUrl}/trainer/${trainerId}`);
  }

  deleteRequirement(requirementId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + requirementId);
  }

  assignTrainer(requirementId: number, requirement: Requirement): Observable<Requirement> {
    return this.http.put<Requirement>(`${this.baseUrl}/${requirementId}`, requirement);
  }

}
