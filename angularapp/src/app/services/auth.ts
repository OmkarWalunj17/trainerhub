import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';


export interface LoginResponse {
  status: string;
  challengeId: string;
}


export interface OtpVerifyResponse {
  token: string;
  userId: number;
  email: string;
  username: string;
  userRole: string;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {  

  
  private TOKEN_KEY = 'token';
  private CHALLENGE_KEY = 'challengeId';

  baseUrl = environment.backendUrl+'api/';
  constructor(private http:HttpClient) { }

  register(user:User):Observable<any>{
    return this.http.post<any>(this.baseUrl+"register", user);
  }

  login(email:string, password:string):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.baseUrl+"login", {email, password})
  }

  verifyOtp(challengeId: string, otp: string): Observable<OtpVerifyResponse> {
    return this.http.post<{
      token: string;
      userId: number;
      email: string;
      username: string;
      userRole: string;
    }>(this.baseUrl + "verify-otp", { challengeId, otp });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + "user/" + id);
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('accesstoken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getToken(): string | null
  {
    return localStorage.getItem('accesstoken');
  }


  getChallengeId(): string | null {
    return localStorage.getItem('challengeId');
  }

  
  logout(){
    localStorage.clear();
    window.location.reload();
  }
}