// src/app/services/http-wrapper.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviornment } from '../../enviornments/enviornment';
import { Observable } from 'rxjs';
// https://earnprojects-backend.onrender.com
@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {
  private baseUrl = enviornment.baseUrl;

  constructor(private http: HttpClient) {}

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
