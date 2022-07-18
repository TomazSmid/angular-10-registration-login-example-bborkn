import { Component } from '@angular/core';

import { AuthService } from './services';
import { ClientAuth } from './models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  clientAuth: ClientAuth;

  constructor(private authService: AuthService) {
    this.authService.clientAuth$.subscribe((x) => (this.clientAuth = x));
  }

  logout() {
    this.authService.logout();
  }
}
