import { Component } from '@angular/core';

import { AuthService } from './services';
import { ClientAuth } from './models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  clientAuth$ = this.authService.clientAuth$;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
