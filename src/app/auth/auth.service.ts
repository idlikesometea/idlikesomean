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
  constructor(private httpClient: HttpClient, private router: Router) {}

  createUser(email:string, password:string) {
    const authData: AuthData = {email:email, password:password};
    this.httpClient.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email:string, password: string) {
    const authData: AuthData = {email:email, password:password};
    this.httpClient.post<{message:string, token:string}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (response.token) {
          this.authed = true;
          this.authStatus.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.authed = false;
    this.authStatus.next(false);
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  isAuthed() {
    return this.authed;
  }
}
