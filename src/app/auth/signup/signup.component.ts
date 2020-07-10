import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading=false;
  private authStatusSub: Subscription;
  constructor(public auth: AuthService){}

  ngOnInit() {
    this.authStatusSub = this.auth.getAuthStatus()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.auth.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
