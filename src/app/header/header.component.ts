import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private authListener: Subscription;
  authed: boolean = false;
  constructor(private authService: AuthService){}

  ngOnInit() {
    this.authed = this.authService.isAuthed();
    this.authListener = this.authService.getAuthStatus()
      .subscribe(authed => {
        this.authed = authed;
      })
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListener.unsubscribe();
  }
}
