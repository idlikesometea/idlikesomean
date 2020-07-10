import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private authStatus = new Subject<boolean>();
  private authed: boolean = false;
  private userId: string;
  private tokenTimer: any;
  constructor(private httpClient: HttpClient, private router: Router) {}

  createUser(email:string, password:string) {
    const authData: AuthData = {email:email, password:password};
    this.httpClient.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatus.next(false);
      });
  }

  login(email:string, password: string) {
    const authData: AuthData = {email:email, password:password};
    this.httpClient
      .post<{message:string, token:string, expiresIn: number, userId: string}>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (response.token) {
          const expiresIn = response.expiresIn;
          this.authed = true;
          this.userId = response.userId;
          this.authStatus.next(true);
          this.setAuthTimer(response.expiresIn);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuth(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatus.next(false);
      });
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) return;
    const now = new Date();
    const duration = authData.expirationDate.getTime() - now.getTime();
    if (duration > 0) {
      this.token = authData.token;
      this.authed = true;
      this.userId = authData.userId;
      this.authStatus.next(true);
      this.setAuthTimer(duration / 1000);
    }
  }

  logout() {
    this.token = null;
    this.authed = false;
    this.userId = null;
    this.authStatus.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuth();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  isAuthed() {
    return this.authed;
  }

  private saveAuth(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuth() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expiration) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expiration),
      userId: userId
    }
  }
}
