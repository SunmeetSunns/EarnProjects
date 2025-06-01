import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getInitialLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private getInitialLoginStatus(): boolean {
    return JSON.parse(sessionStorage.getItem('isLoggedIn') || 'false');
  }

  setLoginStatus(status: boolean): void {
    sessionStorage.setItem('isLoggedIn', JSON.stringify(status));
    this.isLoggedInSubject.next(status);
  }

  logout(): void {
    sessionStorage.clear();
    this.setLoginStatus(false);
  }
}

